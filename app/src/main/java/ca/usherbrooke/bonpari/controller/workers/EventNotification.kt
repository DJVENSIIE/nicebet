package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.MatchEvent
import ca.usherbrooke.bonpari.controller.MainApplication
import ca.usherbrooke.bonpari.view.formatToString

class EventNotification(event: MatchEvent, game: Match, private val context: Context) {
    private var notificationId: Int = notificationCounter++

    private val title: String = if (event.isContestation()) {
        context.getString(R.string.contestation_notification_title)
    } else if (event.isPointScored()) {
        context.getString(R.string.point_score_notification_title)
    } else {
        throw IllegalStateException()
    }

    private val body: String = event.formatToString(game, context)

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