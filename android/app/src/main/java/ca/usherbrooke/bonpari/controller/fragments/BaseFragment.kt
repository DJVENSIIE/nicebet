package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.menus.RefreshMenuProvider
import ca.usherbrooke.bonpari.model.MatchListViewModel

abstract class BaseFragment : Fragment() {
    protected val viewModel: MatchListViewModel by activityViewModels()

    /**
     * Code executed when the "refresh" button in the menu bar
     * is pressed.
     */
    protected abstract val onRefresh: () -> Unit

    // todo: loading items not handled
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // menu
        activity?.addMenuProvider(RefreshMenuProvider(onRefresh), viewLifecycleOwner, Lifecycle.State.RESUMED)

        // gracefully handle errors
        viewModel.fetchingRepositoryError.observe(viewLifecycleOwner) { error ->
            when (error.code) {
                MatchListViewModel.ErrorCode.CONNECTION_TIME_OUT -> getString(R.string.no_connection)
                MatchListViewModel.ErrorCode.UNKNOWN -> getString(R.string.unknown_error, error.rawMessage)
            }.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show()
            }
        }
    }
}