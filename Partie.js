const Pointage = require('./Pointage.js');
const Paris = require('./Paris.js');

class Partie {
  static game_id = 0;

  constructor (joueur1, joueur2, terrain, tournoi, heureDebut, tickDebut) {
    this.id = Partie.game_id++;
    this.joueur1 = joueur1;
    this.joueur2 = joueur2;
    this.terrain = terrain;
    this.tournoi = tournoi;
    this.heure_debut = heureDebut;
    this.pointage = new Pointage(this);
    this.temps_partie = 0;
    this.joueur_au_service = Math.floor(Math.random() * 2);
    this.vitesse_dernier_service = 0;
    this.nombre_coup_dernier_echange = 0;
    this.constestation = [3, 3];
    this.tick_debut = tickDebut;
    this.paris = [];
    this.montantTotal = 0.00;
    this.montantJoueur1 = 0.00;
    this.montantJoueur2 = 0.00;
    this.pariPossible = true;
    this.vainqueur = -1;

  }

  parier (client,joueur,montant){
    let paris = new Paris(this);
    paris.ajouterParis(client,joueur,montant);

    this.paris.push(paris);
    
    this.paris.montantTotal += montant;
    
    if (joueur == joueur1){
      this.montantJoueur1 += montant;
    }
    else {
      this.montantJoueur2 += montant;
    }
  }


  ObtenirGains (client, vainqueur){
    
    let coeff;
    let choix;

    if (!vainqueur){
      coeff = this.montantTotal * (75 / 100) / this.montantJoueur1;
      choix = 0;
    }
    else if (vainqueur){
      coeff = this.montantTotal * (75 / 100) / this.montantJoueur2;
      choix = 1;
    }

    let gains = 0.00;
    
    for (let i = 0; i < this.paris.length; i++) {

      if (this.paris[i].client == client && this.paris[i].choix == choix ){

        gains += this.paris[i].montantParié;
      }
    } 

    gains = gains * coeff

    return gains;
    
  }





  jouerTour () {
    let contestationReussi = false;
    if ((Math.random() * 100) < 3) { // 3% de contestation
      if (!Partie.contester()) {
        const contestant = Math.floor(Math.random() * 2);
        this.constestation[contestant] = Math.max(0, this.constestation[contestant] - 1);
        console.log('contestation echouee');
      } else {
        contestationReussi = true;
        console.log('contestation reussie');
      }
    }

    if (!contestationReussi) {
      this.pointage.ajouterPoint(Math.floor(Math.random() * 2));
    }
    this.temps_partie += Math.floor(Math.random() * 60); // entre 0 et 60 secondes entre chaque point
    this.vitesse_dernier_service = Math.floor(Math.random() * (250 - 60 + 1)) + 60; // entre 60 et 250 km/h
    this.nombre_coup_dernier_echange = Math.floor(Math.random() * (30 - 1 + 1)) + 1; // entre 1 et 30 coups par échange
  }

  static contester () {
    return (Math.random() * 100) > 25; // 75% de chance que la contestation passe
  }

  changerServeur () {
    this.joueur_au_service = (this.joueur_au_service + 1) % 2;
  }

  nouvelleManche () {
    this.constestation = [3, 3];
  }

  estTerminee () {
    if (this.pointage.manches[this.joueur1] == 2){
      this.vainqueur = 0
    }

    if (this.pointage.manches[this.joueur2] == 2){
      this.vainqueur = 1
    }
    return this.pointage.final;
  }

  toJSON () {
    return {
      'id': this.id,
      'joueur1': this.joueur1,
      'joueur2': this.joueur2,
      'terrain': this.terrain,
      'tournoi': this.tournoi,
      'heure_debut': this.heure_debut,
      'pointage': this.pointage,
      'temps_partie': this.temps_partie,
      'serveur': this.joueur_au_service,
      'vitesse_dernier_service': this.vitesse_dernier_service,
      'nombre_coup_dernier_echange': this.nombre_coup_dernier_echange,
      'constestation': this.constestation
    };
  }
}
module.exports = Partie;
