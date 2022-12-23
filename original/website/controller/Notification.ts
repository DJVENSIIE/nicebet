class BonPariNotification {
    static create(title: string, body: string) {
        const img = '_assets/tennis.png';
        const notification = new Notification(title, { body: body, icon: img });
    }
}