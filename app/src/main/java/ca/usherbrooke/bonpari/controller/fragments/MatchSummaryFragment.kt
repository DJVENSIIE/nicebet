package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import ca.usherbrooke.bonpari.controller.menus.RefreshMenuProvider
import ca.usherbrooke.bonpari.databinding.FragmentMatchSummaryBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel

class MatchSummaryFragment : Fragment() {
    private val viewModel: MatchListViewModel by activityViewModels()
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
        binding.viewModel = viewModel
        binding.lifecycleOwner = viewLifecycleOwner
        binding.matchMarker = "°"
    }
}