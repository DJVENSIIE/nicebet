package ca.usherbrooke.bonpari.api

import androidx.recyclerview.widget.DiffUtil
import com.squareup.moshi.Json
import java.io.Serializable

// todo: not a problem in the code, but "-0" is "0"
data class MatchEvent(@Json(name = "type") val type : Int,
                      @Json(name = "result") val result : String,
                      @Json(name = "time") val time : Int) : Serializable {

    fun isContestation() = type == 1
    fun isPointScored() = type == 2
    fun isSetChanged() = type == 3

    data class ContestationData(val isPlayer1: Boolean, val hasContestationPassed: Boolean)
    data class PointData(val isPlayer1: Boolean)
    class SetChangedData

    val contestation : ContestationData?
        get() {
            return if (isContestation())
                if (result.startsWith("-"))
                    ContestationData(result.toInt() == Match.PlayerIndex.Player1.index, false)
                else
                    ContestationData(result.toInt() == Match.PlayerIndex.Player1.index, true)
            else
                null
        }

    val point : PointData?
        get() {
            return if (isPointScored())
                PointData(result.toInt() == Match.PlayerIndex.Player1.index)
            else
                null
        }

    val setChanged: SetChangedData?
        get() {
            return if (isSetChanged())
                return SetChangedData()
            else
                null
        }

    companion object MatchEventDiffCallback : DiffUtil.ItemCallback<MatchEvent>() {
        override fun areItemsTheSame(oldItem: MatchEvent, newItem: MatchEvent): Boolean {
            return oldItem.time == newItem.time
        }

        // fix bug, same result + type, but not same time :(
        override fun areContentsTheSame(oldItem: MatchEvent, newItem: MatchEvent): Boolean {
            return oldItem.type == newItem.type
                    && oldItem.result == newItem.result
                    && oldItem.time == newItem.time
        }
    }
}
