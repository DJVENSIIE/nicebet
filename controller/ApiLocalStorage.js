"use strict";
class ApiLocalStorage {
    // source: https://stackoverflow.com/questions/59412625/generate-random-uuid-javascript
    static generateUniqSerial() {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/x/g, () => {
            const r = Math.floor(Math.random() * 16);
            return r.toString(16);
        });
    }
    // obviously this is not secure
    static getClientId() {
        if (ApiLocalStorage.CLIENT_ID == null) {
            let stored_id = localStorage.getItem(ApiLocalStorage.CLIENT_ID_KEY);
            if (stored_id == null) {
                // create
                stored_id = ApiLocalStorage.generateUniqSerial();
            }
            ApiLocalStorage.CLIENT_ID = stored_id;
            localStorage.setItem(ApiLocalStorage.CLIENT_ID_KEY, stored_id);
        }
        return ApiLocalStorage.CLIENT_ID;
    }
    /**
     * Did we send a notification to the user?
     */
    static getMatchResultNotificationStatus(matchID, serverVersion) {
        return localStorage.getItem("MatchResult" + matchID + "_" + serverVersion);
    }
    /**
     * Save that we send the notification
     */
    static setMatchResultNotificationStatusSend(matchID, serverVersion) {
        localStorage.setItem("MatchResult" + matchID + serverVersion, "send");
    }
    static getSelectedMatchIfAny() {
        return localStorage.getItem(ApiLocalStorage.SELECT_KEY);
    }
    static setSelectedMatchIfAny(newId) {
        localStorage.setItem(ApiLocalStorage.SELECT_KEY, newId);
    }
    static clearSelectedMatch() {
        localStorage.removeItem(ApiLocalStorage.SELECT_KEY);
    }
}
ApiLocalStorage.CLIENT_ID = null;
ApiLocalStorage.CLIENT_ID_KEY = "CLIENT_ID";
/*
 * Save locally the selected match
 */
ApiLocalStorage.SELECT_KEY = 'match_id';
