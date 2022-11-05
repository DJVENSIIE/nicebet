package ca.usherbrooke.bonpari.controller.workers

import android.util.Log
import ca.usherbrooke.bonpari.model.LocalStorage
import io.socket.client.IO
import io.socket.client.Socket
import java.net.URISyntaxException

object WebSocketHandler {
    private lateinit var socket: Socket

    fun init() {
        try {
            socket = IO.socket("http://10.0.2.2:3000")
            socket.connect()
        } catch (e: URISyntaxException) {
            Log.d("CAL", e.toString())
        }
    }

    fun closeConnection() {
        socket.disconnect()
    }

    fun stopListeningToMatchEvents() {
        socket.off("matchEvent")
    }

    fun startListeningToMatchEvents() {
        if (!LocalStorage.isFollowingAMatch())
            return

        socket.on("matchEvent"+LocalStorage.currentMatchFollowedId) { args ->
//            Log.i("CAL", "Received: ${args[0]}")
            // todo: ... send a notification here
        }
    }
}