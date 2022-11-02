package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.databinding.BindingAdapter
import androidx.recyclerview.widget.RecyclerView
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.BetResult
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.MatchEvent
import ca.usherbrooke.bonpari.controller.adapters.EventListAdapter
import ca.usherbrooke.bonpari.databinding.FragmentMatchSummaryBinding
import ca.usherbrooke.bonpari.model.LocalStorage
import ca.usherbrooke.bonpari.view.formatSecondToHoursMinutes
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import java.text.NumberFormat

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
        LocalStorage.setDeviceId(activity?.contentResolver)

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
                Log.d("CAL", "Bet ${input.text} on $fullName.")
                viewModel.betOn(playerId, input.text.toString().toFloat())
            }
            .show()
    }

    companion object {
        @BindingAdapter("app:showServiceIcon") @JvmStatic
        fun bindImageView(imageView: ImageView, show: Boolean) {
            imageView.visibility = if (show) View.VISIBLE else View.INVISIBLE
            imageView.contentDescription = imageView.context.getString(if (show) R.string.at_service else R.string.not_at_service)
        }

        @BindingAdapter("app:showWinIcon") @JvmStatic
        fun bindShowWinIcon(imageView: ImageView, show: Boolean) {
            imageView.visibility = if (show) View.VISIBLE else View.INVISIBLE
        }

        @BindingAdapter("app:eventList") @JvmStatic
        fun bindRecyclerView(recyclerView: RecyclerView, data: List<MatchEvent>) {
            val adapter = recyclerView.adapter as EventListAdapter
            adapter.submitList(data)
            // https://stackoverflow.com/questions/53248736/listadapter-submitlist-how-to-scroll-to-beginning
            recyclerView.scrollToPosition(0)
        }

        @BindingAdapter("app:enableIfAvailable") @JvmStatic
        fun bindEnableIfAvailable(view: LinearLayout, show: Boolean) {
            view.visibility = if (show) View.VISIBLE else View.GONE
        }

        @BindingAdapter("app:matchDuration") @JvmStatic
        fun bindMatchDuration(view: TextView, seconds: Int) {
            view.text = view.context.getString(
                R.string.match_duration,
                formatSecondToHoursMinutes(seconds, true)
            )
        }

        @BindingAdapter("app:showResultsIfAvailable") @JvmStatic
        fun bindShowResultsIfAvailable(view: TextView, match: Match) {
            val deviceId = LocalStorage.deviceId
            // show bet
            if (!match.score.final) {
                // if no bet
                if (!match.bets.containsKey(deviceId)) {
                    // and can't bet: show closed
                    if (!match.bettingAvailable) {
                        view.setText(R.string.betting_closed)
                    }
                } // otherwise, show bet
                else {
                    Log.d("CAL", "Match: $match")
                    val bet = match.bets[deviceId]!!
                    showBetInView(view, bet.betOnJ1, bet.betOnJ2)
                }
            }
            // show outcome
            else if (match.earnings.containsKey(deviceId)) {
                val bet = match.earnings[deviceId]!!
                view.text = view.context.getString(R.string.you_won, NumberFormat.getCurrencyInstance().format(bet.amount))
            } else {
                // well, no bet, no earning
                view.setText(R.string.match_ended)
            }
        }

        @BindingAdapter("app:updateIfAvailable") @JvmStatic
        fun bindUpdateIfAvailable(view: TextView, bet: BetResult?) {
            if (bet == null) return
            val context = view.context
            if (bet.wasAccepted()) {
                showBetInView(view, bet.betOnJ1, bet.betOnJ2)
            } else {
                Toast.makeText(context, context.getString(R.string.betting_closed), Toast.LENGTH_SHORT).show()
            }
        }

        @JvmStatic
        fun showBetInView(view: TextView, bet1: Float, bet2: Float) {
            val ci = NumberFormat.getCurrencyInstance()
            view.text = view.context.getString(R.string.your_bets, ci.format(bet1), ci.format(bet2))
            Log.d("CAL", "Show bet: $bet1-$bet2")
        }
    }
}