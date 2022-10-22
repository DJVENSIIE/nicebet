package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Json
import java.io.Serializable

data class MatchEvent(@Json(name = "type") val type : Int,
                      @Json(name = "result") val result : Int) : Serializable {

    fun isContestation() = type == 1
    fun isPointScored() = type == 2

    data class ContestationData(val isPlayer1: Boolean, val hasContestationPassed: Boolean)
    data class PointData(val isPlayer1: Boolean)

    val contestation : ContestationData?
        get() {
            return if (isContestation())
                if (result < 0)
                    ContestationData(result == -Match.PlayerIndex.Player1.index, false)
                else
                    ContestationData(result == Match.PlayerIndex.Player1.index, true)
            else
                null
        }
    val point : PointData?
        get() {
            return if (isPointScored())
                PointData(result == Match.PlayerIndex.Player1.index)
            else
                null
        }
}
