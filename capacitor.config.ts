import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.wuxia.cultivation",
  appName: "Cultivation Workout",
  webDir: "www",
  server: {
    // Points the WebView to the production server.
    // Change this URL to match your deployment address.
    url: "http://192.168.1.116:3000",
    cleartext: true, // Allow HTTP (non-HTTPS) connections
  },
  android: {
    // Allow mixed content (HTTP images/resources on HTTPS pages)
    allowMixedContent: true,
    backgroundColor: "#000000",
  },
};

export default config;
