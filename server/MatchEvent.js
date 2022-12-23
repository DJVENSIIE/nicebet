class MatchEvent {
  constructor (type, r, parent) {
    this.type = type
    this.result = r
    this.time = parent.temps_partie
    this.match_id = parent.id
    this.parent = parent
  }

  to(format) {
    switch (format) {
      case 'rdf+xml':

        return `<dc:type>${this.type}</dc:type>
                <dc:result>${this.result}</dc:result>
                <dc:time>${this.time}</dc:time>
                `
      default:
        return ""
    }
  }


  static score (by, parent) {
    return new MatchEvent(2, by+"", parent);
  }

  static setChanged(parent) {
    return new MatchEvent(3, "", parent);
  }

  static contestation (accepted, by, parent) {
    return new MatchEvent(1, accepted? by+"" :  "-"+by, parent);
  }

  static final (parent) {
    return new MatchEvent(4, "", parent);
  }

  toJSON () {
    return {
      'type': this.type,
      'result': this.result,
      'time': this.time
    };
  }

  /**
   * By default, results are inside a fetch,
   * which reduces the quantity of information,
   * as the requester will have them in the parent.
   * But, if an event is requested without a match,
   * we need to provide a bit more information.
   */
  standaloneDataJson() {
    let res = {
      'match_id': this.match_id,
      'type': this.type,
      'result': this.result,
      'time': this.time
    }
    switch (this.type) {
      case 1: res['data'] =  this.result === "1" ? this.parent.joueur1 : this.parent.joueur2; break;
      case 2: res['data'] =  this.result.includes("1") ? this.parent.joueur1 : this.parent.joueur2; break;
      case 4: res['data'] =  this.parent.gains; break;
    }
    return res
  }
}

module.exports = MatchEvent;