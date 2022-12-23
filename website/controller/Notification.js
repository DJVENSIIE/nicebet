"use strict";
class BonPariNotification {
    static create(title, body) {
        const img = '_assets/tennis.png';
        const notification = new Notification(title, { body: body, icon: img });
    }
}
