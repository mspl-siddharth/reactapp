import { biometricService } from './biometricService';

export const sessionService = {
  async loginWithBiometrics(navigation) {
    const info = await biometricService.isBiometricAvailable();
    if (!info.available) return false;

    const credentials = await biometricService.getCredentials();
    if (!credentials?.token) return false;

    const authenticated = await biometricService.authenticate();
    if (authenticated) {
      navigation.replace('WebViewScreen', { bioToken: credentials.token });
      return true;
    }
    return false;
  },

  async reCheck(navigation, clearWebTokens) {
    const credentials = await biometricService.getCredentials();
    if (!credentials?.token) return false;

    const info = await biometricService.isBiometricAvailable();
    if (!info.available) return false;

    const authenticated = await biometricService.authenticate();
    if (!authenticated) {
      await biometricService.removeCredentials();
      if (clearWebTokens) {
        clearWebTokens();
      }
      navigation.replace('BiometricLogin');
      return false;
    }
    return true;
  },
};
