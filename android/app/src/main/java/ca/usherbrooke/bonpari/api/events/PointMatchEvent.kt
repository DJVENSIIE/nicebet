package ca.usherbrooke.bonpari.api.events

class PointMatchEvent(val isPlayer1: Boolean, time: Int) : MatchEvent(time) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PointMatchEvent

        if (isPlayer1 != other.isPlayer1) return false

        return true
    }

    override fun hashCode(): Int {
        return isPlayer1.hashCode()
    }
}