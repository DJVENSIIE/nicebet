package ca.usherbrooke.bonpari.controller.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.lifecycle.LiveData
import androidx.recyclerview.widget.ListAdapter
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.MatchEvent
import ca.usherbrooke.bonpari.view.EventItemViewHolder

class EventListAdapter(private val match: LiveData<Match>,
                       private val context: Context) : ListAdapter<MatchEvent, EventItemViewHolder>(MatchEvent) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EventItemViewHolder {
        return EventItemViewHolder(
            LayoutInflater.from(parent.context)
            .inflate(R.layout.event_item, parent, false))
    }

    override fun onBindViewHolder(holder: EventItemViewHolder, position: Int) {
        match.value!!.let {
            holder.bind(it, it.events[it.events.size-position-1], context)
        }
    }

    override fun getItemCount(): Int {
        return match.value?.events?.size ?: 0
    }
}