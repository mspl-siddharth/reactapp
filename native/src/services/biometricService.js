import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const biometricService = {
  async isBiometricAvailable() {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      return { available, biometryType };
    } catch {
      return { available: false, biometryType: null };
    }
  },

  async authenticate(promptMessage = 'Authenticate to continue') {
    try {
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      return {
        success,
        cancelled:
          error?.includes('User cancellation') || error?.includes('Cancel'),
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { success: false, cancelled: false, error: error.message };
    }
  },

  async saveCredentials(userData) {
    try {
      if (!userData?.user || !userData?.token) return false;
      await AsyncStorage.setItem('user_credentials', JSON.stringify(userData));
      return true;
    } catch {
      return false;
    }
  },

  async getCredentials() {
    try {
      const credentials = await AsyncStorage.getItem('user_credentials');
      return credentials ? JSON.parse(credentials) : null;
    } catch {
      return null;
    }
  },

  async removeCredentials() {
    try {
      await AsyncStorage.removeItem('user_credentials');
      return true;
    } catch {
      return false;
    }
  },
};
