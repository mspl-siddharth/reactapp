// src/services/biometricService.js
import * as Keychain from 'react-native-keychain';

export const biometricService = {
  async isBiometricAvailable() {
    try {
      const biometricType = await Keychain.getSupportedBiometryType();
      return biometricType !== null;
    } catch {
      return false;
    }
  },

  async authenticate() {
    try {
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: { title: 'Authenticate to login' },
      });
      if (!credentials) return false;

      const data = JSON.parse(credentials.password);
      if (!data.user || !data.token) return false;

      return true;
    } catch {
      return false;
    }
  },

  async saveCredentials(userData) {
    try {
      if (!userData || !userData.user || !userData.token) return false;

      await Keychain.setGenericPassword(
        'user_credentials',
        JSON.stringify(userData),
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        },
      );
      return true;
    } catch {
      return false;
    }
  },

  async getCredentials() {
    try {
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: { title: 'Authenticate to login' },
      });
      return credentials ? JSON.parse(credentials.password) : null;
    } catch {
      return null;
    }
  },

  async removeCredentials() {
    try {
      await Keychain.resetGenericPassword();
      return true;
    } catch {
      return false;
    }
  },
};
