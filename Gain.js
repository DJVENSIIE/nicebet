class Gain {
  constructor (client, amount) {
    this.client = client;
    this.montant = amount;
  }

  toJSON () {
    return {
      'client': this.client,
      'amount': this.montant
    };
  }
}

module.exports = Gain;
