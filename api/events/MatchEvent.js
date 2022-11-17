"use strict";
class MatchEvent {
    constructor(time) {
        this.time = time;
    }
}
class ContestationMatchEvent extends MatchEvent {
    constructor(isPlayer1, hasContestationPassed, time) {
        super(time);
        this.isPlayer1 = isPlayer1;
        this.hasContestationPassed = hasContestationPassed;
        this.time = time;
    }
}
class PointMatchEvent extends MatchEvent {
    constructor(isPlayer1, time) {
        super(time);
        this.isPlayer1 = isPlayer1;
        this.time = time;
    }
}
class SetMatchEvent extends MatchEvent {
    constructor(time) {
        super(time);
        this.time = time;
    }
}
