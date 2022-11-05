package ca.usherbrooke.bonpari.api.events

import androidx.recyclerview.widget.DiffUtil
import ca.usherbrooke.bonpari.api.Match
import com.squareup.moshi.FromJson
import com.squareup.moshi.Json
import org.json.JSONObject

open class MatchEvent(val time: Int) {
    companion object MatchEventDiffCallback : DiffUtil.ItemCallback<MatchEvent>() {
        override fun areItemsTheSame(oldItem: MatchEvent, newItem: MatchEvent): Boolean {
            return oldItem == newItem
        }

        // fix bug, same result + type, but not same time :(
        override fun areContentsTheSame(oldItem: MatchEvent, newItem: MatchEvent): Boolean {
            return areItemsTheSame(oldItem, newItem)
        }
    }
}

data class MatchEventJson(@Json(name = "type") val type : Int,
                          @Json(name = "result") val result : String,
                          @Json(name = "time") val time : Int) {
    companion object {
        fun fromJsonObject(jsonObject: JSONObject) : MatchEventJson {
            return MatchEventJson(
                jsonObject.getInt("type"),
                jsonObject.getString("result"),
                jsonObject.getInt("time")
            )
        }
    }
}

object MatchEventJsonAdapter {
    @Suppress("unused") @FromJson
    fun eventFromJson(eventJson: MatchEventJson): MatchEvent {
        val r = eventJson.result
        val t = eventJson.time
        return when(eventJson.type) {
            // note: "-0" is "0"
            1 -> ContestationMatchEvent(r.toInt() == Match.PlayerIndex.Player1.index, !r.startsWith("-"), t)
            2 -> PointMatchEvent(r.toInt() == Match.PlayerIndex.Player1.index, t)
            3 -> SetMatchEvent(t)
            else -> throw IllegalArgumentException("Event type not supported.")
        }
    }
}