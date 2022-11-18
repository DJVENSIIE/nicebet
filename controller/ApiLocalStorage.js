"use strict";
class ApiLocalStorage {
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
/*
 * Save locally the selected match
 */
ApiLocalStorage.SELECT_KEY = 'match_id';
