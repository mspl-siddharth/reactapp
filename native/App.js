import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BiometricLogin from './src/screens/BiometricLogin';
import WebViewScreen from './src/screens/WebViewScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BiometricLogin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="BiometricLogin" component={BiometricLogin} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
