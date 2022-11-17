"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    constructor() {
        // @ts-ignore
        this.socket = io("ws://localhost:3000");
        this.lastID = null;
        this.keyFocusIndex = 0;
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
        // add key support
        document.onkeydown = e => {
            switch (e.code) {
                case 'Backspace':
                    e.preventDefault();
                    this.onReturnPressed();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    this.refresh();
                    break;
                case 'KeyJ':
                    const buttons = document.querySelectorAll(".onResetFocusPressed");
                    if (buttons.length > this.keyFocusIndex) {
                        e.preventDefault();
                        // focus
                        // @ts-ignore
                        buttons[this.keyFocusIndex].focus();
                    }
                    // next
                    this.keyFocusIndex = (this.keyFocusIndex + 1) % buttons.length;
                    break;
            }
        };
    }
    configureOnePage(newId) {
        // disable
        if (this.lastID != null)
            this.socket.off("matchEvent" + this.lastID);
        this.lastID = newId;
        this.keyFocusIndex = 0; // reset
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
            this.socket.on("matchEvent0", (result) => {
                Notification.requestPermission().then((granted) => {
                    if (granted !== "granted")
                        return;
                    let body;
                    let title;
                    const e = MatchEventParser.parse(result);
                    if (e instanceof ContestationMatchEvent) {
                        const player = Player.parse(result.data).getFullName();
                        title = "Contestation";
                        body = "Contestation de " + player + " " + (e.hasContestationPassed ? "acceptée" : "refusée");
                    }
                    else if (e instanceof PointMatchEvent) {
                        const player = Player.parse(result.data).getFullName();
                        title = "Point marqué";
                        body = "Un point a été marqué par " + player;
                    }
                    else if (e instanceof SetMatchEvent) {
                        title = "Changement de manche";
                        body = "Changement de manche";
                    }
                    else {
                        throw new Error("Unknown event.");
                    }
                    const img = '_assets/tennis.png';
                    const notification = new Notification(title, { body: body, icon: img });
                });
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
    onBetPressed(matchID, player) {
        let client = "client1"; // todo: hardcoded
        let amount = prompt(`Parier sur joueur ${player + 1}`, "0");
        BonPariAPI.bet(new BetPostBody(client, Number(amount), player, matchID))
            .then(r => {
            if (r.tag != BetResult.ACCEPTED) {
                alert(r.tag);
            }
            else {
                this.refresh();
            }
        })
            .catch(console.error);
    }
}
App.SELECT_KEY = 'match_id';
const app = new App();
app.start();
