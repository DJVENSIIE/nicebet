class Gain {
  constructor () {
    this.client = '';
    this.montant = 0.00;
  }


  ajouterGain (client, montant){
    this.client = client;
    this.montant = montant;
  }

  toJSON () {
    return {
      'client': this.client,
      'montant': this.montant
    };
  }
}

module.exports = Gain;
