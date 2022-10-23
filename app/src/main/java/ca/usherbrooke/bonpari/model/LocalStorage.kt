package ca.usherbrooke.bonpari.model

object LocalStorage {
    const val NO_FOLLOWED_MATCH: Int = -1

    var currentMatchFollowedId : Int = NO_FOLLOWED_MATCH
    var lastEventReceived = mutableMapOf<Int, Int>()

    fun isFollowingAMatch() = currentMatchFollowedId != NO_FOLLOWED_MATCH
}