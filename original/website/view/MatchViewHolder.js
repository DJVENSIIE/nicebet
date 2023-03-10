"use strict";
class MatchViewHolder {
    // update the list
    // @ts-ignore
    static updateMatch(r) {
        MatchViewHolder.match = r;
        this.render();
    }
    static formatSecondToHoursMinutes(seconds, addSeconds = false) {
        let h = Math.floor(seconds / 3600).toString();
        let m = (Math.floor(seconds / 60) % 60).toString();
        if (h.length == 1)
            h = "0" + h;
        if (m.length == 1)
            m = "0" + m;
        if (addSeconds) {
            let s = Math.floor(seconds % 60).toString();
            if (s.length == 1)
                s = "0" + s;
            return h + ":" + m + ":" + s;
        }
        return h + ":" + m;
    }
    // update the view
    static render() {
        const x = document.querySelector("#match");
        const match = MatchViewHolder.match;
        // @ts-ignore
        const p1 = PlayerIndex.Player1;
        // @ts-ignore
        const p2 = PlayerIndex.Player2;
        // @ts-ignore
        const s1 = SetIndex.Set1;
        // @ts-ignore
        const s2 = SetIndex.Set2;
        // @ts-ignore
        const s3 = SetIndex.Set3;
        const left = document.createElement("div");
        left.setAttribute("class", "col-md-6");
        let content = `<h3 class="fs-5 text-center">Tournoi ${match.tournament} - ${match.startingAt} - Terrain ${match.terrain}</h3>
                   <h3 class="fs-5 text-center mt-3">Durée du match : ${this.formatSecondToHoursMinutes(match.temps_partie, true)}</h3>

                   <table class="table table-borderless mt-4 fs-5 special-cols">
                       <tr class="bg-green">
                           <td>
                               <span class="align-middle">${match.Player1.getFullName()}</span>
                               <img src="_assets/win.png" alt="" class="ps-1" width="32" ${match.hasWon(p1) ? "" : "hidden"}>
                           </td><td>
                           <img src="_assets/tennis.png" alt="" class="ps-1" width="24" ${match.isAtServiceAndFinished(p1) ? "" : "hidden"}>
                       </td><td>${match.getPlayerScore(p1, s1)}</td><td>${match.getPlayerScore(p1, s2)}</td><td>${match.getPlayerScore(p1, s3)}</td>
                       <td>|</td><td>${match.getPlayerGame(p1)}</td>
                       </tr>

                       <tr><td colspan="7" class="pb-0">${match.getPlayerReclamations(p1)} contestations Restantes</td></tr>
                       <tr><td colspan="7" class="text-center fs-4 fw-bold py-0">VS</td></tr>
                       <tr><td colspan="7" class="text-end pt-0">${match.getPlayerReclamations(p2)} contestations Restantes</td></tr>

                       <tr class="bg-green">
                           <td>
                               <span class="align-middle">${match.Player2.getFullName()}</span>
                               <img src="_assets/win.png" alt="" class="ps-1" width="32" ${match.hasWon(p2) ? "" : "hidden"}>
                           </td><td>
                           <img src="_assets/tennis.png" alt="" class="ps-1" width="24" ${match.isAtServiceAndFinished(p2) ? "" : "hidden"}>
                       </td><td>${match.getPlayerScore(p2, s1)}</td><td>${match.getPlayerScore(p2, s2)}</td><td>${match.getPlayerScore(p2, s3)}</td>
                       <td>|</td><td>${match.getPlayerGame(p2)}</td>
                       </tr>
                   </table>`;
        // show bet
        const clientID = ClientLocalStorage.getClientId();
        if (!match.score.final) {
            // if no bet
            if (!match.bettingAvailable) {
                // can't be
                content += "<p class='text-center fs-5'>Le match est en cours, les paris sont fermés.</p>";
            }
            else {
                // can bet
                content += `
                    <div class="text-center my-4">
                        <button class="btn btn-info btn-blue text-white me-5 onResetFocusPressed" onclick="app.onBetPressed(${match.id}, ${p1})">Parier Joueur 1</button>
                        <button class="btn btn-info btn-blue text-white onResetFocusPressed" onclick="app.onBetPressed(${match.id}, ${p2})">Parier Joueur 2</button>
                        <br>
                    </div>`;
            }
            // show bet
            if (match.bets.has(clientID)) {
                const bet = match.bets.get(clientID);
                content += `<p class="text-center fs-5">Vos paris : $${bet.bet_on_j1} - $${bet.bet_on_j2}</p>`;
            }
        }
        // show outcome
        else if (match.earnings.has(clientID)) {
            // @ts-ignore
            const message = App.sendMatchResult(match.id, match.earnings.get(clientID), match.version);
            content += `<p class="text-center fs-5">${message}</p>`;
        }
        else {
            // well, no bet, no earning
            content += "<p class='text-center fs-5'>Le match est terminé.</p>";
        }
        left.innerHTML = content;
        const right = document.createElement("div");
        right.setAttribute("class", "col-md-6");
        content = `
             <p class="h3 bg-blueish text-center p-3">Evénements</p>
            <div class="overflow-scroll" style="max-height: 450px !important;">
                <table class="table table-borderless onResetFocusPressed" tabindex="0">`;
        function formatEvent(e) {
            if (e instanceof ContestationMatchEvent) {
                const player = e.isPlayer1 ? match.Player1.getFullName() : match.Player2.getFullName();
                return "Contestation de " + player + " " + (e.hasContestationPassed ? "acceptée" : "refusée");
            }
            else if (e instanceof PointMatchEvent) {
                const player = e.isPlayer1 ? match.Player1.getFullName() : match.Player2.getFullName();
                return "Un point a été marqué par " + player;
            }
            else if (e instanceof SetMatchEvent) {
                return "Changement de manche";
            }
            else if (e instanceof MatchDoneEvent) {
                return "Match terminé";
            }
            return "Unknown event.";
        }
        for (let e of match.events) {
            content += `<tr><td>${this.formatSecondToHoursMinutes(e.time)}</td><td> ${formatEvent(e)}</td></tr>`;
        }
        content += `</table></div>`;
        right.innerHTML = content;
        x.replaceChildren(left, right);
    }
}
// @ts-ignore
MatchViewHolder.match = null;
