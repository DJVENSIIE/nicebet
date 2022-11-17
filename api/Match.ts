export enum PlayerIndex {
    Player1 = 0,
    Player2 = 1
}

export enum SetIndex {
    Set1 = 0,
    Set2 = 1,
    Set3 = 2,
}

export class Match extends MatchSummary {

    constructor(public id: number,
                public Player1: Player,
                public Player2: Player,
                public terrain: string,
                public tournament: string,
                public startingAt: string,
                public score: Pointage,
                public temps_partie: number,
                public serveur: number,
                public contestation: Array<number>,
                public bettingAvailable: Boolean,
                public events: any,
                public bets: any,
                public earnings: any,
                public amountPlayer1: number,
                public amountPlayer2: number) {
        super(id, Player1, Player2, terrain, tournament, startingAt)
    }

    getPlayerGame(player: PlayerIndex) {
        return this.score.echange[player].toString()
    }

    getPlayerReclamations(player: PlayerIndex) {
        return this.contestation[player].toString()
    }

    isAtServiceAndFinished(player: PlayerIndex): Boolean {
        return !this.score.final && this.isAtService(player)
    }

    private isAtService(player: PlayerIndex): Boolean {
        return player == PlayerIndex.Player1 ? this.serveur == 0 : this.serveur != 0
    }

    hasWon(player: PlayerIndex) {
        return this.score.final && this.score.manches[player] == 2
    }

    getPlayerScore(playerIndex: PlayerIndex, setIndex: SetIndex): String {
        return this.score.game.length >= setIndex+1 ? this.score.game[setIndex][playerIndex].toString() : ""
    }

    static parse(r: any) {
        return new Match(
            r.id,
            Player.parse(r.joueur1),
            Player.parse(r.joueur2),
            r.terrain,
            r.tournoi,
            r.heure_debut,
            Pointage.parse(r.pointage),
            r.temps_partie,
            r.serveur,
            r.constestation,
            r.pariPossible,
            r.events.map((e : any) => MatchEventParser.parse(e)),
            new Map(Object.entries(r.paris)),
            new Map(Object.entries(r.gains)),
            r.montantJoueur1,
            r.montantJoueur2
        )
    }
}