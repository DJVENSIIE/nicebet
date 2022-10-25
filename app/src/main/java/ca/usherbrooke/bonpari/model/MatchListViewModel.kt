package ca.usherbrooke.bonpari.model

import android.annotation.SuppressLint
import android.content.ContentResolver
import android.provider.Settings
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.BetBody
import ca.usherbrooke.bonpari.api.BetResult
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.model.LocalStorage.lastEventReceived
import kotlinx.coroutines.launch
import java.net.SocketTimeoutException

class MatchListViewModel : ViewModel() {
    private var deviceId: String? = null
    private val _matchesRefreshManual = MutableLiveData<List<Match>>()
    val matches: LiveData<List<Match>> = _matchesRefreshManual

    private val _selectedMatch = MutableLiveData<Match>()
    val selectedMatch : LiveData<Match> = _selectedMatch

    private val _fetchingRepositoryError = MutableLiveData<RepositoryError>()
    val fetchingRepositoryError : LiveData<RepositoryError> = _fetchingRepositoryError

    private val _betStatus = MutableLiveData<BetResult>()
    val betStatus: LiveData<BetResult>
        get() = _betStatus

    private fun executeRequest(logName: String, request: suspend () -> Unit) {
        Log.d("CAL", "#$logName")
        viewModelScope.launch {
            try {
               request()
            } catch (e: SocketTimeoutException) {
                _fetchingRepositoryError.value = RepositoryError(e.message.toString(), ErrorCode.CONNECTION_TIME_OUT)
            } catch (e: Exception) {
                Log.e("CAL", e.toString())
                _fetchingRepositoryError.value = RepositoryError(e.message.toString(), ErrorCode.UNKNOWN)
            }
        }
    }

    fun refreshSelected() {
        executeRequest("refreshSelected") {
            _selectedMatch.value = BonPariApi.retrofitService.getGame(_selectedMatch.value!!.id)
            _selectedMatch.value?.let {
                lastEventReceived[it.id] = it.events.size
            }
            Log.d("CAL", "Update selected: ${_selectedMatch.value}")
        }
    }

    fun refreshMatches() {
        executeRequest("refreshMatches") {
            _matchesRefreshManual.value = BonPariApi.retrofitService.getAllGames()
            // update selected match
            if (LocalStorage.isFollowingAMatch()) {
                LocalStorage.currentMatchFollowedId.let {
                    for (match in matches.value!!) {
                        if (match.id == it) {
                            Log.d("CAL", "Update selected OK.")
                            _selectedMatch.value = match
                            lastEventReceived[match.id] = match.events.size
                            break
                        }
                    }
                }
            }
            Log.d("CAL", "refreshMatches#Has found ${_matchesRefreshManual.value!!.size} matches.")
        }
    }

    fun updateSelectedMatch(match: Match?) {
        if (match == null) {
            LocalStorage.currentMatchFollowedId = LocalStorage.NO_FOLLOWED_MATCH
            return
        }

        match.let {
            _selectedMatch.value = it
            LocalStorage.currentMatchFollowedId = it.id
            // fix the fact that if no refresh
            // was called, then the "lastEventReceivedFlag" was not set
            lastEventReceived[it.id] = it.events.size
        }
    }

    fun betOn(playerId: Match.PlayerIndex, amount: Float) {
        executeRequest("betOn") {
            _betStatus.value = BonPariApi.retrofitService.bet(
                BetBody(
                    deviceId!!,
                    amount,
                    playerId.index,
                    _selectedMatch.value!!.id
                )
            )
            Log.d("CAL", "bet: ${_betStatus.value}")
        }
    }

    @SuppressLint("HardwareIds")
    fun setDeviceId(contentResolver: ContentResolver?) {
        if (deviceId != null) return
        deviceId = Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID);
    }

    data class RepositoryError(val rawMessage: String, val code: ErrorCode)
    enum class ErrorCode {
        CONNECTION_TIME_OUT,
        UNKNOWN
    }
}