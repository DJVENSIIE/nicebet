import {Match} from "../api/Match";

// @ts-ignore
MatchViewHolder.initFromHistory()
MatchListViewHolder.initFromHistory()

if (window.location.href.includes("?")) {
    // get match id
    const id = window.location.search.replace("?id=", "")

    // adapt navbar
    document.querySelector("#back")!!.removeAttribute("hidden")
    document.querySelector("#title")!!.textContent = "Résumé"

    // show content
    BonPariAPI.getGame(Number(id)).then((r: Match) => {
        // @ts-ignore
        MatchViewHolder.updateMatch(r)
    });
} else {
    // todo: handle errors
    BonPariAPI.getAllGames().then((r : Array<MatchSummary>) => {
        // const node = document.querySelector("#xxx").parentNode!!
        // node.appendChild(document.createTextNode(JSON.stringify(r)))
        MatchListViewHolder.updateList(r)
    }).catch(console.error)
}