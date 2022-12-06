class Gain {
  constructor (client, amount) {
    this.client = client;
    this.montant = amount;
  }

  to(format) {
    switch (format) {
      case 'rdf+xml':
        return `<client>${this.client}</client>
                <montant>${this.montant}</montant>`
      default:
        return ""
    }
  }

  toJSON () {
    return {
      'client': this.client,
      'amount': this.montant
    };
  }
}

module.exports = Gain;
