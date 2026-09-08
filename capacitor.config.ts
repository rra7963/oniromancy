import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

export const IOS_BUNDLE_ID = "com.oniromancy.app";
export const APP_SERVER_URL = "https://www.oniromancy.com";

const config: CapacitorConfig = {
  appId: IOS_BUNDLE_ID,
  appName: "Oniromancy AI",
  webDir: "native-fallback",
  server: {
    url: APP_SERVER_URL,
    cleartext: false,
    allowNavigation: [
      "www.oniromancy.com",
      "oniromancy.com",
      "*.supabase.co",
    ],
  },
  ios: {
    contentInset: "never",
    scheme: "Oniromancy",
    preferredContentMode: "mobile",
    backgroundColor: "#050208",
  },
  plugins: {
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#050208",
      overlaysWebView: true,
    },
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#050208",
      showSpinner: false,
    },
  },
};

export default config;
