class MatchListViewHolder {
    private static list : Array<MatchSummary> = []

    // update the list
    static updateList(r: Array<MatchSummary>) {
        if (r == null) return
        this.list = r
        this.render()
    }

    // update the view
    private static render() {
        const x = document.querySelector("#list")!!
        x.replaceChildren() // remove children
        this.list.forEach(m => x.appendChild(MatchListViewHolder.generateHTML(m)))
    }

    // generate a card
    private static generateHTML(matchSummary: MatchSummary) {
        const div = document.createElement("div")
        div.innerHTML = `<div class="col card pt-3">
                <h3 class="fs-5 text-center">Tournoi ${matchSummary.tournament} - ${matchSummary.startingAt} - Terrain ${matchSummary.terrain}</h3>
                <div class="row p-3">
                    <div class="col-6">
                        <b>${matchSummary.Player1.getFullName()}</b><br>
                        ${matchSummary.Player1.age} ans<br>
                        ${matchSummary.Player1.country}
                    </div>
                    <div class="col-6">
                        <b>${matchSummary.Player2.getFullName()}</b><br>
                        ${matchSummary.Player2.age} ans<br>
                        ${matchSummary.Player2.country}
                    </div>
                </div>
                <p class="text-center">
                    <button class="btn btn-info btn-blue text-white selectMatchButton"
                    onclick="app.onMatchPressed(${matchSummary.id})">Regarder le match</button>
                </p>
            </div>`
        return div
    }
}