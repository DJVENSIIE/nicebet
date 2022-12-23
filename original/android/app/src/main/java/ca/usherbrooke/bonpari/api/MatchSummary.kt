package ca.usherbrooke.bonpari.api

import androidx.recyclerview.widget.DiffUtil
import com.squareup.moshi.Json
import java.io.Serializable

open class MatchSummary(@Json(name = "id") val id: Int,
                        @Json(name = "joueur1") val Player1: Player,
                        @Json(name = "joueur2") val Player2: Player,
                        @Json(name = "terrain") val terrain: Char,
                        @Json(name = "tournoi") val tournament: String,
                        @Json(name = "heure_debut") val startingAt: String) : Serializable {

    companion object MatchDiffCallback : DiffUtil.ItemCallback<MatchSummary>() {
        // ex: id changed
        override fun areItemsTheSame(oldItem: MatchSummary, newItem: MatchSummary): Boolean {
            return oldItem == newItem || oldItem.id == newItem.id
        }

        // ex: attributes/values changed
        // FOR NOW, there is no information displayed on the list, that may change
        // so, we don't need that
        override fun areContentsTheSame(oldItem: MatchSummary, newItem: MatchSummary): Boolean {
            return oldItem == newItem || oldItem.id == newItem.id
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is MatchSummary) return false
        if (id != other.id) return false
        if (Player1 != other.Player1) return false
        if (Player2 != other.Player2) return false
        if (terrain != other.terrain) return false
        if (tournament != other.tournament) return false
        if (startingAt != other.startingAt) return false
        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + Player1.hashCode()
        result = 31 * result + Player2.hashCode()
        result = 31 * result + terrain.hashCode()
        result = 31 * result + tournament.hashCode()
        result = 31 * result + startingAt.hashCode()
        return result
    }
}