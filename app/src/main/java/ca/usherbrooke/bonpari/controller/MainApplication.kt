package ca.usherbrooke.bonpari.controller

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.workers.PeriodicUpdateMatchListWorker

class MainApplication : Application(), DefaultLifecycleObserver {
    private lateinit var workManager : WorkManager

    override fun onCreate() {
        super<Application>.onCreate()
        createNotificationChannel()
        ProcessLifecycleOwner.get().lifecycle.addObserver(this)
        workManager = WorkManager.getInstance(applicationContext)
    }

    override fun onStart(owner: LifecycleOwner) {
        workManager.cancelUniqueWork(UNIQUE_WORK_NAME)
    }

    override fun onStop(owner: LifecycleOwner) {
        workManager.enqueueUniqueWork(
            UNIQUE_WORK_NAME,
            ExistingWorkPolicy.REPLACE,
            OneTimeWorkRequest.from(PeriodicUpdateMatchListWorker::class.java)
        )
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