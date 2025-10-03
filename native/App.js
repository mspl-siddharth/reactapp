import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BiometricLogin from './src/screens/BiometricLogin';
import WebViewScreen from './src/screens/WebViewScreen';
import SplashScreen from './src/screens/SplashScreen';
import { notificationService } from './src/services/notificationService';
import {
  createNotificationChannel,
  requestNotificationPermission,
} from './src/services/notiChannel';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    const initPush = async () => {
      try {
        await createNotificationChannel();

        const notifeePermission = await requestNotificationPermission();
        const fcmPermission = await notificationService.requestPermission();

        if (fcmPermission || notifeePermission) {
          const token = await notificationService.getDeviceToken();
          console.log('FCM Device Token:', token);
        }
      } catch (error) {
        console.error('Push notification initialization failed:', error);
      }
    };
    initPush();

    notificationService.listenToMessages();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="BiometricLogin" component={BiometricLogin} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
