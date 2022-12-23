package ca.usherbrooke.bonpari.api.events

class ContestationMatchEvent(val isPlayer1: Boolean, val hasContestationPassed: Boolean, time: Int) : MatchEvent(time) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ContestationMatchEvent

        if (isPlayer1 != other.isPlayer1) return false
        if (hasContestationPassed != other.hasContestationPassed) return false

        return true
    }

    override fun hashCode(): Int {
        var result = isPlayer1.hashCode()
        result = 31 * result + hasContestationPassed.hashCode()
        return result
    }
}