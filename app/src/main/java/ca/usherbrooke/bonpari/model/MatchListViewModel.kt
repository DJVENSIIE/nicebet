package ca.usherbrooke.bonpari.model

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.Player
import ca.usherbrooke.bonpari.api.Pointage
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MatchListViewModel : ViewModel() {

    private var _matches = MutableLiveData(listOf<Match>())

    val matches: LiveData<List<Match>>
        get() = _matches

    init {
        viewModelScope.launch {
            val score1 = Pointage(
                listOf(1, 1),
                listOf(listOf(4, 2), listOf(6, 4),listOf(0, 0)),
                listOf(40,30),
                false,
                "test2"
            )

            val score2 = Pointage(
                listOf(1, 1),
                listOf(listOf(6, 2), listOf(3, 1),listOf(0, 0)),
                listOf(15,40),
                false,
                "test"
            )

            addMatch(Match(
                AlbertRamos,
                MilosRaonic,
                '2',
                "Hale",
                "13h00",
                score1,
                0.0,
                1.0,
                4,
                listOf(1, 1),
                "ticket"))
            addMatch(Match(MilosRaonic, AndyRoddick,  '1',
                "Hale",
                "12h30",
                score2,
                0.0,
                1.0,
                4,
                listOf(1, 1),
                "ticket"))


            //addMatch(Match(AndyRoddick, AndyMurray, '1', "Hale", "16h30"))
            //addMatch(Match(AndyMurray, AlbertRamos, '2', "Hale", "17h30"))
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