class MatchEvent {
  constructor (type, r, time) {
    this.type = type
    this.result = r
    this.time = time
    // this.time = Date.now()
  }

  static score (by, time) {
    return new MatchEvent(2, by+"", time);
  }

  static contestation (accepted, by, time) {
    return new MatchEvent(1, accepted? by+"" :  "-"+by, time);
  }

  toJSON () {
    return {
      'type': this.type,
      'result': this.result,
      'time': this.time
    };
  }
}

module.exports = MatchEvent;