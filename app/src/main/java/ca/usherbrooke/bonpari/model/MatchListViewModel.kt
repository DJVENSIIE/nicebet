package ca.usherbrooke.bonpari.model

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.Player
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MatchListViewModel : ViewModel() {

    private var _matches = MutableLiveData(listOf<Match>())

    val matches: LiveData<List<Match>>
        get() = _matches

    init {
        viewModelScope.launch {
            addMatch(Match(AlbertRamos, MilosRaonic, '1', "Hale", "13h30"))
            addMatch(Match(MilosRaonic, AndyRoddick, '2', "Hale", "14h30"))
            addMatch(Match(AndyRoddick, AndyMurray, '1', "Hale", "16h30"))
            addMatch(Match(AndyMurray, AlbertRamos, '2', "Hale", "17h30"))
        }
    }

    private suspend fun addMatch(match: Match) {
        delay(5000)
        _matches.value = mutableListOf<Match>().apply {
            addAll(_matches.value!!)
            add(match)
        }
    }

    companion object {
        private val AlbertRamos = Player("Albert", "Ramos", 28, 56, "Espagne")
        private val MilosRaonic = Player("Milos", "Raonic", 28, 16, "Canada")
        private val AndyRoddick = Player("Andy", "Roddick", 36, 1000, "États-Unis")
        private val AndyMurray = Player("Andy", "Murray", 28, 132, "Angleterre")
    }
}