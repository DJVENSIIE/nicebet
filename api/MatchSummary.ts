class MatchSummary {
    constructor(public id: number,
                public Player1: Player,
                public Player2: Player,
                public terrain: string,
                public tournament: string,
                public startingAt: string,
                public version: string) {
    }

    static parse(r: any) {
        return new MatchSummary(
            r.id,
            Player.parse(r.joueur1),
            Player.parse(r.joueur2),
            r.terrain,
            r.tournoi,
            r.heure_debut,
            r.version
        )
    }
}