const BASE_URL = "http://localhost:3000";

class BonPariAPI {
    private static LIST_KEY = 'l_matchs';
    private static MATCH_KEY = 'l_match';

    static fetchJson(r: any) {
        const json : any = r.json()
        json['version'] = r.headers.get('Server-version')
        return json
    }

   static async getAllGames() : Promise<Array<MatchSummary>> {
       return fetch(BASE_URL + "/parties", {method: "GET"})
           .then(BonPariAPI.fetchJson)
           .then(r => {
               localStorage.setItem(BonPariAPI.LIST_KEY, JSON.stringify(r))
               // @ts-ignore
               return r.map(MatchSummary.parse);
           }).catch(e => {
               const matchs = localStorage.getItem(BonPariAPI.LIST_KEY)
               if (matchs == null) throw new Error(e)
               return JSON.parse(matchs).map(MatchSummary.parse);
           })
   }

   // @ts-ignore
   static getGame(id: number) : Promise<Match> {
       return fetch(BASE_URL + "/parties/"+id, {method: "GET"})
           .then(BonPariAPI.fetchJson)
           .then(r => {
               localStorage.setItem(BonPariAPI.MATCH_KEY+id, JSON.stringify(r))
               // @ts-ignore
               return Match.parse(r)
           }).catch(e => {
               const match = localStorage.getItem(BonPariAPI.MATCH_KEY+id)
               if (match == null) throw new Error(e)
               // @ts-ignore
               return Match.parse(JSON.parse(match));
           })
   }

    static bet(body: BetPostBody) : Promise<BetResult> {
        return fetch("http://localhost:3000/parties/parier" , {
            method: "POST",
            body: JSON.stringify(body.toAPIJson()),
            headers: {"Content-type":"application/json;charset=UTF-8"}
        })
            .then(BonPariAPI.fetchJson)
            .then(r => {
                return BetResult.parse(r)
            })
   }
}