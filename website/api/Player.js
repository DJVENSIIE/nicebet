"use strict";
class Player {
    constructor(firstName, lastName, age, rank, country) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.rank = rank;
        this.country = country;
    }
    static parse(player) {
        return new Player(player.prenom, player.nom, player.age, player.rang, player.pays);
    }
    getFullName() {
        return this.firstName + " " + this.lastName;
    }
}
