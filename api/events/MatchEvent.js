"use strict";
class MatchEventParser {
    static parse(eventJson) {
        const r = eventJson.result;
        const t = eventJson.time;
        switch (eventJson.type) {
            case 1: // @ts-ignore
                return new ContestationMatchEvent(Number(r) == PlayerIndex.Player1, !r.startsWith("-"), t);
            case 2: // @ts-ignore
                return new PointMatchEvent(Number(r) == PlayerIndex.Player1, t);
            case 3: return new SetMatchEvent(t);
            default: throw new Error("Event type not supported.");
        }
    }
}
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
