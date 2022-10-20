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

    val matches: LiveData<List<Match>>
        get() = _matches

    init {
        updateMatch()
    }

    fun updateMatch() {
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

    fun getMatchById(id: Int): Match =
        internalGetMatchById(id)!!

    private fun internalGetMatchById(id: Int): Match? {
        for (match in matches.value!!) {
            if (match.id == id)
                return match
        }
        return null
    }
}