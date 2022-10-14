package ca.usherbrooke.bonpari.api

data class Match(val Player1: Player,
                 val Player2: Player,
                 val terrain: Char,
                 val tournament: String,
                 val startingAt: String)