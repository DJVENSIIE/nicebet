class MatchEvent {
    constructor(public time: number) {
    }
}

class ContestationMatchEvent extends MatchEvent {
    constructor(public isPlayer1: boolean, public hasContestationPassed: boolean, public time: number) {
        super(time)
    }
}

class PointMatchEvent extends MatchEvent {
    constructor(public isPlayer1: boolean, public time: number) {
        super(time)
    }
}

class SetMatchEvent extends MatchEvent {
    constructor(public time: number) {
        super(time)
    }
}