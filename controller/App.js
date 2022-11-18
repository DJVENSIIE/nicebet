"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    // source: https://stackoverflow.com/questions/59412625/generate-random-uuid-javascript
    static generateUniqSerial() {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, (c) => {
            const r = Math.floor(Math.random() * 16);
            return r.toString(16);
        });
    }
    // obviously this is not secure
    static getClientId() {
        if (App.CLIENT_ID == null) {
            let stored_id = localStorage.getItem(App.CLIENT_ID_KEY);
            if (stored_id == null) {
                // create
                stored_id = App.generateUniqSerial();
            }
            App.CLIENT_ID = stored_id;
            localStorage.setItem(App.CLIENT_ID_KEY, stored_id);
        }
        return App.CLIENT_ID;
    }
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
        if (Notification?.permission !== "granted") {
            // request permission
            Notification.requestPermission().then();
        }
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
            // https://www.designcise.com/web/tutorial/how-to-detect-if-the-browser-tab-is-active-or-not-using-javascript
            document.addEventListener('visibilitychange', (event) => {
                if (document.hidden) {
                    this.socket.on("matchEvent0", (result) => {
                        if (Notification?.permission === "granted") {
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
                        }
                    });
                }
                else {
                    this.socket.off("matchEvent" + this.lastID);
                }
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
        let amount = prompt(`Parier sur joueur ${player + 1}`, "0");
        BonPariAPI.bet(new BetPostBody(App.getClientId(), Number(amount), player, matchID))
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
App.CLIENT_ID = null;
App.CLIENT_ID_KEY = "CLIENT_ID";
App.SELECT_KEY = 'match_id';
const app = new App();
app.start();
