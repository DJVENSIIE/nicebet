package ca.usherbrooke.bonpari.controller

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.workers.WebSocketHandler

class MainApplication : Application(), DefaultLifecycleObserver {

    override fun onCreate() {
        super<Application>.onCreate()
        createNotificationChannel()
        ProcessLifecycleOwner.get().lifecycle.addObserver(this)
        WebSocketHandler.init()
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        WebSocketHandler.closeConnection()
    }

    override fun onStart(owner: LifecycleOwner) {
        // stop
        WebSocketHandler.stopListening()
    }

    override fun onStop(owner: LifecycleOwner) {
        // start
        WebSocketHandler.startListening(applicationContext)
    }

    private fun createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = getString(R.string.channel_name)
            val descriptionText = getString(R.string.channel_description)
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            // Register the channel with the system
            val notificationManager: NotificationManager =
                getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    companion object {
        const val CHANNEL_ID = "BON_PARI_NOTIFICATIONS_CHANNEL"
        const val UNIQUE_WORK_NAME = "toto"
    }
}