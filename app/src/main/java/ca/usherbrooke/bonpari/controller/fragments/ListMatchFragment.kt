package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.MatchItemAdapter
import ca.usherbrooke.bonpari.databinding.FragmentListMatchBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel

class ListMatchFragment : Fragment() {
    private val viewModel: MatchListViewModel by activityViewModels()
    private lateinit var binding: FragmentListMatchBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setHasOptionsMenu(true)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentListMatchBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        // recyclerView
        binding.recyclerView.adapter = MatchItemAdapter(viewModel.matches) {
            viewModel.updateSelectedMatch(it)
            findNavController().navigate(R.id.action_listMatchFragment_to_matchSummaryFragment)
        }
        binding.recyclerView.addItemDecoration(
            DividerItemDecoration(requireContext(), DividerItemDecoration.VERTICAL)
        )

        // when the list of matches changes
        // update recycleView reference
        viewModel.matches.observe(viewLifecycleOwner) { p ->
            with(binding.recyclerView.adapter as MatchItemAdapter) {
                Log.d("CAL","Refresh received")
                submitList(p)
            }
        }
    }

    @Deprecated("Deprecated in Java", ReplaceWith("inflater.inflate(R.menu.refresh_menu, menu)"))
    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.refresh_menu, menu)
    }

    @Deprecated("Deprecated in Java")
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.refresh_menu_item -> {
                Log.d("CAL","Refresh called")
                viewModel.refreshMatches()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}