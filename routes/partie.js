const express = require('express');
const router = express.Router();

const gen = require('../Generateur');

/* GET parties listing. */
router.get('/', function (req, res, next) {
  res.send(gen.liste_partie);
});

router.get('/:id', function (req, res, next) {
  res.send(gen.liste_partie[req.params.id]);
});

/* Post ajouter un pari sur une partie . */
router.post('/parier', function (req, res, next) {
  const client = req.body.client;
  const montant = parseFloat(req.body.montant);
  const joueur = parseInt(req.body.joueur);
  const partie = parseInt(req.body.partie);
  res.send(gen.effectuerPari(partie,client,joueur,montant))
});

module.exports = router;

