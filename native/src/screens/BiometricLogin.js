import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const available = await biometricService.isBiometricAvailable();
        setIsBiometricAvailable(available);

        const credentials = await biometricService.getCredentials();
        setHasStoredCredentials(!!credentials);

        if (available && credentials) {
          const isAuthenticated = await biometricService.authenticate();
          if (isAuthenticated) {
            navigation.replace('WebViewScreen');
            return;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing biometric login:', error);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      if (!hasStoredCredentials) {
        Alert.alert(
          'No Saved Credentials',
          'Please login with Email & Password first.',
        );
        return;
      }

      const isAuthenticated = await biometricService.authenticate();
      if (isAuthenticated) {
        navigation.replace('WebViewScreen');
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebViewLogin = () => {
    navigation.replace('WebViewScreen');
  };

  if (isLoading) {
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
      <Text style={styles.subtitle}>Choose your login method</Text>

      {isBiometricAvailable && (
        <TouchableOpacity
          style={[styles.button, styles.biometricButton]}
          onPress={handleBiometricLogin}
        >
          <Text style={styles.buttonText}>Login with Biometric</Text>
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
