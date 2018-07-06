'use strict';

import { Notifications, Permissions } from "expo";

export async function getNotificationPermission() {
    const { status } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );

    if (status !== 'granted') {
        await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
}

export function listenForNotifications() {
    Notifications.addListener(notification => {
        if (notification.origin === 'received') {
            alert(notification.title, notification.body);
        }
    });
}

function buildNotification() {
    return {
        title: "Mobile Flashcards",
        body: "Don't forget to take your quiz Today!",
        ios: {
            sound: true
        },
        android: {
            sound: true,
            priority: "high",
            sticky: false,
            vibrate: true
        },
    };
}

export async function setLocalNotification(today) {
    let notification = buildNotification();

    Notifications.scheduleLocalNotificationAsync(notification, {
        time: today
    });
}
