"use strict";
const BASE_URL = "http://localhost:3000";
class BonPariAPI {
    static async getAllGames() {
        return fetch(BASE_URL + "/parties", { method: "GET" })
            .then(r => r.json())
            .then(r => {
            localStorage.setItem(BonPariAPI.LIST_KEY, JSON.stringify(r));
            // @ts-ignore
            return r.map(MatchSummary.parse);
        }).catch(e => {
            const matchs = localStorage.getItem(BonPariAPI.LIST_KEY);
            if (matchs == null)
                throw new Error(e);
            return JSON.parse(matchs).map(MatchSummary.parse);
        });
    }
    // @ts-ignore
    static getGame(id) {
        return fetch(BASE_URL + "/parties/" + id, { method: "GET" })
            .then(r => r.json())
            .then(r => {
            localStorage.setItem(BonPariAPI.MATCH_KEY + id, JSON.stringify(r));
            // @ts-ignore
            return Match.parse(r);
        }).catch(e => {
            const match = localStorage.getItem(BonPariAPI.MATCH_KEY + id);
            if (match == null)
                throw new Error(e);
            // @ts-ignore
            return Match.parse(JSON.parse(match));
        });
    }
    static bet(body) {
        throw new Error("Not implemented yet");
    }
}
BonPariAPI.LIST_KEY = 'l_matchs';
BonPariAPI.MATCH_KEY = 'l_match';
