import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.signx.translator',
  appName: 'SignX ISL Translator',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ['camera'],
    },
  },
  android: {
    allowMixedContent: true,
    minWebViewVersion: 60,
  },
};

export default config;
