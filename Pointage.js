class Pointage {
  constructor (parent) {
    this.manches = [0, 0];
    this.jeu = [[0, 0]];
    this.echange = [0, 0];
    this.final = false;
    this.pariPossible = true;

    this.parent = parent;
  }

  to(format) {
    let m23 = ''
    switch (format) {
      case 'rdf+xml':
        if ( this.jeu.length === 2  ) {
          m23 = `\n<manche2>
            <scorej1>${this.jeu[1][0]}</scorej1>
            <scorej2>${this.jeu[1][1]}</scorej2>         
         </manche2>`
        }

        else if ( this.jeu.length === 3  ) {
          m23 = `\n<manche2>
            <scorej1>${this.jeu[1][0]}</scorej1>
            <scorej2>${this.jeu[1][1]}</scorej2>         
                </manche2>
                <manche3>
            <scorej1>${this.jeu[2][0]}</scorej1>
            <scorej2>${this.jeu[2][1]}</scorej2>         
                </manche3>`
        }

        return `<rdf:Description>
        <manche1>
            <scorej1>${this.jeu[0][0]}</scorej1>
            <scorej2>${this.jeu[0][1]}</scorej2>         
         </manche1>${m23}
</rdf:Description>`
      case 'text/html':
        if ( this.jeu.length === 2  ) {
          m23 = `<tr>
                    <td>Set 2</td>
                    <td>${this.jeu[1][0]}</td>
                    <td>${this.jeu[1][1]}</td>
                 </tr>`
        }

        else if ( this.jeu.length === 3  ) {
          m23 = `<tr>
                    <td>Set 2</td>
                    <td>${this.jeu[1][0]}</td>
                    <td>${this.jeu[1][1]}</td>
                 </tr>
                 <tr>
                    <td>Set 3</td>
                    <td>${this.jeu[2][0]}</td>
                    <td>${this.jeu[2][1]}</td>
                 </tr>`
        }
        return `<table>
        <tr>
            <td>Set 1</td>
            <td>${this.jeu[0][0]}</td>
            <td>${this.jeu[0][1]}</td>
        </tr>
        ${m23}
        </table>`
      default: return ""
    }
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
