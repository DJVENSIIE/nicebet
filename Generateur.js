const Partie = require('./Partie');
const Joueur = require('./Joueur');

// const modificateurVitesse = Math.max(process.argv[2], 1);
// const modificateurVitesse = 1;
const modificateurVitesse = 0.2; // every 5 second, there is an event

const listePartie = [];

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
const onMatchEvent = function (match_id, event) {
  websocket.emit("matchEvent"+match_id, event);
}

listePartie.push(new Partie(new Joueur('Albert', 'Ramos', 28, 56, 'Espagne'), new Joueur('Milos', 'Raonic', 28, 16, 'Canada'), '1', 'Hale', '12h30', 0, onMatchEvent));
listePartie.push(new Partie(new Joueur('Andy', 'Murray', 28, 132, 'Angleterre'), new Joueur('Andy', 'Roddick', 36, 1000, 'États-Unis'), '2', 'Hale', '13h00', 30, onMatchEvent));

const demarrer = function () {
  let tick = 0;
  console.log(process.uptime())
  setInterval(function () {
    let uptime = process.uptime();
    console.log(uptime)
    if (uptime > s(10) && listePartie.length === 2)
      listePartie.push(new Partie(new Joueur('Kristopher', 'Spear', r100(), r1000(), 'Guam'), new Joueur('Dominik', 'Noel', r100(), r1000(), 'États-Unis'), '3', 'Hale', '14h25',  t(20+tick), onMatchEvent));
    else if (uptime > s(20) && listePartie.length === 3)
      listePartie.push(new Partie(new Joueur('Humberto', 'Damrosch', r100(), r1000(), 'Barbados'), new Joueur('Marco', 'Antoine', r100(), r1000(), 'Nepal'), '4', 'Hale', '15h10',  t(30+tick), onMatchEvent));
    else if (uptime > s(30) && listePartie.length === 4)
      listePartie.push(new Partie(new Joueur('Miguel', 'Coppini', r100(), r1000(), 'Peru'), new Joueur('Alaina', 'Hartel', r100(), r1000(), 'Japan'), '1', 'Hale', '16h30',  t(40+tick), onMatchEvent));
    else if (uptime > s(40) && listePartie.length === 5)
      listePartie.push(new Partie(new Joueur('Jamya', 'Turci', r100(), r1000(), 'Angola'), new Joueur('Thaddeus', 'Harvie', r100(), r1000(), 'Chile'), '2', 'Hale', '17h00',  t(50+tick), onMatchEvent));
    else if (uptime > s(50) && listePartie.length === 6)
      listePartie.push(new Partie(new Joueur('Clarence', 'Salt', r100(), r1000(), 'Palestine'), new Joueur('Ally', 'Hazlitt', r100(), r1000(), 'Israel'), '3', 'Hale', '19h00',  t(60+tick), onMatchEvent));
    else if (uptime > s(60) && listePartie.length === 7)
      listePartie.push(new Partie(new Joueur('Irene', 'Carraro', r100(), r1000(), 'Romania'), new Joueur('Ana', 'Pallini', r100(), r1000(), 'Antigua and Barbuda'), '4', 'Hale', '19h25',  t(70+tick), onMatchEvent));
    else if (uptime > s(70) && listePartie.length === 8)
      listePartie.push(new Partie(new Joueur('Adonis', 'Ascher', r100(), r1000(), 'Serbia'), new Joueur('Marquise', 'Schiavinotto', r100(), r1000(), 'Djibouti'), '1', 'Hale', '20h00',  t(80+tick), onMatchEvent));
    else if (uptime > s(80) && listePartie.length === 9)
      listePartie.push(new Partie(new Joueur('Monique', 'Villarreal', r100(), r1000(), 'Slovenia'), new Joueur('Kody', 'Cluff', r100(), r1000(), 'Monaco'), '2', 'Hale', '20h30',  t(90+tick), onMatchEvent));
    else if (uptime > s(90) && listePartie.length === 10)
      listePartie.push(new Partie(new Joueur('Anya', 'Feather', r100(), r1000(), 'Estonia'), new Joueur('Hadassah', 'Sekimoto', r100(), r1000(), 'Armenia'), '3', 'Hale', '21h00',  t(100+tick), onMatchEvent));

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
      console.log('terminee');
      partie.DistribuerGains();
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
module.exports.setWebSocketHandler = (_websocket) => {
  websocket = _websocket
}
