package ca.usherbrooke.bonpari.api

import androidx.recyclerview.widget.DiffUtil
import com.squareup.moshi.Json
import java.io.Serializable

data class Match(
    @Json(name = "id") val id: Int,
    @Json(name = "joueur1") val Player1: Player,
    @Json(name = "joueur2") val Player2: Player,
    @Json(name = "terrain") val terrain: Char,
    @Json(name = "tournoi") val tournament: String,
    @Json(name = "heure_debut") val startingAt: String,
    @Json(name = "pointage") val score: Pointage,
    @Json(name = "temps_partie") val temps_partie: Double,
    @Json(name = "serveur") val serveur: Int,
    @Json(name = "vitesse_dernier_service") val vitesse_dernier_service: Double,
    @Json(name = "nombre_coup_dernier_echange") val nombre_coup_dernier_echange: Int,
    @Json(name = "constestation") val contestation: List<Int>
) : Serializable {

    // todo: one method for two players
    //  and use enums instead of "0", "1"...

    fun getPlayer1Score(set: Int) = getPlayerScore(0, set)
    fun getPlayer2Score(set: Int) = getPlayerScore(1, set)

    fun getPlayer1Game() = score.echange[0].toString()
    fun getPlayer2Game() = score.echange[1].toString()

    fun getPlayer1Reclamations() = contestation[0].toString()
    fun getPlayer2Reclamations() = contestation[1].toString()

    fun isAtService(player: Int): Boolean {
        return if (player == 1) {
            (serveur == 0)
        } else {
            (serveur != 0)
        }
    }

    private fun getPlayerScore(index: Int, set: Int): String {
//        Log.d("CAL", "I: $index, set: $set size:${score.jeu.size}")
        return if (score.game.size >= set) {
            // sets are 0, 1, 2, not "1", "2", "3" as provided
            score.game[set-1][index].toString()
        } else {
            ""
        }
    }

    companion object MatchDiffCallback : DiffUtil.ItemCallback<Match>() {
        // ex: id changed
        override fun areItemsTheSame(oldItem: Match, newItem: Match): Boolean {
            return oldItem == newItem || oldItem.id == newItem.id
        }

        // ex: attributes/values changed
        // FOR NOW, there is no information displayed on the list, that may change
        // so, we don't need that
        override fun areContentsTheSame(oldItem: Match, newItem: Match): Boolean {
            return oldItem == newItem || oldItem.id == newItem.id
        }
    }
}