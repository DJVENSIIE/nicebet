const express = require('express');
const router = express.Router();

const gen = require('../Generateur');

/* GET parties listing. */
router.get('/', function (req, res, next) {
  res.send(gen.liste_partie);
});

router.get('/:id', function (req, res, next) {
  res.send(gen.liste_partie[req.params.id].toCompleteJSON());
});

/* Post ajouter un pari sur une partie . */
router.post('/parier', function (req, res, next) {
  const client = req.body.client;
  const montant = parseFloat(req.body.montant);
  const joueur = parseInt(req.body.joueur);
  const partie = parseInt(req.body.partie);
  let result = undefined

  if (!(joueur in [0,1])) {
    result = { tag: "NO_SUCH_PLAYER" }
  }

  else if (gen.liste_partie[partie] === undefined) {
    result = {
      tag: "NO_SUCH_MATCH"
    }
  }

  else if (isNaN(montant) || montant < 0) {
    result = {
      tag: "INVALID_AMOUNT"
    }
  }

  else if (client === undefined) {
    result = {
      tag: "NO_CLIENT"
    }
  }

  if (result === undefined) {
    res.send(gen.effectuerPari(partie,client,joueur,montant))
  } else {
    res.status(402).send(result)
  }
});

module.exports = router;

