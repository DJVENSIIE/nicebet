package ca.usherbrooke.bonpari.api

import ca.usherbrooke.bonpari.api.events.MatchEvent
import com.squareup.moshi.Json

class Match(
    @Json(name = "id") id: Int,
    @Json(name = "joueur1") Player1: Player,
    @Json(name = "joueur2") Player2: Player,
    @Json(name = "terrain") terrain: Char,
    @Json(name = "tournoi") tournament: String,
    @Json(name = "heure_debut") startingAt: String,
    @Json(name = "pointage") val score: Pointage,
    @Json(name = "temps_partie") val temps_partie: Int,
    @Json(name = "serveur") val serveur: Int,
    @Json(name = "constestation") val contestation: List<Int>,
    @Json(name = "pariPossible") val bettingAvailable: Boolean,
    @Json(name = "events") val events: List<MatchEvent>,
    @Json(name = "paris") val bets: Map<String, Bet>,
    @Json(name = "gains") val earnings: Map<String, Earning>
) : MatchSummary(id, Player1, Player2, terrain, tournament, startingAt) {

    fun getPlayerNormalizedName(player: PlayerIndex): String {
        return if (player.index == PlayerIndex.Player1.index) Player1.getFullName()
        else Player2.getFullName()
    }

    fun terrainAsInt() = terrain.digitToInt()

    fun getPlayerGame(player: PlayerIndex) = score.echange[player.index].toString()

    fun getPlayerReclamations(player: PlayerIndex) = contestation[player.index].toString()

    fun isAtServiceAndFinished(player: PlayerIndex): Boolean
        = !score.final && isAtService(player)

    private fun isAtService(player: PlayerIndex): Boolean {
        return if (player == PlayerIndex.Player1) {
            (serveur == 0)
        } else {
            (serveur != 0)
        }
    }

    fun hasWon(player: PlayerIndex) =
        score.final && score.manches[player.index] == 2

    fun getPlayerScore(playerIndex: PlayerIndex, setIndex: SetIndex): String {
//        Log.d("CAL", "I: ${playerIndex.index}, set: ${setIndex.index} size:${score.game.size}")
        return if (score.game.size >= setIndex.index+1) {
            // sets are 0, 1, 2, not "1", "2", "3" as provided
            score.game[setIndex.index][playerIndex.index].toString()
        } else {
            ""
        }
    }

    fun getPlayer(playerId: PlayerIndex) =
        if (playerId.index == 0) Player1 else Player2

    enum class PlayerIndex(val index: Int) {
        Player1(0),
        Player2(1),
    }

    enum class SetIndex(val index: Int) {
        Set1(0),
        Set2(1),
        Set3(2),
    }

    companion object {
        fun fromSummary(matchSummary: MatchSummary): Match {
            return Match(
                matchSummary.id, matchSummary.Player1, matchSummary.Player2,
                matchSummary.terrain, matchSummary.tournament, matchSummary.startingAt,
                Pointage(listOf(), listOf(), listOf(0,0), false),
                0,
                -1,
                listOf(0,0),
                false,
                listOf(),
                mapOf(),
                mapOf()
            )
        }
    }
}