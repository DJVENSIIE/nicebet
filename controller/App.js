"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
MatchViewHolder.initFromHistory();
MatchListViewHolder.initFromHistory();
if (window.location.href.includes("?")) {
    // get match id
    const id = window.location.search.replace("?id=", "");
    // adapt navbar
    document.querySelector("#back").removeAttribute("hidden");
    document.querySelector("#title").textContent = "Résumé";
    // show content
    BonPariAPI.getGame(Number(id)).then((r) => {
        // @ts-ignore
        MatchViewHolder.updateMatch(r);
    });
}
else {
    // todo: handle errors
    BonPariAPI.getAllGames().then((r) => {
        // const node = document.querySelector("#xxx").parentNode!!
        // node.appendChild(document.createTextNode(JSON.stringify(r)))
        MatchListViewHolder.updateList(r);
    }).catch(console.error);
}
