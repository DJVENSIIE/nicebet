package ca.usherbrooke.bonpari.model

object LocalStorage {
    private const val NO_EVENT_RECEIVED: Int = 0
    const val NO_FOLLOWED_MATCH: Int = -1

    var currentMatchFollowedId : Int = NO_FOLLOWED_MATCH
    var lastEventReceived: Int = NO_EVENT_RECEIVED

    fun isFollowingAMatch() = currentMatchFollowedId != NO_FOLLOWED_MATCH
}