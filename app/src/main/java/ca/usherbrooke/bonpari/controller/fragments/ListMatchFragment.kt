package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.MatchItemAdapter
import ca.usherbrooke.bonpari.databinding.FragmentListMatchBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel

class ListMatchFragment : Fragment() {
    private val viewModel: MatchListViewModel by viewModels()
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
//            val intent = Intent(this, ResumeMatchActivity::class.java)
//            intent.putExtra("match", it)
//            startActivity(intent)
            val action = ListMatchFragmentDirections.actionListMatchFragmentToMatchSummaryFragment(it)
            findNavController().navigate(action)
        }
        binding.recyclerView.addItemDecoration(
            DividerItemDecoration(requireContext(), DividerItemDecoration.VERTICAL)
        )

        // when the list of matches changes
        // update recycleView reference
        viewModel.matches.observe(viewLifecycleOwner) { p ->
            with(binding.recyclerView.adapter as MatchItemAdapter) {
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
                // .. code ...
                Log.d("CAL","Refresh")
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}