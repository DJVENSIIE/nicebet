"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    constructor() {
        this.backArrow = document.querySelector("#back");
        this.title = document.querySelector("#title");
        this.list = document.querySelector("#list");
        this.match = document.querySelector("#match");
        // @ts-ignore
        MatchViewHolder.initFromHistory();
        MatchListViewHolder.initFromHistory();
    }
    showList() {
        // todo: handle errors
        BonPariAPI.getAllGames().then((r) => {
            // const node = document.querySelector("#xxx").parentNode!!
            // node.appendChild(document.createTextNode(JSON.stringify(r)))
            MatchListViewHolder.updateList(r);
        }).catch(console.error);
    }
    showMatch(id) {
        // todo: handle errors
        // show content
        BonPariAPI.getGame(id).then((r) => {
            // @ts-ignore
            MatchViewHolder.updateMatch(r);
        });
    }
    onReturnPressed() {
        localStorage.removeItem(App.SELECT_KEY);
        this.render(null);
    }
    onMatchPressed(id) {
        localStorage.setItem(App.SELECT_KEY, String(id));
        this.render(String(id));
    }
    start() {
        this.render(localStorage.getItem(App.SELECT_KEY));
    }
    render(id) {
        if (id == null) {
            this.backArrow.setAttribute("hidden", "");
            this.match.setAttribute("hidden", "");
            this.list.removeAttribute("hidden");
            this.list.replaceChildren(); // remove children
            this.title.innerHTML = `
                <span>Bienvenue sur BonPari</span>
                <img src="_assets/tennis.png" alt="BonPari" width="32">
            `;
            app.showList();
        }
        else {
            this.backArrow.removeAttribute("hidden");
            this.list.setAttribute("hidden", "");
            this.match.removeAttribute("hidden");
            this.title.textContent = "Résumé";
            app.showMatch(Number(id));
        }
    }
}
App.SELECT_KEY = 'match_id';
const app = new App();
app.start();
