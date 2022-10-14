package ca.usherbrooke.bonpari.views

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.lifecycle.LiveData
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.controller.ResumeMatchActivity

class MatchItemAdapter(private val items: LiveData<List<Match>>) : ListAdapter<Match, MatchItemAdapter.ViewHolder>(DiffCallback) {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val moreButton: Button = view.findViewById(R.id.more)
        val matchStartingAt: TextView = view.findViewById(R.id.match_starting_at)
        val playerName1: TextView = view.findViewById(R.id.player_name1)
        val playerName2: TextView = view.findViewById(R.id.player_name2)
        val playerCountry1: TextView = view.findViewById(R.id.player_country_1)
        val playerCountry2: TextView = view.findViewById(R.id.player_country_2)
        val playerAge1: TextView = view.findViewById(R.id.player_age_1)
        val playerAge2: TextView = view.findViewById(R.id.player_age_2)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(LayoutInflater.from(parent.context)
            .inflate(R.layout.match_item, parent, false))
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        // todo: terrain? and nested views / clean this mess
        holder.itemView.context.apply {
            val match = items.value!![position];
            match.Player1.apply {
                holder.playerName1.text = getString(R.string.player_name, "$firstName $lastName")
                holder.playerCountry1.text = getString(R.string.player_country, country)
                holder.playerAge1.text = getString(R.string.player_age, age)
            }
            match.Player2.apply {
                holder.playerName2.text = getString(R.string.player_name, "$firstName $lastName")
                holder.playerCountry2.text = getString(R.string.player_country, country)
                holder.playerAge2.text = getString(R.string.player_age, age)
            }
            holder.matchStartingAt.text = getString(R.string.match_starting_at, match.tournament, match.startingAt)

            holder.moreButton.setOnClickListener {
                val intent = Intent(this, ResumeMatchActivity::class.java)
                intent.putExtra("match", match)
                startActivity(intent)
            }
        }


    }

    override fun getItemCount(): Int {
        return items.value!!.size
    }

    companion object DiffCallback : DiffUtil.ItemCallback<Match>() {
        // ex: id changed
        override fun areItemsTheSame(oldItem: Match, newItem: Match): Boolean {
            return oldItem == newItem
        }

        // ex: attributes/values changed
        override fun areContentsTheSame(oldItem: Match, newItem: Match): Boolean {
            return oldItem == newItem
        }
    }
}