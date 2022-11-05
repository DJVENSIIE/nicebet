package ca.usherbrooke.bonpari.api.events

import androidx.recyclerview.widget.DiffUtil

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