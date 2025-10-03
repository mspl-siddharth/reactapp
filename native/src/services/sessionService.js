import { biometricService } from './biometricService';

export const sessionService = {
  async loginWithBiometrics(navigation) {
    try {
      const info = await biometricService.isBiometricAvailable();
      if (!info.available) {
        navigation.replace('BiometricLogin');
        return false;
      }

      const credentials = await biometricService.getCredentials();
      if (!credentials?.token) {
        navigation.replace('BiometricLogin');
        return false;
      }

      const authResult = await biometricService.authenticate();

      if (authResult.success) {
        navigation.replace('WebViewScreen', { bioToken: credentials.token });
        return true;
      }

      if (authResult.cancelled) {
        navigation.replace('BiometricLogin');
        return false;
      }

      await biometricService.removeCredentials();
      navigation.replace('BiometricLogin');
      return false;
    } catch (error) {
      console.error('Biometric login error:', error);
      navigation.replace('BiometricLogin');
      return false;
    }
  },

  async reCheck(navigation, clearWebTokens) {
    try {
      const credentials = await biometricService.getCredentials();
      if (!credentials?.token) {
        navigation.replace('BiometricLogin');
        return false;
      }

      const info = await biometricService.isBiometricAvailable();
      if (!info.available) {
        navigation.replace('BiometricLogin');
        return false;
      }

      const authResult = await biometricService.authenticate();

      if (authResult.success) {
        return true;
      }

      if (authResult.cancelled) {
        navigation.replace('BiometricLogin');
        return false;
      }

      await biometricService.removeCredentials();
      if (clearWebTokens) {
        clearWebTokens();
      }
      navigation.replace('BiometricLogin');
      return false;
    } catch (error) {
      await biometricService.removeCredentials();
      navigation.replace('BiometricLogin');
      return false;
    }
  },
};
