'use strict';

import { Notifications, Permissions } from "expo";

export async function clearLocalNotification() {
    const data = await DB.notifications.remove({});

    Notifications.cancelAllScheduledNotificationsAsync();

    return data;
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
    const data = await DB.notifications.find({});

    if (data.length === 0) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
            if (status === 'granted') {
                Notifications.cancelAllScheduledNotificationsAsync();

                let notification = buildNotification();

                Notifications.scheduleLocalNotificationAsync(notification, {
                    time: today,
                    repeat: 'day',
                }).then(result => {
//                    alert(result);
                });

                notification.id = "";
                DB.notifications.add(notification);
            }
        });
    }
}
