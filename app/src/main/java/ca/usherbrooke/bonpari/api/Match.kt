package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Json

data class Match(
    @Json(name = "joueur1")
    val Player1: Player,
    @Json(name = "joueur2")
    val Player2: Player,
    @Json(name = "terrain")
    val terrain: Char,
    @Json(name = "tournoi")
    val tournament: String,
    @Json(name = "heure_debut")
    val startingAt: String)