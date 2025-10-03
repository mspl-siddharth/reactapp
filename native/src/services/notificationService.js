import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Alert } from 'react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Default Title',
    body: remoteMessage.notification?.body || 'Default Body',
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
      importance: AndroidImportance.HIGH,
    },
  });
});

export const notificationService = {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  },

  async getDeviceToken() {
    let token = await AsyncStorage.getItem('fcmToken');
    if (!token) {
      token = await messaging().getToken();
      if (token) await AsyncStorage.setItem('fcmToken', token);
    }
    return token;
  },

  async listenToMessages() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Default Title',
        body: remoteMessage.notification?.body || 'Default Body',
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
        },
      });

      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new message',
      );
    });
  },
};
