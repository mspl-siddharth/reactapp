import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, BackHandler, Alert, AppState } from 'react-native';
import { WebView } from 'react-native-webview';
import { sessionService } from '../services/sessionService';
import { biometricService } from '../services/biometricService';
import config from '../../constant';

const WebViewScreen = ({ navigation, route }) => {
  const webViewRef = useRef(null);
  const [injectedjs, setInjectedjs] = useState('true;');
  const appState = useRef(AppState.currentState);
  const [isActive, setIsActive] = useState(AppState.currentState === 'active');
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const clearWebTokens = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.dispatchEvent(new MessageEvent('message', {
          data: ${JSON.stringify({ type: 'AUTH_FAILED' })}
        }));
        true;
      `);
    }
  }, []);

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

  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        !isCheckingAuth
      ) {
        setIsCheckingAuth(true);
        await sessionService.reCheck(navigation, clearWebTokens);
        setIsCheckingAuth(false);
      }

      setIsActive(nextAppState === 'active');
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [navigation, clearWebTokens, isCheckingAuth]);

  useEffect(() => {
    const loadToken = async () => {
      const credentials = await biometricService.getCredentials();
      if (credentials?.token) {
        setInjectedjs(
          `window.localStorage.setItem('bioToken', '${credentials.token}'); true;`,
        );
      }
    };
    loadToken();
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
          [{ text: 'OK' }],
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

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: config.BASE_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleWebViewMessage}
        injectedJavaScript={injectedjs}
        startInLoadingState
      />
      {!isActive && <View style={styles.whiteOverlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 10,
  },
});

export default WebViewScreen;
