package ca.usherbrooke.bonpari.api

import java.io.Serializable

data class Player(val firstName: String,
                  val lastName: String,
                  val age: Int,
                  val rank: Int,
                  val country: String): Serializable


