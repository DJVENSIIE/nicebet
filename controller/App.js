"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    static sendMatchResult(matchID, bet, serverVersion) {
        // generate message
        let message;
        if (bet.amount > 0) {
            message = `Vous avez gagné $${bet.amount}`;
        }
        else {
            bet.amount = bet.amount * -1;
            message = `Vous avez perdu $${bet.amount}`;
        }
        // show a message if not already shown
        const res = ApiLocalStorage.getMatchResultNotificationStatus(matchID, serverVersion);
        if (res == null) {
            BonPariNotification.create("Match terminé", message);
            ApiLocalStorage.setMatchResultNotificationStatusSend(matchID, serverVersion);
        }
        // return message
        return message;
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
        // ask for permission to show notifications
        if (Notification?.permission !== "granted") {
            Notification.requestPermission().then();
        }
        // listen for bet results
        this.socket.on("matchEvent", (result) => {
            const clientID = ApiLocalStorage.getClientId();
            if (result.data[clientID] != undefined) {
                App.sendMatchResult(result.match_id, result.data[clientID], result.serverVersion);
            }
        });
        // listen for events
        // https://www.designcise.com/web/tutorial/how-to-detect-if-the-browser-tab-is-active-or-not-using-javascript
        document.addEventListener('visibilitychange', () => {
            // no listening
            if (this.lastID == null) {
                // only printed once
                if (document.hidden)
                    console.info("Not match to listen to");
                return;
            }
            if (document.hidden) {
                console.info("Document hidden listen");
                this.socket.on("matchEvent" + this.lastID, (result) => {
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
                        else if (e instanceof MatchDoneEvent) {
                            title = "Match terminé";
                            body = "Match terminé";
                        }
                        else {
                            throw new Error("Unknown event.");
                        }
                        BonPariNotification.create(title, body);
                    }
                });
            }
            else {
                console.info("Document hidden stop listen");
                this.socket.off("matchEvent" + this.lastID);
            }
        });
        // show the right page
        this.configureOnePage(ApiLocalStorage.getSelectedMatchIfAny());
        // and up to date
        this.refresh(true);
        // update every 60 seconds
        setInterval(() => this.refresh(), 60000);
        // add keyboard support
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
                    // move to the next selectable
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
    /**
     * Router
     */
    configureOnePage(newId) {
        this.lastID = newId;
        this.keyFocusIndex = 0; // reset
        if (newId == null) {
            // clear
            ApiLocalStorage.clearSelectedMatch();
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
            ApiLocalStorage.setSelectedMatchIfAny(newId);
            this.backArrow.removeAttribute("hidden");
            this.list.setAttribute("hidden", "");
            this.match.removeAttribute("hidden");
            this.title.textContent = "Résumé";
        }
    }
    /**
     * Refresh what has to be refreshed.
     * We are changing the message if we are loading (Chargement...)
     * or if we are updating (Actualisation...)
     */
    refresh(isLoading = false) {
        const loading = document.querySelector("#loading");
        const onerror = (error) => {
            if (isLoading)
                loading.innerHTML = `
                <p>Erreur: Impossible de se connecter au serveur.</p>
                <p>${error}</p>
            .`;
        };
        loading.removeAttribute("hidden");
        loading.textContent = isLoading ? "Chargement..." : "Actualisation...";
        if (this.lastID == null) {
            // show list
            BonPariAPI.getAllGames().then((r) => {
                loading.setAttribute("hidden", "");
                MatchListViewHolder.updateList(r);
            }).catch(onerror);
        }
        else {
            // show content
            BonPariAPI.getGame(Number(this.lastID)).then((r) => {
                loading.setAttribute("hidden", "");
                MatchViewHolder.updateMatch(r);
            }).catch(onerror);
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
        BonPariAPI.bet(new BetPostBody(ApiLocalStorage.getClientId(), Number(amount), player, matchID))
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
const app = new App();
app.start();
