import {Match} from "../api/Match";

class App {
    private static SELECT_KEY = 'match_id';
    private backArrow: Element ;
    private title: Element;
    private list: Element;
    private match: Element;
    private lastID: string | null = null;

    constructor() {
        this.backArrow = document.querySelector("#back")!!
        this.title = document.querySelector("#title")!!
        this.list = document.querySelector("#list")!!
        this.match = document.querySelector("#match")!!
    }

    showList() {
        // todo: handle errors
        BonPariAPI.getAllGames().then((r : Array<MatchSummary>) => {
            MatchListViewHolder.updateList(r)
        }).catch(console.error)
    }

    showMatch(id: number) {
        // todo: handle errors
        // show content
        BonPariAPI.getGame(id).then((r: Match) => {
           MatchViewHolder.updateMatch(r)
        }).catch(console.error)
    }

    public onReturnPressed() {
        localStorage.removeItem(App.SELECT_KEY)
        this.render(null)
    }

    public onMatchPressed(id: number) {
        localStorage.setItem(App.SELECT_KEY, String(id))
        this.render(String(id))
    }

    public refresh() {
        this.render(this.lastID)
    }

    start() {
        this.render(localStorage.getItem(App.SELECT_KEY))
        // update every 60 seconds
        setInterval(() => this.refresh(), 60000)
    }

    private render(id: string|null) {
        this.lastID = id
        if (id == null) {
            this.backArrow.setAttribute("hidden", "")
            this.match.setAttribute("hidden", "")
            this.list.removeAttribute("hidden")
            this.list.replaceChildren() // remove children
            this.title.innerHTML = `
                <span>Bienvenue sur BonPari</span>
                <img src="_assets/tennis.png" alt="BonPari" width="32">
            `
            app.showList();
        } else {
            this.backArrow.removeAttribute("hidden")
            this.list.setAttribute("hidden", "")
            this.match.removeAttribute("hidden")
            this.title.textContent = "Résumé"
            app.showMatch(Number(id))
        }
    }
}

const app = new App()
app.start();