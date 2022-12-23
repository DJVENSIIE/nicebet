package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.adapters.MatchItemAdapter
import ca.usherbrooke.bonpari.databinding.FragmentListMatchBinding

class ListMatchFragment : BaseFragment() {
    private lateinit var binding: FragmentListMatchBinding
    override val onRefresh = {
        viewModel.refreshMatches()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentListMatchBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // recyclerView
        binding.recyclerView.adapter = MatchItemAdapter(viewModel.matches) {
            viewModel.updateSelectedMatch(it)
            findNavController().navigate(R.id.action_listMatchFragment_to_matchSummaryFragment)
        }
        binding.recyclerView.addItemDecoration(
            DividerItemDecoration(requireContext(), DividerItemDecoration.VERTICAL)
        )
        binding.recyclerView.itemAnimator = null

        // when the list of matches changes
        // update recycleView reference
        viewModel.matches.observe(viewLifecycleOwner) { p ->
            with(binding.recyclerView.adapter as MatchItemAdapter) {
                Log.d("CAL","Adapter will be updated.")
                if (p != null)
                    submitList(p)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        // no selection anymore
        viewModel.updateSelectedMatch(null)
    }
}