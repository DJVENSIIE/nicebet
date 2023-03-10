import {Match, PlayerIndex} from "../api/Match";

class App {
    public static sendMatchResult(matchID: number, bet: Earning, serverVersion: string) {
        // generate message
        let message: string;
        if (bet.amount > 0) {
            message = `Vous avez gagné $${bet.amount}`
        } else {
            bet.amount = bet.amount * -1;
            message = `Vous avez perdu $${bet.amount}`
        }

        // show a message if not already shown
        const res = ClientLocalStorage.getMatchResultNotificationStatus(matchID, serverVersion)
        if (res == null) {
            // check if we can send a notification
            if (Notification?.permission === "granted") {
                console.info("Notification dispatched with message:"+message)
                BonPariNotification.create("Match terminé", message)
            } else {
                console.info("No notification send with message:"+message)
            }
            ClientLocalStorage.setMatchResultNotificationStatusSend(matchID, serverVersion)
        }

        // return message
        return message
    }

    private backArrow: Element;
    private title: Element;
    private list: Element;
    private match: Element;
    private loading: Element;
    // @ts-ignore
    private socket = io("ws://localhost:3000");
    private lastID: string | null = null;
    private keyFocusIndex = 0

    constructor() {
        this.backArrow = document.querySelector("#back")!!
        this.title = document.querySelector("#title")!!
        this.list = document.querySelector("#list")!!
        this.match = document.querySelector("#match")!!
        this.loading = document.querySelector("#loading")!!
    }

    public start() {
        // ask for permission to show notifications
        if (Notification?.permission !== "granted") {
            console.log("Les notifications sont désactivées. Requesting permissions.")
            Notification.requestPermission().then();
        } else {
            console.log("Les notifications sont activées.")
        }

        // listen for bet results
        this.socket.on("matchEvent", (result: any) => {
            const clientID = ClientLocalStorage.getClientId()
            if (result.data[clientID] != undefined) {
                App.sendMatchResult(result.match_id, result.data[clientID], result.version)
            }
        });

        // listen for events
        // https://www.designcise.com/web/tutorial/how-to-detect-if-the-browser-tab-is-active-or-not-using-javascript
        document.addEventListener('visibilitychange', () => {
            // no listening
            if (this.lastID == null) {
                // only printed once
                if (document.hidden)
                    console.info("Not match to listen to")
                return
            }

            if (document.hidden) {
                console.info("Document hidden listen")
                this.socket.on("matchEvent"+this.lastID, (result: any) => {
                    console.info("Event received")
                    if (Notification?.permission === "granted") {
                        console.info("Notification will be emitted.")
                        let body : string
                        let title : string
                        const e = MatchEventParser.parse(result)

                        if (e instanceof ContestationMatchEvent) {
                            const player = Player.parse(result.data).getFullName()
                            title = "Contestation"
                            body = "Contestation de "+player+" "+(e.hasContestationPassed ? "acceptée" : "refusée")
                        } else if (e instanceof PointMatchEvent) {
                            const player = Player.parse(result.data).getFullName()
                            title = "Point marqué"
                            body = "Un point a été marqué par "+player
                        } else if (e instanceof SetMatchEvent) {
                            title = "Changement de manche"
                            body = "Changement de manche"
                        } else if (e instanceof MatchDoneEvent) {
                            title = "Match terminé"
                            body = "Match terminé"
                        } else {
                            throw new Error("Unknown event.")
                        }
                        BonPariNotification.create(title, body)
                    }
                });
            } else {
                console.info("Document hidden stop listen")
                this.socket.off("matchEvent"+this.lastID);
            }
        });

        // show the right page
        this.configureOnePage(ClientLocalStorage.getSelectedMatchIfAny());
        // and up to date
        this.refresh(true);

        // update every 60 seconds
        setInterval(() => this.refresh(), 60000)

        // add keyboard support
        document.onkeydown = e => {
            switch (e.code) {
                case 'Backspace': e.preventDefault(); this.onReturnPressed(); break;
                case 'KeyR': e.preventDefault(); this.refresh(); break;
                case 'KeyJ':
                    // move to the next selectable
                    const buttons = document.querySelectorAll(".onResetFocusPressed")
                    if (buttons.length > this.keyFocusIndex) {
                        e.preventDefault();
                        // focus
                        // @ts-ignore
                        buttons[this.keyFocusIndex].focus();
                    }
                    // next
                    this.keyFocusIndex = (this.keyFocusIndex + 1) % buttons.length
                    break;
            }
        }
    }

    /**
     * Router
     */
    private configureOnePage(newId: string|null) {
        this.lastID = newId;
        this.keyFocusIndex = 0; // reset

        if (newId == null) {
            // clear
            ClientLocalStorage.clearSelectedMatch()

            this.backArrow.setAttribute("hidden", "")
            this.match.setAttribute("hidden", "")
            this.list.removeAttribute("hidden")
            this.title.innerHTML = `
                <span>Bienvenue sur BonPari</span>
                <img src="_assets/tennis.png" alt="BonPari" width="32">
            `
        } else {
            // set
            ClientLocalStorage.setSelectedMatchIfAny(newId)

            this.backArrow.removeAttribute("hidden")
            this.list.setAttribute("hidden", "")
            this.match.removeAttribute("hidden")
            this.title.textContent = "Résumé"
        }
    }

    private refreshError(error: any, callback: any) {
        this.loading.innerHTML = `<p>Impossible de se connecter au serveur.</p>`
        if (error instanceof ApiConnectionLostError) {
            callback(error.cachedData)
        }
    }

    private refreshDate() {
        // 1663454676
        return "Dernière mise-à-jour: " + new Date().toTimeString().substring(0,8)
    }

    /**
     * Refresh what has to be refreshed.
     * We are changing the message if we are loading (Chargement...)
     * or if we are updating (Actualisation...)
     */
    private refresh(isLoading = false) {
        this.loading.textContent = isLoading ? "Chargement..." : "Actualisation..."

        if (this.lastID == null) {
            // show list
            BonPariAPI.getAllGames().then((r : Array<MatchSummary>) => {
                this.loading.textContent = this.refreshDate()
                MatchListViewHolder.updateList(r)
            }).catch(r => this.refreshError(r, (r: any) => MatchListViewHolder.updateList(r)))
        } else {
            // show content
            BonPariAPI.getGame(Number(this.lastID)).then((r: Match) => {
                this.loading.textContent = this.refreshDate()
                MatchViewHolder.updateMatch(r)
            }).catch(r =>
                this.refreshError(r, (r: any) => MatchViewHolder.updateMatch(r)))
        }
    }

    /*
    HTML Events
     */

    public onReturnPressed() {
        this.configureOnePage(null)
        this.refresh()
    }

    public onMatchPressed(id: number) {
        this.configureOnePage(String(id))
        this.refresh()
    }

    public onBetPressed(matchID: number, player: PlayerIndex) {
        let amount = prompt(`Parier sur joueur ${player+1}`, "0");
        if (amount == null) return;
        BonPariAPI.bet(new BetPostBody(ClientLocalStorage.getClientId(), Number(amount), player, matchID))
            .then(r => {
                if (r.tag != BetResult.ACCEPTED) {
                    alert(r.tag)
                } else {
                    this.refresh()
                }
            })
            .catch(console.error)
    }
}

// global variable that will be used
// in the html
// see methods such as #onReturnPressed
const app = new App()
app.start();