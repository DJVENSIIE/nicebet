package ca.usherbrooke.bonpari.view

import android.content.Context
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.MatchEvent

fun MatchEvent.formatToString (match: Match, context: Context) : String {
    if (isContestation()) {
        return context.getString(R.string.contestation_by, contestation?.let {
            if (it.isPlayer1) match.Player1.getFullName()
            else match.Player2.getFullName()
        }, contestation?.let {
            if (it.hasContestationPassed) context.getString(R.string.contestation_accepted)
            else context.getString(R.string.contestation_refused)
        })
    }
    if (isPointScored()) {
        return context.getString(R.string.point_scored_by, point?.let {
            if (it.isPlayer1)
                match.Player1.getFullName()
            else
                match.Player2.getFullName()
        })
    }
    throw Exception()
}