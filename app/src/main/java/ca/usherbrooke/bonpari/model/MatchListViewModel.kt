package ca.usherbrooke.bonpari.model

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.api.Match
import kotlinx.coroutines.launch

class MatchListViewModel : ViewModel() {
    private val _matchesRefreshManual = MutableLiveData<List<Match>>()
    val matches: LiveData<List<Match>> = _matchesRefreshManual

    private val _selectedMatch = MutableLiveData<Match>(null)
    val selectedMatch : LiveData<Match> = _selectedMatch

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
                Log.d("CAL", "refreshMatches#Has found ${_matchesRefreshManual.value!!.size} matches.")
            } catch (e: Exception) {
                Log.e("CAL", e.message.toString())
            }
        }
    }

    fun updateSelectedMatch(match: Match) {
        _selectedMatch.value = match
    }
}