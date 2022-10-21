package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.controller.menus.RefreshMenuProvider
import ca.usherbrooke.bonpari.databinding.FragmentMatchSummaryBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel
import ca.usherbrooke.bonpari.model.MatchListViewModelFactory

class MatchSummaryFragment : Fragment() {
    private val viewModel: MatchListViewModel by activityViewModels { MatchListViewModelFactory(requireContext()) }
    private lateinit var binding: FragmentMatchSummaryBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentMatchSummaryBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        // menu
        activity?.addMenuProvider(RefreshMenuProvider {
            viewModel.refreshSelected()
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
        // set variables
        binding.let {
            it.lifecycleOwner = viewLifecycleOwner
            it.matchMarker = "°"
            it.viewModel = viewModel
            // todo: we should improve this
            it.player1 = Match.PlayerIndex.Player1
            it.player2 = Match.PlayerIndex.Player2
            it.set1 = Match.SetIndex.Set1
            it.set2 = Match.SetIndex.Set2
            it.set3 = Match.SetIndex.Set3
        }
    }
}