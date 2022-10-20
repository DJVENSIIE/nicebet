package ca.usherbrooke.bonpari.view

import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match

class MatchItemViewHolder (view: View) : RecyclerView.ViewHolder(view) {

    // todo: terrain? and nested views / clean this mess
    fun bind(match: Match, onMatchSelected: (Match)->Unit) {
        itemView.context.apply {
            match.Player1.apply {
                playerName1.text = getString(R.string.player_name, "$firstName $lastName")
                playerCountry1.text = getString(R.string.player_country, country)
                playerAge1.text = getString(R.string.player_age, age)
            }
            match.Player2.apply {
                playerName2.text = getString(R.string.player_name, "$firstName $lastName")
                playerCountry2.text = getString(R.string.player_country, country)
                playerAge2.text = getString(R.string.player_age, age)
            }
            matchStartingAt.text = getString(R.string.match_starting_at, match.tournament, match.startingAt)

            moreButton.setOnClickListener {
                onMatchSelected(match)
            }
        }
    }

    val moreButton: Button = view.findViewById(R.id.more)
    val matchStartingAt: TextView = view.findViewById(R.id.match_starting_at)
    val playerName1: TextView = view.findViewById(R.id.player_name1)
    val playerName2: TextView = view.findViewById(R.id.player_name2)
    val playerCountry1: TextView = view.findViewById(R.id.player_country_1)
    val playerCountry2: TextView = view.findViewById(R.id.player_country_2)
    val playerAge1: TextView = view.findViewById(R.id.player_age_1)
    val playerAge2: TextView = view.findViewById(R.id.player_age_2)
}