class ApiLocalStorage {
    private static CLIENT_ID : string | null = null
    private static CLIENT_ID_KEY = "CLIENT_ID"

    // source: https://stackoverflow.com/questions/59412625/generate-random-uuid-javascript
    private static generateUniqSerial(): string {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/x/g, () => {
            const r = Math.floor(Math.random() * 16);
            return r.toString(16);
        });
    }

    // obviously this is not secure
    public static getClientId () {
        if (ApiLocalStorage.CLIENT_ID == null) {
            let stored_id = localStorage.getItem(ApiLocalStorage.CLIENT_ID_KEY)
            if (stored_id == null) {
                // create
                stored_id = ApiLocalStorage.generateUniqSerial()
            }
            ApiLocalStorage.CLIENT_ID = stored_id
            localStorage.setItem(ApiLocalStorage.CLIENT_ID_KEY, stored_id)
        }
        return ApiLocalStorage.CLIENT_ID
    }


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