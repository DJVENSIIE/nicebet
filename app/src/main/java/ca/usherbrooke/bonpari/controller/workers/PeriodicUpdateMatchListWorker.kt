package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import ca.usherbrooke.bonpari.api.LocalStorage
import kotlinx.coroutines.delay

class PeriodicUpdateMatchListWorker(c: Context, args: WorkerParameters) : CoroutineWorker(c, args) {
    override suspend fun doWork(): Result {
        while (true) {
            Log.d("CAL", "worker executed: ${LocalStorage.currentMatchFollowedId}")
            delay(1000)
        }
//        val builder = NotificationCompat.Builder(applicationContext, MainApplication.CHANNEL_ID)
//            .setSmallIcon(R.drawable.ic_baseline_android_24)
//            .setContentTitle("XXX")
//            .setContentText("YYY")
//            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
//            .setAutoCancel(true)
//        with(NotificationManagerCompat.from(applicationContext)) {
//            notify(0, builder.build())
//        }
    }
}