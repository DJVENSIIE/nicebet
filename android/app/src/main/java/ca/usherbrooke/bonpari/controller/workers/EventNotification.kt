package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.controller.MainApplication

class EventNotification(private val title: String, private val body: String, private val context: Context) {
    private var notificationId: Int = notificationCounter++

    fun dispatch() {
        val builder = NotificationCompat.Builder(context, MainApplication.CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_baseline_android_24)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        with(NotificationManagerCompat.from(context)) {
            notify(notificationId, builder.build())
        }
    }

    companion object {
        private var notificationCounter = 0;
    }
}