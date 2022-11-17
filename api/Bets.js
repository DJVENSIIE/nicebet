"use strict";
class BetPostBody {
    constructor(client, amount, player, matchId) {
        this.client = client;
        this.amount = amount;
        this.player = player;
        this.matchId = matchId;
    }
    toAPIJson() {
        return {
            client: this.client,
            montant: this.amount,
            joueur: this.player,
            partie: this.matchId,
        };
    }
}
class Bet {
    constructor(clientId, betOnJ1, betOnJ2) {
        this.clientId = clientId;
        this.betOnJ1 = betOnJ1;
        this.betOnJ2 = betOnJ2;
    }
}
class Earning {
    constructor(clientId, amount) {
        this.clientId = clientId;
        this.amount = amount;
    }
}
class BetResult {
    constructor(tag, betOnJ1, betOnJ2, totalJ1, totalJ2) {
        this.tag = tag;
        this.betOnJ1 = betOnJ1;
        this.betOnJ2 = betOnJ2;
        this.totalJ1 = totalJ1;
        this.totalJ2 = totalJ2;
    }
    static parse(r) {
        return new BetResult(r.tag, r.bet_on_j1, r.bet_on_j2, r.total_j1, r.total_j2);
    }
}
BetResult.CLOSED = "PARIS_CLOSED";
BetResult.ACCEPTED = "PARI_ACCEPTED";
BetResult.INVALID = "INVALID_AMOUNT";
BetResult.REFRESH = "REFRESH";
