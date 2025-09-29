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
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    const init = async () => {
      const available = await biometricService.isBiometricAvailable();
      setBiometricAvailable(available);

      const credentials = await biometricService.getCredentials();
      setHasCredentials(!!credentials);

      if (available && credentials) {
        const authenticated = await biometricService.authenticate();
        if (authenticated) navigation.replace('WebViewScreen');
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
    const authenticated = await biometricService.authenticate();
    if (authenticated) navigation.replace('WebViewScreen');
    else Alert.alert('Authentication Failed', 'Please try again.');
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

      {biometricAvailable && hasCredentials && (
        <TouchableOpacity
          style={[styles.button, styles.biometricButton]}
          onPress={handleBiometricLogin}
        >
          <Text style={styles.buttonText}>Login with Biometrics</Text>
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
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
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
