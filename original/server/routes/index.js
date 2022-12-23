const express = require('express');
const router = express.Router();

const Partie = require('../Partie.js');
const Joueur = require('../Joueur.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Bienvenue dans le serveur du service Échanges.');
});
module.exports = router;
