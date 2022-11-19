class Pointage {
  constructor (parent) {
    this.manches = [0, 0];
    this.jeu = [[0, 0]];
    this.echange = [0, 0];
    this.final = false;
    this.pariPossible = true;

    this.parent = parent;
  }

  ajouterPoint (joueur) {
    const mancheCourante = this.manches.reduce((a, b) => a + b, 0);

    // incrementer l'echange
    this.echange[joueur] += this.echange[joueur] === 30 ? 10 : 15;

    // si requis, incrementer le jeu
    if (this.echange[joueur] > 40) {
      this.echange = [0, 0];
      this.jeu[mancheCourante][joueur] += 1;
      this.parent.changerServeur();
    }

    // si requis, incrementer la manche
    if (this.jeu[mancheCourante][joueur] === 6) {
      this.manches[joueur] += 1;
      if (mancheCourante === 0) {
        console.log('pari impossible');
        this.pariPossible = false
      }

      if (this.manches[joueur] < 2) {
        this.jeu.push([0, 0]);
      }

      // si le match est termine, le dire
      if (this.manches[joueur] === 2) {
        this.final = true;
      }

      this.parent.nouvelleManche();
    }
  }

  toJSON () {
    return {
      'manches': this.manches,
      'jeu': this.jeu,
      'echange': this.echange,
      'final': this.final
    };
  }
}

module.exports = Pointage;
