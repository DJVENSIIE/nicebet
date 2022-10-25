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
    this.clients = [];
    this.paris = [];
    this.gains = [];
    this.montantTotal = 0.00;
    this.montantJoueur1 = 0.00;
    this.montantJoueur2 = 0.00;
    this.vainqueur = -1;
    this.events = []
  }

  parier (client,joueur,montant, isOpen){
    let tag = "PARI_ACCEPTED"
    if (isOpen) {
      let pari = new Pari(this);
      pari.ajouterPari(client,joueur,montant);

      if (!this.clients.includes(client)){
        this.clients.push(client);
      }

      this.paris.push(pari);

      this.montantTotal += montant;

      if (joueur==0){
        this.montantJoueur1 += montant;
      }
      else {
        this.montantJoueur2 += montant;
      }
    } else {
      tag = "PARIS_CLOSED"
    }

    let amountJ1 = 0
    let amountJ2 = 0
    for (let pari of this.paris) {
      if (pari.client === client){
        if (pari.choix === 0) {
          amountJ1 += pari.montantParié
        } else {
          amountJ2 += pari.montantParié
        }
      }
    }

    return {
      tag: tag,
      bet_on_j1: amountJ1,
      bet_on_j2: amountJ2,
      total_j1: this.montantJoueur1,
      total_j2: this.montantJoueur2
    }
  }

  DistribuerGains (){
    console.log('distribution des gains');

    let coeff;
    let vainqueur;
    if (this.pointage.manches[0] == 2){
      vainqueur = 0;
      if(this.montantJoueur1 > 0){
        coeff = this.montantTotal * (75 / 100) / this.montantJoueur1;
      }
      else{
        coeff = 0;
      }
    }
    else if (this.pointage.manches[1] == 2){
      vainqueur = 1;
      if(this.montantJoueur2 > 0){
        coeff = this.montantTotal * (75 / 100) / this.montantJoueur2;
      }
      else{
        coeff = 0;
      }
    }
    
    for (let client of (this.clients) ){
      let montantgagné = 0.00;
      for (let i = 0; i < this.paris.length; i++) {
    
        if (this.paris[i].client == client && this.paris[i].choix == vainqueur ){
          montantgagné += this.paris[i].montantParié;
        }
      } 

      montantgagné = montantgagné * coeff;

      if (this.paris.length > 0){

        let gain = new Gain();
        gain.ajouterGain(client,montantgagné);
        this.gains.push(gain);
      }
    }
  }

  jouerTour () {
    let contestationReussi = false;
    if ((Math.random() * 100) < 3) { // 3% de contestation
      const contestant = Math.floor(Math.random() * 2);
      if (!Partie.contester()) {
        this.constestation[contestant] = Math.max(0, this.constestation[contestant] - 1);
        console.log('contestation echouee');
        this.events.splice(0, 0, MatchEvent.contestation(false, contestant))
      } else {
        contestationReussi = true;
        console.log('contestation reussie');
        this.events.splice(0, 0, MatchEvent.contestation(true, contestant))
      }
    }

    if (!contestationReussi) {
      const j = Math.floor(Math.random() * 2)
      this.pointage.ajouterPoint(j);
      this.events.splice(0, 0, MatchEvent.score(j))
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
      'events': this.events,
      'clients':this.clients,
      'paris':this.paris,
      'gains':this.gains,
      'montantTotal':this.montantTotal,
      'montantJoueur1':this.montantJoueur1,
      'montantJoueur2': this.montantJoueur2,
    };
  }
}
module.exports = Partie;
