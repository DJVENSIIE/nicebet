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
        left.innerHTML = `<h3 class="fs-5 text-center">Tournoi ${match.tournament} - ${match.startingAt} - Terrain ${match.terrain}</h3>
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

                       <tr><td colspan="7">${match.getPlayerReclamations(p1)} contestations Restantes</td></tr>
                       <tr><td colspan="7" class="text-center fs-3 fw-bold">VS</td></tr>
                       <tr><td colspan="7" class="text-end">${match.getPlayerReclamations(p2)} contestations Restantes</td></tr>

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
        const right = document.createElement("div");
        right.setAttribute("class", "col-md-6");
        right.innerHTML = `
        `;
        x.replaceChildren(left, right);
    }
}
// @ts-ignore
MatchViewHolder.match = null;
