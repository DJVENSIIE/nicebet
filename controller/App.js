"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    constructor() {
        // @ts-ignore
        this.socket = io("ws://localhost:3000");
        this.lastID = null;
        this.backArrow = document.querySelector("#back");
        this.title = document.querySelector("#title");
        this.list = document.querySelector("#list");
        this.match = document.querySelector("#match");
    }
    start() {
        this.configureOnePage(localStorage.getItem(App.SELECT_KEY));
        this.refresh();
        // update every 60 seconds
        setInterval(() => this.refresh(), 60000);
    }
    configureOnePage(newId) {
        // disable
        if (this.lastID != null)
            this.socket.off("matchEvent" + this.lastID);
        this.lastID = newId;
        if (newId == null) {
            // clear
            localStorage.removeItem(App.SELECT_KEY);
            this.backArrow.setAttribute("hidden", "");
            this.match.setAttribute("hidden", "");
            this.list.removeAttribute("hidden");
            this.title.innerHTML = `
                <span>Bienvenue sur BonPari</span>
                <img src="_assets/tennis.png" alt="BonPari" width="32">
            `;
        }
        else {
            // set
            localStorage.setItem(App.SELECT_KEY, newId);
            this.backArrow.removeAttribute("hidden");
            this.list.setAttribute("hidden", "");
            this.match.removeAttribute("hidden");
            this.title.textContent = "Résumé";
            this.socket.on("matchEvent0", (p) => {
                // ...
                console.log(p);
            });
        }
    }
    // todo: handle errors
    refresh() {
        if (this.lastID == null) {
            // show list
            BonPariAPI.getAllGames().then((r) => {
                MatchListViewHolder.updateList(r);
            }).catch(console.error);
        }
        else {
            // show content
            BonPariAPI.getGame(Number(this.lastID)).then((r) => {
                MatchViewHolder.updateMatch(r);
            }).catch(console.error);
        }
    }
    onReturnPressed() {
        this.configureOnePage(null);
        this.refresh();
    }
    onMatchPressed(id) {
        this.configureOnePage(String(id));
        this.refresh();
    }
}
App.SELECT_KEY = 'match_id';
const app = new App();
app.start();
