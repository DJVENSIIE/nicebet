const Pointage = require('./Pointage.js');
const Pari = require('./Pari.js');
const Gain = require('./gain.js');
const MatchEvent = require('./MatchEvent');

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
    this.paris = {};
    this.gains = {};
    this.montantTotal = 0.00;
    this.montantJoueur1 = 0.00;
    this.montantJoueur2 = 0.00;
    this.vainqueur = -1;
    this.events = []
  }

  parier (client,joueur,montant, isOpen){
    let tag = "PARI_ACCEPTED"

    // never bet once
    if (!this.paris[client]) {
      this.paris[client] = new Pari(client)
    }

    if (isOpen) {
      this.paris[client].addBet(joueur, montant)
      this.montantTotal += montant;

      if (joueur === 0) {
        this.montantJoueur1 += montant;
      }
      else {
        this.montantJoueur2 += montant;
      }
    } else {
      tag = "PARIS_CLOSED"
    }

    return {
      tag: tag,
      bet_on_j1: this.paris[client].amountOnJ1,
      bet_on_j2: this.paris[client].amountOnJ2,
      total_j1: this.montantJoueur1,
      total_j2: this.montantJoueur2
    }
  }

  DistribuerGains (){
    console.log('distribution des gains');

    let coeff;
    let vainqueur;
    if (this.pointage.manches[0] == 2) {
      vainqueur = 0;
      if(this.montantJoueur1 > 0){
        coeff = this.montantTotal * (75 / 100) / this.montantJoueur1;
      }
      else{
        coeff = 0;
      }
    }
    else if (this.pointage.manches[1] == 2) {
      vainqueur = 1;
      if(this.montantJoueur2 > 0){
        coeff = this.montantTotal * (75 / 100) / this.montantJoueur2;
      }
      else {
        coeff = 0;
      }
    }

    // try of if it's work
    for (let x in this.paris) {
      const bet = this.paris[x]
      const amount = (vainqueur === 0 ? bet.amountOnJ1 : bet.amountOnJ2) * coeff

      this.gains[bet.client] = new Gain(bet.client, amount)
    }
  }

  jouerTour () {
    let contestationReussi = false;
    if ((Math.random() * 100) < 3) { // 3% de contestation
      const contestant = Math.floor(Math.random() * 2);
      if (!Partie.contester()) {
        this.constestation[contestant] = Math.max(0, this.constestation[contestant] - 1);
        console.log('contestation echouee');
        this.events.splice(0, 0, MatchEvent.contestation(false, contestant, this.temps_partie))
      } else {
        contestationReussi = true;
        console.log('contestation reussie');
        this.events.splice(0, 0, MatchEvent.contestation(true, contestant, this.temps_partie))
      }
    }

    if (!contestationReussi) {
      const j = Math.floor(Math.random() * 2)
      this.pointage.ajouterPoint(j);
      this.events.splice(0, 0, MatchEvent.score(j, this.temps_partie))
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
      'constestation': this.constestation,
      'pariPossible': this.pointage.pariPossible,
      'paris':this.paris,
      'gains':this.gains,
      'montantTotal':this.montantTotal,
      'montantJoueur1':this.montantJoueur1,
      'montantJoueur2': this.montantJoueur2,
      'events': this.events
    };
  }
}
module.exports = Partie;
