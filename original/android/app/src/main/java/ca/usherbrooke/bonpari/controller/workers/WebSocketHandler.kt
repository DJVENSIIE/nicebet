package ca.usherbrooke.bonpari.controller.workers

import android.content.Context
import android.util.Log
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Player
import ca.usherbrooke.bonpari.api.events.*
import ca.usherbrooke.bonpari.model.LocalStorage
import ca.usherbrooke.bonpari.view.toString
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject
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

    fun stopListening() {
        socket.off()
    }

    fun startListening(context: Context) {
        if (!LocalStorage.isFollowingAMatch())
            return

        socket.on("matchEvent"+LocalStorage.currentMatchFollowedId) { args ->
            val eventJsonObject = args[0] as JSONObject
            val body : String
            val title : String
            when (val event = MatchEventJsonAdapter.eventFromJson(MatchEventJson.fromJsonObject(eventJsonObject))) {
                is ContestationMatchEvent -> {
                    title = context.getString(R.string.contestation_notification_title)
                    body = event.toString(Player.fromJsonObject(eventJsonObject.getJSONObject("data")), context)
                }
                is PointMatchEvent -> {
                    title = context.getString(R.string.point_scored_notification_title)
                    body = event.toString(Player.fromJsonObject(eventJsonObject.getJSONObject("data")), context)
                }
                is SetMatchEvent -> {
                    title = context.getString(R.string.set_changed_notification_title)
                    body = event.toString(context)
                }
                else -> throw IllegalStateException()
            }

            EventNotification(title, body, context).dispatch()
        }
    }
}