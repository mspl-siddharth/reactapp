import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { sessionService } from '../services/sessionService';
import { biometricService } from '../services/biometricService';

const BiometricLogin = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState(null);

  useEffect(() => {
    const init = async () => {
      const info = await biometricService.isBiometricAvailable();
      setBiometricAvailable(info.available);
      setBiometryType(info.biometryType);

      const credentials = await biometricService.getCredentials();
      setHasCredentials(!!credentials);

      if (info.available && credentials) {
        const success = await sessionService.loginWithBiometrics(navigation);
        if (!success) setLoading(false);
        return;
      }

      setLoading(false);
    };

    init();
  }, []);

  const handleBiometricLogin = async () => {
    if (!hasCredentials) {
      Alert.alert(
        'No creds',
        'pls login with email password',
      );
      return;
    }

    setLoading(true);
    const success = await sessionService.loginWithBiometrics(navigation);
    if (!success) {
      Alert.alert(
        'auth failed',
        'bio failed, try again.',
      );
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

      {biometricAvailable && (
        <TouchableOpacity
          style={[styles.button, styles.biometricButton]}
          onPress={handleBiometricLogin}
        >
          <Text style={styles.buttonText}>
            {biometryType === 'Biometrics'
              ? 'Login with Biometrics'
              : biometryType === 'TouchID'
              ? 'Login with TouchID'
              : biometryType === 'FaceID'
              ? 'Login with FaceID'
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
