import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { biometricService } from '../services/biometricService';
import config from '../../constant';

const WebViewScreen = ({ navigation }) => {
  const webViewRef = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const handleWebViewMessage = async event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'LOGIN_SUCCESS') {
        await biometricService.saveCredentials({
          user: data.user,
          token: data.token,
        });
        Alert.alert(
          'Login Successful',
          'You can now use biometric login next time.',
          [{ text: 'OK', onPress: () => navigation.replace('BiometricLogin') }],
        );
      }

      if (data.type === 'LOGOUT') {
        await biometricService.removeCredentials();
        navigation.replace('BiometricLogin');
      }
    } catch (error) {
      console.error('WebView message error:', error);
    }
  };

  const injectedJavaScript = `
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return originalFetch.apply(this, args).then(response => {
        if (args[0].includes('/auth/login')) {
          response.clone().json().then(data => {
            if (data.success && data.token && data.userData) {
              const user = {
                userId: data.userData._id,
                name: data.userData.name,
                email: data.userData.email
              };
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'LOGIN_SUCCESS',
                user,
                token: data.token
              }));
            }
          });
        }
        return response;
      });
    };
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
      if (key === 'token') {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
      }
      return originalRemoveItem.apply(this, arguments);
    };
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: config.BASE_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleWebViewMessage}
        injectedJavaScript={injectedJavaScript}
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
export default WebViewScreen;
