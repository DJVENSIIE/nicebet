package ca.usherbrooke.bonpari.api

import java.io.Serializable

/*
import com.squareup.moshi.Json

data class Player(
    @Json(name = "prenom")
    val firstName: String,
    @Json(name = "nom")
    val lastName: String,
    @Json(name = "age")
    val age: Int,
    @Json(name = "rang")
    val rank: Int,
    @Json(name = "pays")
    val country: String)

 */

data class Player(val firstName: String,
                  val lastName: String,
                  val age: Int,
                  val rank: Int,
                  val country: String): Serializable


