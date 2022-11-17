import {Match} from "../api/Match";

class App {
    private static SELECT_KEY = 'match_id';
    private backArrow: Element ;
    private title: Element;
    private list: Element;
    private match: Element;
    // @ts-ignore
    private socket = io("ws://localhost:3000");
    private lastID: string | null = null;

    constructor() {
        this.backArrow = document.querySelector("#back")!!
        this.title = document.querySelector("#title")!!
        this.list = document.querySelector("#list")!!
        this.match = document.querySelector("#match")!!
    }

    public onBetPressed(partie:any,joueur:any) {
        //localStorage.setItem(App.SELECT_KEY, String(id))
        //this.render(String(id))
        console.log('parier')
        let montant = prompt(`Parier sur joueur ${joueur+1}`, "0");
        let client = "client1"
        this.fetchParier(partie,client,joueur,montant);
        //todo refresh
    }

    fetchParier(partie:any,client:String,joueur:any,montant:any){
        const postData = {
            partie: partie,
            client: client,
            joueur: joueur,
            montant: montant
        }
        fetch("http://localhost:3000/parties/parier" , {
          method: "POST", 
          body: JSON.stringify(postData),
          headers: {"Content-type":"application/json;charset=UTF-8"}
        })
          .then(response => response.json())
          .then(post => console.log(post)) //le post créé
          .catch(err => console.log(err))
    }

    start() {
        this.configureOnePage(localStorage.getItem(App.SELECT_KEY));
        this.refresh();

        // update every 60 seconds
        setInterval(() => this.refresh(), 60000)
    }

    configureOnePage(newId: string|null) {
        // disable
        if (this.lastID != null)
            this.socket.off("matchEvent"+this.lastID);

        this.lastID = newId;

        if (newId == null) {
            // clear
            localStorage.removeItem(App.SELECT_KEY)

            this.backArrow.setAttribute("hidden", "")
            this.match.setAttribute("hidden", "")
            this.list.removeAttribute("hidden")
            this.title.innerHTML = `
                <span>Bienvenue sur BonPari</span>
                <img src="_assets/tennis.png" alt="BonPari" width="32">
            `
        } else {
            // set
            localStorage.setItem(App.SELECT_KEY, newId)

            this.backArrow.removeAttribute("hidden")
            this.list.setAttribute("hidden", "")
            this.match.removeAttribute("hidden")
            this.title.textContent = "Résumé"
            this.socket.on("matchEvent0", (p: any) => {
                // ...
                console.log(p)
            });
        }
    }

    // todo: handle errors
    refresh() {
        if (this.lastID == null) {
            // show list
            BonPariAPI.getAllGames().then((r : Array<MatchSummary>) => {
                MatchListViewHolder.updateList(r)
            }).catch(console.error)
        } else {
            // show content
            BonPariAPI.getGame(Number(this.lastID)).then((r: Match) => {
                MatchViewHolder.updateMatch(r)
            }).catch(console.error)
        }
    }

    public onReturnPressed() {
        this.configureOnePage(null)
        this.refresh()
    }

    public onMatchPressed(id: number) {
        this.configureOnePage(String(id))
        this.refresh()
    }
}

const app = new App()
app.start();