class BetPostBody {
    constructor(public client: string,
                public amount: number,
                public player: number,
                public matchId: number) {
    }

    public toAPIJson() {
        return {
            client: this.client,
            montant: this.amount,
            joueur: this.player,
            partie: this.matchId,
        }
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
    static ACCEPTED = "PARI_ACCEPTED"

    constructor(public tag: string, public betOnJ1: number, public betOnJ2: number, public totalJ1: number, public totalJ2: number) {
    }

    static parse(r: any) {
        return new BetResult(r.tag, r.bet_on_j1, r.bet_on_j2, r.total_j1, r.total_j2)
    }
}