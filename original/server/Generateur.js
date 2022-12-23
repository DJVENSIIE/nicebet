const Partie = require('./Partie');
const Joueur = require('./Joueur');

// const modificateurVitesse = Math.max(process.argv[2], 1);
// const modificateurVitesse = 1;
const modificateurVitesse = 0.2; // every 5 second, there is an event

const listePartie = [];
const listeJoueurs = [];

/**
 * Used to generate data. These functions
 * are simply used to make the generated data d bit
 * different everytime, or to control the speed at which
 * matches are created.
 */
const r100 = () => Math.round(Math.random()*100)
const r1000 = () => Math.round(Math.random()*1000)
const t = (v) => v
const s = (v) => v * v

let websocket = null
const onMatchEvent = function (event, isGlobal = false) {
  // add the server version
  const json = event.standaloneDataJson()
  json['version'] = websocket.serverVersion

  // send
  websocket.emit("matchEvent"+event.match_id, json);
  console.log("Match "+event.match_id+" event type "+event.type)
  if (isGlobal) websocket.emit("matchEvent", json);
}

listeJoueurs.push(new Joueur(0, 'Albert', 'Ramos', 28, 56, 'Espagne'))
listeJoueurs.push(new Joueur(1, 'Milos', 'Raonic', 28, 16, 'Canada'))
listeJoueurs.push(new Joueur(2, 'Andy', 'Murray', 28, 132, 'Angleterre'))
listeJoueurs.push(new Joueur(3, 'Andy', 'Roddick', 36, 1000, 'États-Unis'))
listeJoueurs.push(new Joueur(4, 'Kristophe', 'Spear', r100(), r1000(), 'Guam'))
listeJoueurs.push(new Joueur(5, 'Dominik', 'Noel', r100(), r1000(), 'États-Unis'))
listeJoueurs.push(new Joueur(6, 'Humber', 'Damrosch', r100(), r1000(), 'Barbados'))
listeJoueurs.push(new Joueur(7, 'Marco', 'Antoine', r100(), r1000(), 'Nepal'))
listePartie.push(new Partie(listeJoueurs[0], listeJoueurs[1], '1', 'Hale', '12h30', 0, onMatchEvent));
listePartie.push(new Partie(listeJoueurs[2], listeJoueurs[3], '2', 'Hale', '13h00', 30, onMatchEvent));
listePartie.push(new Partie(listeJoueurs[4], listeJoueurs[5], '3', 'Hale', '14h25',  t(20+2500), onMatchEvent));
listePartie.push(new Partie(listeJoueurs[6], listeJoueurs[7], '4', 'Hale', '15h10',  t(30+4200), onMatchEvent));

const demarrer = function () {
  let tick = 0;
  setInterval(function () {
    for (const partie in listePartie) {
      if (listePartie[partie].tick_debut === tick) {
        demarrerPartie(listePartie[partie]);
      }
    }

    tick += 1;
  }, Math.floor(1000 / modificateurVitesse));
};

function demarrerPartie (partie) {
  const timer = setInterval(function () {
    partie.jouerTour();
    if (partie.estTerminee()) {
      clearInterval(timer);
    }
  }, Math.floor(1000 / modificateurVitesse));
}

function effectuerPari(partie,client,joueur,montant){
  const match = listePartie[partie]
  return match.parier(client,joueur,montant, match.pointage.pariPossible)
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.effectuerPari = effectuerPari;
module.exports.liste_partie = listePartie;
module.exports.liste_joueurs = listeJoueurs;
module.exports.setWebSocketHandler = (_websocket) => {
  websocket = _websocket
}
