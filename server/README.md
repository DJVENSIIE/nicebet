# Serveur

* Installer les packages npm avec `npm install`
* Faire `npm run start` dans le dossier actuel
* Pour lire du rdf+xml : faire des requêtes (postman ou autre) avec l'header content-type égale à rdf+xml et l'url égale à http://localhost:3000/data
* Pour lire du text/html : (2 choix)
*   faire des requêtes (postman ou autre) avec l'header content-type égale à text/html et l'url égale à http://localhost:3000/data 
*   taper http://localhost:3000/data  sur internet
* Chemins possibles pour rdf+xml et pour text/html :  /data, /data/resultat, /data/resultat/:idPartie, /data/horaire/:idHoraire, /data/horaire, /data/joueurs, /data/joueurs/:idJoueur, 