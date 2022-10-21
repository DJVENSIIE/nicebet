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
import kotlinx.coroutines.launch

class MatchListViewModel(context: Context) : ViewModel() {
    private val _matchesRefreshAuto = generateRefreshLiveData()
    private val _matchesRefreshManual = MutableLiveData<List<Match>>()
    private val liveDataMerger = MediatorLiveData<List<Match>>()
    val matches: LiveData<List<Match>> = liveDataMerger

    private val _selectedMatch = MutableLiveData<Match>(null)
    val selectedMatch : LiveData<Match> = _selectedMatch

    init {
        liveDataMerger.addSource(_matchesRefreshAuto) {
            liveDataMerger.value = it
        }
        liveDataMerger.addSource(_matchesRefreshManual) {
            liveDataMerger.value = it
        }
    }

    fun refreshSelected() {
        Log.d("CAL", "#refreshSelected")
        viewModelScope.launch {
            try {
                _selectedMatch.value = BonPariApi.retrofitService.getGame(_selectedMatch.value!!.id)
                Log.d("CAL", "Update selected: ${_selectedMatch.value}")
            } catch (e: Exception) {
                Log.e("CAL", e.message.toString())
            }
        }
    }

    fun refreshMatches() {
        Log.d("CAL", "#refreshMatches")
        viewModelScope.launch {
            try {
                _matchesRefreshManual.value = BonPariApi.retrofitService.getAllGames()
                Log.d("CAL", "refreshMatches#Has found ${_matchesRefreshManual.value!!.size} matches.")
            } catch (e: Exception) {
                Log.e("CAL", e.message.toString())
            }
        }
    }

    fun updateSelectedMatch(match: Match) {
        _selectedMatch.value = match
    }

    private fun generateRefreshLiveData() = flow {
        while(true) {
            try {
                val allGames = BonPariApi.retrofitService.getAllGames()
                Log.d("CAL", "generateRefresh#Has found ${allGames.size} matches.")

                // update selected match
                if (_selectedMatch.value != null) {
                    _selectedMatch.value?.apply {
                        for (match in matches.value!!) {
                            if (match.id == id) {
                                Log.d("CAL", "Update selected OK.")
                                _selectedMatch.value = match
                                break
                            }
                        }
                    }
                }

                emit(allGames) // Emits the result of the request to the flow
                delay(30000) // Suspends the coroutine for some time
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