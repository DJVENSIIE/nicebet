"use strict";
class Pointage {
    constructor(manches, game, echange, final) {
        this.manches = manches;
        this.game = game;
        this.echange = echange;
        this.final = final;
    }
    static parse(pointage) {
        return new Pointage(pointage.manches, pointage.jeu, pointage.echange, pointage.final);
    }
}
