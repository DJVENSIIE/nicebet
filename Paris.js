class Paris {
  constructor (parent) {
    this.client = '';
    this.choix = 0; // O for player 1 | 1 for player 2
    this.montantParié = 0.00;
    this.parent = parent;
  }

  ajouterParis (client, joueur, montant){
    this.paris.client = client
    this.choix = joueur
    this.montantParié = montant
  }


  toJSON () {
    return {
      'client': this.client,
      'choix': this.choix,
      'montantParié': this.montantParié
    };
  }
}

module.exports = Paris;
