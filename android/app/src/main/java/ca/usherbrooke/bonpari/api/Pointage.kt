package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Json
import java.io.Serializable

data class Pointage(
    @Json(name = "manches") val manches:List<Int>,
    @Json(name = "jeu") val game:List<List<Int>>,
    @Json(name = "echange") val echange:List<Int>,
    @Json(name = "final") val final: Boolean)  : Serializable
