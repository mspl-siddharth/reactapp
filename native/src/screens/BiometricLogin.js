import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { biometricService } from '../services/biometricService';

const BiometricLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [biometricInfo, setBiometricInfo] = useState({
    available: false,
    biometryType: null,
  });
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    const init = async () => {
      const info = await biometricService.isBiometricAvailable();
      setBiometricInfo(info);

      const credentials = await biometricService.getCredentials();
      setHasCredentials(!!credentials);

      if (info.available && credentials) {
        const authenticated = await biometricService.authenticate();
        if (authenticated && credentials?.token) {
          navigation.replace('WebViewScreen', { bioToken: credentials.token });
        }
      }

      setLoading(false);
    };
    init();
  }, []);

  const handleBiometricLogin = async () => {
    setLoading(true);

    if (!hasCredentials) {
      Alert.alert(
        'No Saved Credentials',
        'Please login with Email & Password first.',
      );
      setLoading(false);
      return;
    }

    const promptMessage =
      biometricInfo.biometryType === 'FaceID'
        ? 'Authenticate with Face ID'
        : biometricInfo.biometryType === 'TouchID'
        ? 'Authenticate with Touch ID'
        : 'Authenticate';

    const authenticated = await biometricService.authenticate(promptMessage);

    if (authenticated) {
      const credentials = await biometricService.getCredentials();
      if (credentials?.token) {
        navigation.replace('WebViewScreen', { bioToken: credentials.token });
      }
    } else {
      Alert.alert('Authentication Failed', 'Please try again.');
    }

    setLoading(false);
  };

  const handleWebViewLogin = () => navigation.replace('WebViewScreen');

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      {biometricInfo.available && hasCredentials && (
        <TouchableOpacity
          style={[styles.button, styles.biometricButton]}
          onPress={handleBiometricLogin}
        >
          <Text style={styles.buttonText}>
            {biometricInfo.biometryType === 'FaceID'
              ? 'Login with Face ID'
              : biometricInfo.biometryType === 'TouchID'
              ? 'Login with Touch ID'
              : 'Login with Biometrics'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.webviewButton]}
        onPress={handleWebViewLogin}
      >
        <Text style={styles.buttonText}>Login with Email & Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  biometricButton: { backgroundColor: '#007AFF' },
  webviewButton: { backgroundColor: '#34C759' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  loadingText: { marginTop: 20, fontSize: 16, color: '#666' },
});

export default BiometricLogin;
