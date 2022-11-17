class MatchEventParser {
    static parse(eventJson: any) : MatchEvent {
        const r = eventJson.result
        const t = eventJson.time
        switch (eventJson.type) {
            case 1 : // @ts-ignore
                return new ContestationMatchEvent(Number(r) == PlayerIndex.Player1, !r.startsWith("-"), t)
            case 2 : // @ts-ignore
                return new PointMatchEvent(Number(r) == PlayerIndex.Player1, t)
            case 3 : return new SetMatchEvent(t)
            default: throw new Error("Event type not supported.")
        }
    }
}

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