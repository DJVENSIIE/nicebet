"use strict";
class MatchSummary {
    constructor(id, Player1, Player2, terrain, tournament, startingAt) {
        this.id = id;
        this.Player1 = Player1;
        this.Player2 = Player2;
        this.terrain = terrain;
        this.tournament = tournament;
        this.startingAt = startingAt;
    }
    static parse(r) {
        return new MatchSummary(r.id, Player.parse(r.joueur1), Player.parse(r.joueur2), r.terrain, r.tournoi, r.heure_debut);
    }
}
