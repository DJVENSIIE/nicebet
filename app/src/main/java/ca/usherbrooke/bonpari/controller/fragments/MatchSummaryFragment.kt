package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.Pointage
import ca.usherbrooke.bonpari.databinding.FragmentMatchSummaryBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel
import com.google.android.material.dialog.MaterialAlertDialogBuilder

// todo: handle "service mark"
// todo: proper refresh
class MatchSummaryFragment : Fragment() {
    private val viewModel: MatchListViewModel by viewModels()
    private lateinit var binding: FragmentMatchSummaryBinding
    private lateinit var match: Match

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentMatchSummaryBinding.inflate(layoutInflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val args by navArgs<MatchSummaryFragmentArgs>()
        match = args.match
        loadView(match)

        binding.buttonBet1.setOnClickListener {
            val input = EditText(requireContext())

            MaterialAlertDialogBuilder(requireContext())
                .setTitle("Montant à parier joueur1")
                // by default, pressing "back" closes the popup
                .setCancelable(false)
                .setView(input)
                .setNegativeButton("Annuler") { _, _ ->
                }
                .setPositiveButton("Confirmer") { _, _ -> Log.d("back", input.text.toString())
                }
                .show()
        }
        binding.buttonBet2.setOnClickListener {
            val input = EditText(requireContext())

            MaterialAlertDialogBuilder(requireContext())
                .setTitle("Montant à parier joueur2")
                // by default, pressing "back" closes the popup
                .setCancelable(false)
                .setView(input)
                .setNegativeButton("Annuler") { _, _ ->
                }
                .setPositiveButton("Confirmer") { _, _ -> Log.d("back", input.text.toString())
                }
                .show()
        }

        binding.buttonRefresh.setOnClickListener {
            Log.d("CAL", "Refresh")
            viewModel.updateMatch()
        }

        viewModel.matches.observe(viewLifecycleOwner) { p ->
            Log.d("CAL", "UPDATE")
            if (p.isNotEmpty()) {
                loadView(p!![0])
            }
        }
    }

    private fun loadView(match: Match) {
        binding.player1.text = match.Player1.firstName
        binding.player2.text = match.Player2.firstName
        binding.reclamation1.text =  match.contestation[0].toString()
        binding.reclamation2.text =  match.contestation[1].toString()

        val mpointage: Pointage = match.score
        binding.player1set1.text = mpointage.jeu[0][0].toString()
        binding.player2set1.text = mpointage.jeu[0][1].toString()
        Log.d("CAL", "Size of 'jeu': ${mpointage.jeu.size}")
        if (mpointage.jeu.size >= 2) {
            binding.player1set2.text = mpointage.jeu[1][0].toString()
            binding.player2set2.text = mpointage.jeu[1][1].toString()
        }
        if (mpointage.jeu.size == 3) {
            binding.player1set3.text = mpointage.jeu[2][0].toString()
            binding.player2set3.text = mpointage.jeu[2][1].toString()
        }
        binding.player1game.text = mpointage.echange[0].toString()
        binding.player2game.text = mpointage.echange[1].toString()

        if (match.serveur == 0) {
            binding.service1.text = "°"
            binding.service2.text = ""
        } else {
            binding.service1.text = ""
            binding.service2.text = "°"
        }
    }

}