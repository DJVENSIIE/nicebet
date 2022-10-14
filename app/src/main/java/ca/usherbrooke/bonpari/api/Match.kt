package ca.usherbrooke.bonpari.api

import java.io.Serializable


data class Match(val Player1: Player,
                  val Player2: Player,
                  val terrain: Char,
                  val tournament: String,
                  val startingAt: String,
                  val score:Pointage,
                  val temps_partie:Double,
                  val vitesse_dernier_service:Double,
                  val nombre_coup_dernier_echange:Int,
                  val contestation:List<Int>,
                  val tickDebut:String
) : Serializable