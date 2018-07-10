'use strict';

import { AsyncStorage } from 'react-native'

import { Notifications, Permissions } from "expo";

const NOTIFICATION_KEY = 'expo:notifications'

export function clearLocalNotification() {
    return AsyncStorage.removeItem(NOTIFICATION_KEY)
        .then(Notifications.cancelAllScheduledNotificationsAsync)
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

export function setLocalNotification() {
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if (data === null) {
                Permissions.askAsync(Permissions.NOTIFICATIONS)
                    .then(({ status }) => {
                        if (status === 'granted') {
                            Notifications.cancelAllScheduledNotificationsAsync()

                            let tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            tomorrow.setHours(20, 0 , 0)
              
                            Notifications.scheduleLocalNotificationAsync(
                                buildNotification(),
                                {
                                    time: tomorrow,
                                    repeat: 'day',
                                }
                            )

                            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
                        }
                    })
            }
        })
}
