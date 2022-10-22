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
import kotlinx.coroutines.delay

class PeriodicFetchEventsForFollowedMatch(c: Context, args: WorkerParameters) : CoroutineWorker(c, args) {
    override suspend fun doWork(): Result {
        // nothing to do
        if (!LocalStorage.isFollowingAMatch())
            return Result.success()

        val id = LocalStorage.currentMatchFollowedId
        var previousEventCount = 0
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
                        var s = ""
                        var t = ""
                        if (event.isContestation()) {
                            t = "Contestation"
                            s += "Contestation requested by "
                            event.contestation?.let {
                                s += if (it.isPlayer1)
                                    game.Player1.getFullName()
                                else
                                    game.Player2.getFullName()

                                s += if (it.hasContestationPassed)
                                    " was accepted."
                                else
                                    " was refused."
                            }
                        }
                        if (event.isPointScored()) {
                            t = "Point Scored"
                            s += "A point was scored by "
                            s += event.point?.let {
                                if (it.isPlayer1)
                                    game.Player1.getFullName()
                                else
                                    game.Player2.getFullName()
                            }
                        }
                        sendNotification(j, t, s)
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
            .setAutoCancel(true)
        with(NotificationManagerCompat.from(applicationContext)) {
            notify(notificationId, builder.build())
        }
    }
}