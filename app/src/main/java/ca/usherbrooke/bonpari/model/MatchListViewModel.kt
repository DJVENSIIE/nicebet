package ca.usherbrooke.bonpari.model

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.api.BonPariFakeApi
import ca.usherbrooke.bonpari.api.Match
import kotlinx.coroutines.launch

class MatchListViewModel : ViewModel() {
    private var _matches = MutableLiveData(listOf<Match>())
    private var _selectedMatch = MutableLiveData<Match>(null)

    val matches: LiveData<List<Match>>
        get() = _matches

    val selectedMatch : LiveData<Match>
        get() = _selectedMatch

    init {
        updateMatch()
    }

    private fun updateMatch() {
        viewModelScope.launch {
            try {
                _matches.value = BonPariApi.retrofitService.getAllGames()
                Log.d("CAL", _matches.value.toString())
            } catch (e: Exception) {
                Log.e("CAL", e.message.toString())
                _matches.value = BonPariFakeApi.retrofitService.getAllGames()
            }
        }
    }

    fun updateSelectedMatch(match: Match) {
        _selectedMatch.value = match
    }
}