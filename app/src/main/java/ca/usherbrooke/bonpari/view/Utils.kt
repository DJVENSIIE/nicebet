package ca.usherbrooke.bonpari.view

import android.content.Context
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.Player
import ca.usherbrooke.bonpari.api.events.ContestationMatchEvent
import ca.usherbrooke.bonpari.api.events.MatchEvent
import ca.usherbrooke.bonpari.api.events.PointMatchEvent
import ca.usherbrooke.bonpari.api.events.SetMatchEvent

fun formatSecondToHoursMinutes(seconds: Int, addSeconds: Boolean = false): String {
    var h = (seconds / 3600).toString()
    var m = ((seconds / 60) % 60).toString()
    if (h.length == 1) h = "0$h"
    if (m.length == 1) m = "0$m"

    if (addSeconds) {
        var s = (seconds % 60).toString()
        if (s.length == 1) s = "0$s"
        return "$h:$m:$s"
    }

    return "$h:$m"
}

fun MatchEvent.formatToString (match: Match, context: Context) : String {
    return when (this) {
        is ContestationMatchEvent -> toString(if (isPlayer1) match.Player1 else match.Player2, context)
        is PointMatchEvent -> toString(if (isPlayer1) match.Player1 else match.Player2, context)
        is SetMatchEvent -> toString(context)
        else -> "Unknown event."
    }
}

fun ContestationMatchEvent.toString(player: Player, context: Context) : String {
    return context.getString(R.string.contestation_by,
        player,
        if (hasContestationPassed) context.getString(R.string.contestation_accepted)
        else context.getString(R.string.contestation_refused)
    )
}

fun PointMatchEvent.toString(player: Player, context: Context) : String {
    return context.getString(R.string.point_scored_by, player.getFullName())
}

fun SetMatchEvent.toString(context: Context) : String {
    return context.getString(R.string.setChanged)
}