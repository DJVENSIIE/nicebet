class MatchEvent {
  constructor (type, r) {
    this.type = type
    this.result = r
    this.time = Date.now()
  }

  static score (by) {
    return new MatchEvent(2, by+"");
  }

  static contestation (accepted, by) {
    return new MatchEvent(1, accepted? by+"" :  "-"+by);
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