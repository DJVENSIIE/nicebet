# BonPari

* Lancer le serveur, voir __server/README.md
* Ouvrir le fichier `index.html` dans un navigateur. Attention, pour recevoir les notifications, vous devez passer par un serveur local (ex : wamp). Les notifications ne sont envoyées que
  * si vous n'êtes pas sur l'application (arrière-plan), 
  * êtes sur la page d'un match,
  * et avez activé les notifications
* Activer les notifications dans le navigateur
  * vous pouvez changer la vitesse selon la valeur donnée à `modificateurVitesse` dans Generateur.js
  * 1 = rapide, 16 = ultra rapide, 0.2 = normal
* Navigation avec le clavier (`j`: jump, `r`: refresh, `back`: back)

<hr>

## Dev

* Pour compiler les fichiers TypeScript, installez npm `npm install` puis lancez `npm run tsc`
* Pour compiler les fichiers SCSS, 
  * `npm i sass`
  * installez `sass --watch view:view`