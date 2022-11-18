"use strict";
/**
 * Save/Manage client_id
 * And local app state (current page...)
 */
class ClientLocalStorage {
    // source: https://stackoverflow.com/questions/59412625/generate-random-uuid-javascript
    static generateUniqSerial() {
        return 'xxxx-xxxx-xxx-xxxx'.replace(/x/g, () => {
            const r = Math.floor(Math.random() * 16);
            return r.toString(16);
        });
    }
    // obviously this is not secure
    static getClientId() {
        if (ClientLocalStorage.CLIENT_ID == null) {
            let stored_id = localStorage.getItem(ClientLocalStorage.CLIENT_ID_KEY);
            if (stored_id == null) {
                // create
                stored_id = ClientLocalStorage.generateUniqSerial();
            }
            ClientLocalStorage.CLIENT_ID = stored_id;
            localStorage.setItem(ClientLocalStorage.CLIENT_ID_KEY, stored_id);
        }
        return ClientLocalStorage.CLIENT_ID;
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
        return localStorage.getItem(ClientLocalStorage.SELECT_KEY);
    }
    static setSelectedMatchIfAny(newId) {
        localStorage.setItem(ClientLocalStorage.SELECT_KEY, newId);
    }
    static clearSelectedMatch() {
        localStorage.removeItem(ClientLocalStorage.SELECT_KEY);
    }
}
ClientLocalStorage.CLIENT_ID = null;
ClientLocalStorage.CLIENT_ID_KEY = "CLIENT_ID";
/*
 * Save locally the selected match
 */
ClientLocalStorage.SELECT_KEY = 'match_id';
