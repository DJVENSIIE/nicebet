package ca.usherbrooke.bonpari.controller.menus

import android.util.Log
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import androidx.core.view.MenuProvider
import ca.usherbrooke.bonpari.R

class RefreshMenuProvider(private val onRefresh: () -> Unit) : MenuProvider {
    override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
        menuInflater.inflate(R.menu.refresh_menu, menu)
    }

    override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
        return when (menuItem.itemId) {
            R.id.refresh_menu_item -> {
                Log.d("CAL","Refresh called")
                onRefresh()
                true
            }
            else -> false
        }
    }
}