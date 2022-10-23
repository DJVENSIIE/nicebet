package ca.usherbrooke.bonpari.view

import android.content.Context
import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.MatchEvent
import java.text.SimpleDateFormat
import java.util.*

class EventItemViewHolder (view: View) : RecyclerView.ViewHolder(view) {

    private val formatter = SimpleDateFormat("H:mm:ss", Locale.getDefault())

    fun bind(match: Match, matchEvent: MatchEvent, context: Context) {
        body.text = matchEvent.formatToString(match, context)
        time.text = formatter.format(Date(matchEvent.time))
    }

    private val body : TextView = view.findViewById(R.id.event_item_body)
    private val time : TextView = view.findViewById(R.id.event_time)
}