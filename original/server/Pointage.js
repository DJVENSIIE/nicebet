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
          m23 = `\n<dc:manche2>
            <dc:scorej1>${this.jeu[1][0]}</dc:scorej1>
            <dc:scorej2>${this.jeu[1][1]}</dc:scorej2>         
         </dc:manche2>`
        }

        else if ( this.jeu.length === 3  ) {
          m23 = `\n<dc:manche2>
            <dc:scorej1>${this.jeu[1][0]}</dc:scorej1>
            <dc:scorej2>${this.jeu[1][1]}</dc:scorej2>         
                </dc:manche2>
                <dc:manche3>
            <dc:scorej1>${this.jeu[2][0]}</dc:scorej1>
            <dc:scorej2>${this.jeu[2][1]}</dc:scorej2>         
                </dc:manche3>`
        }

        return `<rdf:Description>
          <dc:manches>
            <dc:manchesj1>
            <dc:manchesj2>
          </dc:manches>
          <dc:manche1>
            <dc:scorej1>${this.jeu[0][0]}</dc:scorej1>
            <dc:scorej2>${this.jeu[0][1]}</dc:scorej2>         
         </dc:manche1>${m23}
         <dc:echange>
          <dc:echangej1>${this.echange[0]}</dc:scorej1>
          <dc:echangej2>${this.echange[1]}</dc:scorej2>  
         </dc:echange>
        </rdf:Description>`

      case 'text/html':
        if ( this.jeu.length === 2  ) {
          m23 = `<tr>
                    <td>Manche2</td>
                    <td>${this.jeu[1][0]}</td>
                    <td>${this.jeu[1][1]}</td>
                 </tr>`
        }

        else if ( this.jeu.length === 3  ) {
          m23 = `<tr>
                    <td>Manche2</td>
                    <td>${this.jeu[1][0]}</td>
                    <td>${this.jeu[1][1]}</td>
                 </tr>
                 <tr>
                    <td>Manche3</td>
                    <td>${this.jeu[2][0]}</td>
                    <td>${this.jeu[2][1]}</td>
                 </tr>`
        }
        return `<table>
        <tr>
            <td>Manches</td>
            <td>${this.manches[0]}</td>
            <td>${this.manches[1]}</td>
        </tr>
        <tr>
            <td>Manche1</td>
            <td>${this.jeu[0][0]}</td>
            <td>${this.jeu[0][1]}</td>
        </tr>
        ${m23}
        <tr>
            <td>Fin</td>
            <td>${this.final}</td>
        </tr>
        <tr>
            <td>PariPossible</td>
            <td>${this.pariPossible}</td>
        </tr>
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
