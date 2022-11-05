package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Json

data class BetPostBody(@Json(name = "client")  val client: String,
                       @Json(name = "montant") val amount: Float,
                       @Json(name = "joueur") val player: Int,
                       @Json(name = "partie") val matchId: Int)

data class Bet(@Json(name = "client") val clientId: String,
               @Json(name = "bet_on_j1") val betOnJ1: Float,
               @Json(name = "bet_on_j2") val betOnJ2: Float) : java.io.Serializable

data class Earning(@Json(name = "client") val clientId: String,
                   @Json(name = "amount") val amount: Float) : java.io.Serializable

data class BetResult(@Json(name = "tag") private val tag: String,
                     @Json(name = "bet_on_j1") val betOnJ1: Float,
                     @Json(name = "bet_on_j2") val betOnJ2: Float,
                     @Json(name = "total_j1") val totalJ1: Float,
                     @Json(name = "total_j2") val totalJ2: Float) {

    fun wasAccepted() = tag == ACCEPTED
    fun wasRefresh() = tag == REFRESH
    fun isClosed() = tag == CLOSED

    companion object {
        const val CLOSED = "PARIS_CLOSED"
        const val ACCEPTED = "PARI_ACCEPTED"
        const val REFRESH = "REFRESH"
    }
}