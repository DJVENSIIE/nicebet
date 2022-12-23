class Joueur {
  constructor (id, prenom, nom, age, rang, pays) {
    this.id = id;
    this.prenom = prenom;
    this.nom = nom;
    this.age = age;
    this.rang = rang;
    this.pays = pays;
  }

  to(format) {
    switch (format) {
      case 'rdf+xml':
        return `<rdf:Description rdf:about="/data/joueurs/${this.id}">
    <prenom>${this.prenom}</prenom>
    <nom>${this.nom}</nom>
    <age>${this.age}</age>
    <rang>${this.rang}</rang>
    <pays>${this.pays}</pays>
</rdf:Description>`
      case 'text/html':
        return `<table>
    <tr><td>prenom</td><td>${this.prenom}</td></tr>
    <tr><td>nom</td><td>${this.nom}</td></tr>
    <tr><td>age</td><td>${this.age}</td></tr>
    <tr><td>rang</td><td>${this.rang}</td></tr>
    <tr><td>pays</td><td>${this.pays}</td></tr>
</table>`
      default:
        return ""
    }
  }
}

module.exports = Joueur;
