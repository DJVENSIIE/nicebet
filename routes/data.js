const express = require('express');
const router = express.Router();

const gen = require('../Generateur');

function wrapContent(res, format, content) {
    if (content === undefined) {
        res.send({ "message": "Not found" });
        return
    }
    switch (format) {
        case 'rdf+xml':
            res.send(`
<?xml version="1.0"?>

<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:dc="/data/">
${content}
</rdf:RDF>`);
            break;

        case 'text/html':
            res.send(content);
            break;

        default:
            res.send({ "message": "Format not supported ("+format+")." });
    }
}

function getFormat(req) {
    // https://stackoverflow.com/questions/52409154/how-to-check-headers-in-nodejs
    let format = req.get('accept')
    if (format === undefined || format === "*/*") {
        format = req.get('content-type')
    } else if (format.includes(",")) {
        format = format.split(',')[0]
    }
    return format
}

router.get('/', function (req, res, next) {
    // todo: html => va retourner une page expliquant comment utiliser votre api,
    const format = getFormat(req)
    let content = ''
    switch (format) {
        case 'rdf+xml':
            gen.liste_partie.forEach(j => content += j.to(format))
            gen.liste_joueurs.forEach(j => content += j.to(format))
            break;
        case 'text/html':
            content = `<p>Bienvenue sur l'API de BonPari - version 1.0.0</p>

<h4>GET /parties</h4>
Retourne la liste des parties

<h4>GET /parties/:id</h4>
Retourne les informations sur une partie.

<h4>POST /parties/parier</h4>
Parier sur un match. Les arguments sont

<ul>
<li>client - string - identifiant unique</li>
<li>montant - float - montant parié</li>
<li>joueur - int - 0 ou 1</li>
<li>partie - int - identifiant de la partie</li>
</ul>

Si tout se passe bien :

<ul>
<li>tag - string - un message indiquant le résultat
<ul>
    <li>PARI_ACCEPTED (pari accepté)</li>
    <li>PARIS_CLOSED (pari non accepté)</li>
</ul>
</li>
<li>bet_on_j1 - float - montant parié sur 0</li>
<li>bet_on_j2 - float - montant parié sur 1</li>
<li>total_j1 - float - montant total sur 0</li>
<li>total_j2 - float - montant total sur </li>
</ul>

En cas d'erreur :

<ul>
<li>tag - string - un message indiquant le résultat
<ul>
    <li>NO_SUCH_PLAYER (joueur invalide)</li>
    <li>NO_SUCH_MATCH  (partie invalide)</li>
    <li>INVALID_AMOUNT (montant invalide)</li>
    <li>NO_CLIENT (aucun client)</li>
</ul>
</li>
</ul>
`
            break;
    }

    wrapContent(res, format, content)
});

router.get('/horaire', function (req, res, next) {
    const format = getFormat(req)
    let content = ''
    gen.liste_partie.forEach(j => content += j.toHoraire(format))
    wrapContent(res, format, content)
});

router.get('/horaire/:id', function (req, res, next) {
    const id = req.params.id
    const format = getFormat(req)
    const content = gen.liste_partie[id]?.toHoraire(format)
    wrapContent(res, format, content)
});

router.get('/resultat', function (req, res, next) {
    const format = getFormat(req)
    let content = ''
    gen.liste_partie.forEach(j => content += j.toResultat(format))
    wrapContent(res, format, content)
});

router.get('/resultat/:id', function (req, res, next) {
    const id = req.params.id
    const format = getFormat(req)
    const content = gen.liste_partie[id]?.toResultat(format)
    wrapContent(res, format, content)
});

router.get('/joueurs', function (req, res, next) {
    const format = getFormat(req)
    let content = ''
    gen.liste_joueurs.forEach(j => content += j.to(format))
    wrapContent(res, format, content)
});

router.get('/joueurs/:id', function (req, res, next) {
    const id = req.params.id
    const format = getFormat(req)
    const content = gen.liste_joueurs[id]?.to(format)
    wrapContent(res, format, content)
});

module.exports = router;

