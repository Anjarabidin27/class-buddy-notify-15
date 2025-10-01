import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.58fdb57668734232b4b6f09ab8e92700',
  appName: 'class-buddy-notify-03',
  webDir: 'dist',
  server: {
    url: 'https://58fdb576-6873-4232-b4b6-f09ab8e92700.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;