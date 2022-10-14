package ca.usherbrooke.bonpari.controller

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.viewModels
import androidx.recyclerview.widget.DividerItemDecoration
import ca.usherbrooke.bonpari.databinding.ActivityMainBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel
import ca.usherbrooke.bonpari.views.MatchItemAdapter

// https://www.oddschecker.com/us/tennis
class MainActivity : AppCompatActivity() {
    private val viewModel: MatchListViewModel by viewModels()
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // recyclerView
        binding.recyclerView.adapter = MatchItemAdapter(viewModel.matches)
        binding.recyclerView.addItemDecoration(
            DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
        )

        // when the list of matches changes
        // update recycleView reference
        viewModel.matches.observe(this) { p ->
            with(binding.recyclerView.adapter as MatchItemAdapter) {
                submitList(p)
            }
        }
    }
}