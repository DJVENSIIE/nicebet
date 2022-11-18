"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.SetIndex = exports.PlayerIndex = void 0;
var PlayerIndex;
(function (PlayerIndex) {
    PlayerIndex[PlayerIndex["Player1"] = 0] = "Player1";
    PlayerIndex[PlayerIndex["Player2"] = 1] = "Player2";
})(PlayerIndex = exports.PlayerIndex || (exports.PlayerIndex = {}));
var SetIndex;
(function (SetIndex) {
    SetIndex[SetIndex["Set1"] = 0] = "Set1";
    SetIndex[SetIndex["Set2"] = 1] = "Set2";
    SetIndex[SetIndex["Set3"] = 2] = "Set3";
})(SetIndex = exports.SetIndex || (exports.SetIndex = {}));
class Match extends MatchSummary {
    constructor(id, Player1, Player2, terrain, tournament, startingAt, score, temps_partie, serveur, contestation, bettingAvailable, events, bets, earnings, amountPlayer1, amountPlayer2, version) {
        super(id, Player1, Player2, terrain, tournament, startingAt, version);
        this.id = id;
        this.Player1 = Player1;
        this.Player2 = Player2;
        this.terrain = terrain;
        this.tournament = tournament;
        this.startingAt = startingAt;
        this.score = score;
        this.temps_partie = temps_partie;
        this.serveur = serveur;
        this.contestation = contestation;
        this.bettingAvailable = bettingAvailable;
        this.events = events;
        this.bets = bets;
        this.earnings = earnings;
        this.amountPlayer1 = amountPlayer1;
        this.amountPlayer2 = amountPlayer2;
        this.version = version;
    }
    getPlayerGame(player) {
        return this.score.echange[player].toString();
    }
    getPlayerReclamations(player) {
        return this.contestation[player].toString();
    }
    isAtServiceAndFinished(player) {
        return !this.score.final && this.isAtService(player);
    }
    isAtService(player) {
        return player == PlayerIndex.Player1 ? this.serveur == 0 : this.serveur != 0;
    }
    hasWon(player) {
        return this.score.final && this.score.manches[player] == 2;
    }
    getPlayerScore(playerIndex, setIndex) {
        return this.score.game.length >= setIndex + 1 ? this.score.game[setIndex][playerIndex].toString() : "";
    }
    static parse(r) {
        return new Match(r.id, Player.parse(r.joueur1), Player.parse(r.joueur2), r.terrain, r.tournoi, r.heure_debut, Pointage.parse(r.pointage), r.temps_partie, r.serveur, r.constestation, r.pariPossible, r.events.map((e) => MatchEventParser.parse(e)), new Map(Object.entries(r.paris)), new Map(Object.entries(r.gains)), r.montantJoueur1, r.montantJoueur2, r.version);
    }
}
exports.Match = Match;
