'use strict';

import { Notifications, Permissions } from "expo";
import { AsyncStorage } from "react-native";

import { ASYNCSTORAGE } from '../constants/constants'

function buildNotification() {
    return {
        title: "Mobile Flashcards",
        body: "Don't forget to take your quiz Today!",
        ios: {
            sound: true
        },
        android: {
            sound: true
        },
    };
}

export async function setNotification() {
    const data = JSON.parse(await AsyncStorage.getItem(ASYNCSTORAGE.NOTIFICATIONS_KEY));
    if (data !== null) return;

    const { status } = Permissions.askAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') return;

    Notifications.cancelAllScheduledNotificationsAsync()

    let today = new Date();
    today.setDate(today.getDate());
    today.setHours(13, 0, 0);

    Notifications.scheduleLocalNotificationAsync(
        buildNotification(),
        {
            time: today,
            repeat: 'day',
        }
    )

    AsyncStorage.setItem(ASYNCSTORAGE.NOTIFICATIONS_KEY, JSON.stringify(true))
}
