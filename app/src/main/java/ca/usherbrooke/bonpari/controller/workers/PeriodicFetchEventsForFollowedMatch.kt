package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.controller.MainApplication
import ca.usherbrooke.bonpari.model.LocalStorage
import ca.usherbrooke.bonpari.view.formatToString
import kotlinx.coroutines.delay

class PeriodicFetchEventsForFollowedMatch(c: Context, args: WorkerParameters) : CoroutineWorker(c, args) {
    override suspend fun doWork(): Result {
        // nothing to do
        if (!LocalStorage.isFollowingAMatch())
            return Result.success()

        val id = LocalStorage.currentMatchFollowedId
        var previousEventCount = LocalStorage.lastEventReceived
        Log.d("CAL", "No notification for the first $previousEventCount events.")
        while (true) {
            val game = BonPariApi.retrofitService.getGame(id)
            Log.d("CAL", "worker executed: $game")

            game?.let {
                val eventsCount = game.events.size
                if (previousEventCount != eventsCount) {
                    Log.d("CAL", "${eventsCount-previousEventCount} new events")

                    // todo: use strings.xml
                    for (j in previousEventCount until eventsCount) {
                        val event = game.events[j]
                        var t = ""
                        if (event.isContestation()) {
                            t = applicationContext.getString(R.string.contestation_notification_title)
                        }
                        if (event.isPointScored()) {
                            t = applicationContext.getString(R.string.point_score_notification_title)
                        }
                        sendNotification(j, t, event.formatToString(game, applicationContext))
                    }

                    previousEventCount = eventsCount
                }
            }
            // check every 10 seconds for notifications
            delay(10000)
        }
    }

    private fun sendNotification(notificationId: Int, title: String, body: String) {
        val builder = NotificationCompat.Builder(applicationContext, MainApplication.CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_baseline_android_24)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        with(NotificationManagerCompat.from(applicationContext)) {
            notify(notificationId, builder.build())
        }
    }
}