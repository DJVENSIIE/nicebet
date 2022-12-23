class Player {
    constructor(public firstName: string, public lastName: string,
                public age: number,
                public rank: number,
                public country: String) {
    }

    static parse(player: any) {
        return new Player(
            player.prenom,
            player.nom,
            player.age,
            player.rang,
            player.pays
        );
    }

    getFullName() {
        return this.firstName+" "+this.lastName
    }
}