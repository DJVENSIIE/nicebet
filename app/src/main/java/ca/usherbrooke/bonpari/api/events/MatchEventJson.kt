package ca.usherbrooke.bonpari.api.events

import ca.usherbrooke.bonpari.api.Match
import com.squareup.moshi.FromJson
import com.squareup.moshi.Json

data class MatchEventJson(@Json(name = "type") val type : Int,
                          @Json(name = "result") val result : String,
                          @Json(name = "time") val time : Int)

class MatchEventJsonAdapter {
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