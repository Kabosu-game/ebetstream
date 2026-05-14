import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'live.ebetstream.app',
  appName: 'EbetStream',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f0f',
      showSpinner: false,
    },
  },
};

export default config;
