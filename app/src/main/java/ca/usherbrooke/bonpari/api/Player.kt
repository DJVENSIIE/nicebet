package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Json
import java.io.Serializable

data class Player(
    @Json(name = "prenom") val firstName: String,
    @Json(name = "nom") val lastName: String,
    @Json(name = "age") val age: Int,
    @Json(name = "rang") val rank: Int,
    @Json(name = "pays") val country: String) : Serializable


