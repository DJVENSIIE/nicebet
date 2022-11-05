package ca.usherbrooke.bonpari.model

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.*
import kotlinx.coroutines.launch
import java.net.SocketTimeoutException

class MatchListViewModel : ViewModel() {
    private val _matchesRefreshManual = MutableLiveData<List<MatchSummary>>()
    val matches: LiveData<List<MatchSummary>> = _matchesRefreshManual

    private val _selectedMatch = MutableLiveData<Match>()
    val selectedMatch : LiveData<Match> = _selectedMatch

    private val _fetchingRepositoryError = MutableLiveData<RepositoryError>()
    val fetchingRepositoryError : LiveData<RepositoryError> = _fetchingRepositoryError

    private val _betStatus = MutableLiveData<BetResult?>()
    val betStatus: LiveData<BetResult?> = _betStatus

    private fun executeRequest(logName: String, request: suspend () -> Unit) {
        Log.d("CAL", "#$logName")
        viewModelScope.launch {
            try {
               request()
            } catch (e: SocketTimeoutException) {
                _fetchingRepositoryError.value = RepositoryError(e.message.toString(), ErrorCode.CONNECTION_TIME_OUT)
            } catch (e: Exception) {
                Log.e("CAL", e.toString())
                e.printStackTrace()
                _fetchingRepositoryError.value = RepositoryError(e.message.toString(), ErrorCode.UNKNOWN)
            }
        }
    }

    fun refreshSelected() {
        if (!LocalStorage.isFollowingAMatch()) return
        executeRequest("refreshSelected") {
            _selectedMatch.value = BonPariApi.retrofitService.getGame(_selectedMatch.value!!.id)
            Log.d("CAL", "Update selected: ${_selectedMatch.value}")
        }
    }

    fun refreshMatches() {
        executeRequest("refreshMatches") {
            _matchesRefreshManual.value = BonPariApi.retrofitService.getAllGames()
            Log.d("CAL", "refreshMatches#Has found ${_matchesRefreshManual.value!!.size} matches.")
        }
    }

    fun updateSelectedMatch(match: MatchSummary?) {
        if (match == null) {
            LocalStorage.currentMatchFollowedId = LocalStorage.NO_FOLLOWED_MATCH
            return
        }
        // set followed
        LocalStorage.currentMatchFollowedId = match.id
        // temporary
        _selectedMatch.value = Match.fromSummary(match)
    }

    fun betOn(playerId: Match.PlayerIndex, amount: Float) {
        executeRequest("betOn") {
            _betStatus.value = BonPariApi.retrofitService.bet(
                BetPostBody(
                    LocalStorage.deviceId,
                    amount,
                    playerId.index,
                    _selectedMatch.value!!.id
                )
            )
            Log.d("CAL", "bet: ${_betStatus.value}")
        }
    }

    data class RepositoryError(val rawMessage: String, val code: ErrorCode)
    enum class ErrorCode {
        CONNECTION_TIME_OUT,
        UNKNOWN
    }
}