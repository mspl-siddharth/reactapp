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
      try {
        const info = await biometricService.isBiometricAvailable();
        setBiometricAvailable(info.available);
        setBiometryType(info.biometryType);

        const credentials = await biometricService.getCredentials();
        setHasCredentials(!!credentials);

        setLoading(false);
      } catch (error) {
        console.error('Init error:', error);
        setLoading(false);
      }
    };

    init();
  }, [navigation]);

  const handleBiometricLogin = async () => {
    if (!hasCredentials) {
      Alert.alert(
        'No Credentials',
        'Please login with email and password first to enable biometric login',
        [{ text: 'OK' }],
      );
      return;
    }

    setLoading(true);
    try {
      await sessionService.loginWithBiometrics(navigation);
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewLogin = () => {
    navigation.replace('WebViewScreen');
  };

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

      {hasCredentials && (
        <Text style={styles.subtitle}>Biometric login is available</Text>
      )}

      {!hasCredentials && (
        <Text style={styles.subtitle}>
          Login with email and password to enable biometric login
        </Text>
      )}

      {biometricAvailable && hasCredentials && (
        <TouchableOpacity
          style={[styles.button, styles.biometricButton]}
          onPress={handleBiometricLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {biometryType === 'TouchID'
              ? 'Login with Touch ID'
              : biometryType === 'FaceID'
              ? 'Login with Face ID'
              : 'Login with Biometrics'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.webviewButton]}
        onPress={handleWebViewLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {hasCredentials
            ? 'Login with Email & Password'
            : 'Login with Email & Password'}
        </Text>
      </TouchableOpacity>

      {hasCredentials && (
        <Text style={styles.note}>
          Note: Cancelling biometric will bring you back to this screen
        </Text>
      )}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  biometricButton: {
    backgroundColor: '#007AFF',
  },
  webviewButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default BiometricLogin;
