class BetPostBody {
    constructor(public client: string,
                public amount: number,
                public player: number,
                public matchId: number) {
    }
}

class Bet {
    constructor(public clientId: string, public betOnJ1: number, public betOnJ2: number) {
    }
}

class Earning {
    constructor(public clientId: string, public amount: number) {
    }
}

class BetResult {
    static CLOSED = "PARIS_CLOSED"
    static ACCEPTED = "PARI_ACCEPTED"
    static REFRESH = "REFRESH"

    constructor(public tag: string, public betOnJ1: number, public betOnJ2: number, public totalJ1: number, public totalJ2: number) {
    }
}