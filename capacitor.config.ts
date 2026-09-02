import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mobile.masjid.arrahman',
  appName: 'Ar-Rahman Mobile',
  webDir: 'public',
  server: {
    url: 'https://dkm-arrahman.vercel.app/',
    cleartext: true
  }
};

export default config;
