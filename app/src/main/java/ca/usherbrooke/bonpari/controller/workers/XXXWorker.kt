package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters

class XXXWorker(c: Context, args: WorkerParameters) : Worker(c, args) {
    override fun doWork(): Result {
        return try {
            // if you need a context: applicationContext
            // ok
            Result.success()
        } catch (e: Exception) {
            // error
            Result.failure()
        }
    }
}