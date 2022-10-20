package ca.usherbrooke.bonpari.controller.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.databinding.BindingAdapter
import androidx.databinding.InverseBindingAdapter
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import ca.usherbrooke.bonpari.databinding.FragmentMatchSummaryBinding
import ca.usherbrooke.bonpari.model.MatchListViewModel

// todo: handle "service mark"
// todo: proper refresh
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
        binding.viewModel = viewModel
    }

    companion object {
        @BindingAdapter("setServiceFlag") @JvmStatic
        fun setText(textView: TextView, flag: Boolean) {
            textView.text = if (flag) {
                "°"
            } else {
                ""
            }
        }

        @InverseBindingAdapter(attribute = "setServiceFlag", event = "android:textAttrChanged")
        @JvmStatic
        fun getText(textView: TextView) = textView.text.toString()
    }
}