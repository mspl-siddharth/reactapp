import notifee, { AndroidImportance } from '@notifee/react-native';

export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
};

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();
  console.log('Notifee permission settings:', settings);
  return settings.authorizationStatus >= 1;
};
