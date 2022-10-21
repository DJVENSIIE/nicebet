package ca.usherbrooke.bonpari.model

import android.content.Context
import android.util.Log
import androidx.lifecycle.*
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.api.Match
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.cancellable
import kotlinx.coroutines.flow.flow

class MatchListViewModel(context: Context) : ViewModel() {
    private var _matchesRefresh = generateRefreshLiveData()
    private var _selectedMatch = MutableLiveData<Match>(null)

    val matches: LiveData<List<Match>> = _matchesRefresh

    val selectedMatch : LiveData<Match>
        get() = _selectedMatch


    fun refreshSelected() {
        Log.d("CAL", "#refreshSelected")
    }

    fun refreshMatches() {
        Log.d("CAL", "#refreshMatches")
    }

    fun updateSelectedMatch(match: Match) {
        _selectedMatch.value = match
    }

    private fun generateRefreshLiveData() = flow {
        while(true) {
            try {
                val allGames = BonPariApi.retrofitService.getAllGames()
                Log.d("CAL", "generateRefresh#Has found ${allGames.size} matches.")
                emit(allGames) // Emits the result of the request to the flow
                delay(5000) // Suspends the coroutine for some time
            } catch (ce: CancellationException) {
                break
            } catch (e: Exception) {
                Log.e("CAL", e.message.toString())
            }
        }
    }.cancellable().asLiveData(viewModelScope.coroutineContext, 1500000L)
}

class MatchListViewModelFactory(private val context: Context) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return MatchListViewModel(context) as T
    }
}