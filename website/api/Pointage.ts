class Pointage {
    constructor(public manches: Array<number>,
                public game: Array<Array<number>>,
                public echange: Array<number>,
                public final: Boolean) {
    }

    static parse(pointage: any) {
        return new Pointage(pointage.manches, pointage.jeu,  pointage.echange, pointage.final);
    }
}