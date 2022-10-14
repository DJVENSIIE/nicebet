package ca.usherbrooke.bonpari.api

data class Pointage(
    val manches:List<Int>,
    val jeu:List<List<Int>>,
    val echange:List<Int>,
    val final: Boolean,
    val parent: String):java.io.Serializable
