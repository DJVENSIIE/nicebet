package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.model.LocalStorage
import kotlinx.coroutines.delay

@Deprecated("See WebSocketHandler")
class PeriodicFetchEventsForFollowedMatch(c: Context, args: WorkerParameters) : CoroutineWorker(c, args) {
    override suspend fun doWork(): Result {
        // nothing to do
        if (!LocalStorage.isFollowingAMatch())
            return Result.success()

        val id = LocalStorage.currentMatchFollowedId
        var previousEventCount = -1
        while (true) {
            val game = BonPariApi.retrofitService.getGame(id)

//            Log.d("CAL", "worker executed: $game")
            Log.d("CAL", "with events: ${game?.events}")

            game?.let {
                if (previousEventCount == -1) {
                    previousEventCount = LocalStorage.lastEventReceived[game.id] ?: 0
                    Log.d("CAL", "No notification for the first $previousEventCount events.")
                }

                val eventsCount = game.events.size
                if (previousEventCount != eventsCount) {
                    Log.d("CAL", "${eventsCount-previousEventCount} new events")

                    // if there are 10 elements, the user saw 4 events
                    // Indexes are from 0 to 9
                    // we are checking [0,1,2,3,4,5]
                    // we need to explore 0..6
                    for (j in 0 until eventsCount - previousEventCount) {
                        val event = game.events[j]
                        EventNotification(event, game, applicationContext).dispatch()
                    }

                    previousEventCount = eventsCount
                }
            }
            // check every 10 seconds for notifications
            delay(10000)
        }
    }
}