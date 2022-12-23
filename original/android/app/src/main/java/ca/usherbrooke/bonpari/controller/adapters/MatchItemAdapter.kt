package ca.usherbrooke.bonpari.controller.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.lifecycle.LiveData
import androidx.recyclerview.widget.ListAdapter
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.MatchSummary
import ca.usherbrooke.bonpari.view.MatchItemViewHolder

class MatchItemAdapter(private val items: LiveData<List<MatchSummary>>, private val onMatchSelected: (MatchSummary)->Unit)
    : ListAdapter<MatchSummary, MatchItemViewHolder>(MatchSummary) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MatchItemViewHolder {
        return MatchItemViewHolder(LayoutInflater.from(parent.context)
            .inflate(R.layout.match_item, parent, false))
    }

    override fun onBindViewHolder(holder: MatchItemViewHolder, position: Int) {
        holder.bind(items.value!![position], onMatchSelected)
    }

    override fun getItemCount(): Int {
        return items.value?.size ?: 0
    }
}