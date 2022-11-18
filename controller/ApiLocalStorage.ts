class ApiLocalStorage {
    /**
     * Did we send a notification to the user?
     */
    static getMatchResultNotificationStatus(matchID: number, serverVersion: string) {
        return localStorage.getItem("MatchResult"+matchID+"_"+serverVersion)
    }

    /**
     * Save that we send the notification
     */
    static setMatchResultNotificationStatusSend(matchID: number, serverVersion: string) {
        localStorage.setItem("MatchResult"+matchID+serverVersion, "send")
    }


    /*
     * Save locally the selected match
     */
    private static SELECT_KEY = 'match_id';
    static getSelectedMatchIfAny() {
        return localStorage.getItem(ApiLocalStorage.SELECT_KEY)
    }

    static setSelectedMatchIfAny(newId: string) {
        localStorage.setItem(ApiLocalStorage.SELECT_KEY, newId)
    }

    static clearSelectedMatch() {
        localStorage.removeItem(ApiLocalStorage.SELECT_KEY)
    }
}