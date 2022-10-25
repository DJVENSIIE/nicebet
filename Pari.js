class Pari {
  constructor (client) {
    this.client = client;
    this.amountOnJ1 = 0;
    this.amountOnJ2 = 0;
  }

  addBet (index, amount){
    // O for player 1 | 1 for player 2
    if (index === 0) {
      this.amountOnJ1 += amount
    } else {
      this.amountOnJ2 += amount
    }
  }

  toJSON () {
    return {
      'client': this.client,
      'bet_on_j1': this.amountOnJ1,
      'bet_on_j2': this.amountOnJ2
    };
  }
}

module.exports = Pari;
