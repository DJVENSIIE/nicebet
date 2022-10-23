package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.databinding.BindingAdapter
import androidx.recyclerview.widget.RecyclerView
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.MatchEvent
import ca.usherbrooke.bonpari.controller.adapters.EventListAdapter
import ca.usherbrooke.bonpari.databinding.FragmentMatchSummaryBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class MatchSummaryFragment : BaseFragment() {
    private lateinit var binding: FragmentMatchSummaryBinding
    override val onRefresh = {
        viewModel.refreshSelected()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentMatchSummaryBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // recyclerView
        val recyclerView: RecyclerView = requireActivity().findViewById(R.id.events_recycler_view)
        recyclerView.adapter = EventListAdapter(viewModel.selectedMatch, requireContext())

        // set variables
        binding.let {
            it.lifecycleOwner = viewLifecycleOwner
            it.matchMarker = "°"
            it.viewModel = viewModel
            it.matchSummary = this
            // todo: we should improve this
            it.player1 = Match.PlayerIndex.Player1
            it.player2 = Match.PlayerIndex.Player2
            it.set1 = Match.SetIndex.Set1
            it.set2 = Match.SetIndex.Set2
            it.set3 = Match.SetIndex.Set3
        }
    }

    fun betOn(playerId: Match.PlayerIndex) {
        val input = EditText(requireContext())
        val fullName = viewModel.selectedMatch.value!!.getPlayer(playerId).getFullName()

        MaterialAlertDialogBuilder(requireContext())
            .setTitle(getString(R.string.how_much_to_bet, fullName))
            .setCancelable(false)
            .setView(input)
            .setNegativeButton(getString(R.string.cancel_bet_popup)) { _, _ ->
            }
            .setPositiveButton(getString(R.string.parier)) { _, _ ->
                // todo: errors are not handled
                Log.d("CAL", "Bet ${input.text} on $fullName.")
                viewModel.betOn(playerId, input.text.toString().toInt())
            }
            .show()
    }

    companion object {
        @BindingAdapter("app:showServiceIcon") @JvmStatic
        fun bindImageView(imageView: ImageView, show: Boolean) {
            imageView.visibility = if (show) View.VISIBLE else View.INVISIBLE
            imageView.contentDescription = imageView.context.getString(if (show) R.string.at_service else R.string.not_at_service)
        }

        @BindingAdapter("app:eventList") @JvmStatic
        fun bindRecyclerView(recyclerView: RecyclerView, data: List<MatchEvent>) {
            val adapter = recyclerView.adapter as EventListAdapter
            adapter.submitList(data)
        }

        @BindingAdapter("app:enableIfAvailable") @JvmStatic
        fun bindEnableIfAvailable(view: LinearLayout, show: Boolean) {
            view.visibility = if (show) View.VISIBLE else View.GONE
        }

        @BindingAdapter("app:updateIfAvailable") @JvmStatic
        fun bindUpdateIfAvailable(view: TextView, selectedMatch: Match) {
            view.visibility = if (!selectedMatch.bettingAvailable) View.VISIBLE else View.GONE
            view.setText(R.string.betting_done)
        }
    }
}