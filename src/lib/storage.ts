/**
 * Persistent storage abstraction.
 *
 * On native Capacitor platforms, uses @capacitor/preferences (Android
 * SharedPreferences) which reliably survives app kills and OS memory
 * reclamation.  On web, falls back to localStorage / sessionStorage.
 */

import { isNativePlatform } from "./platform";

const REMEMBER_FLAG = "cultivation-remember";

async function getPreferences() {
  const { Preferences } = await import("@capacitor/preferences");
  return Preferences;
}

/** Read a persisted value (Remember Me). */
export async function getPersistedUser(): Promise<string | null> {
  // Native: prefer Capacitor Preferences for reliability
  if (typeof window !== "undefined" && isNativePlatform()) {
    try {
      const Prefs = await getPreferences();
      const { value } = await Prefs.get({ key: "cultivation-user" });
      if (value) return value;
    } catch {
      // fall through to web storage
    }
  }

  if (typeof window === "undefined") return null;

  // Web: check localStorage (Remember Me) then sessionStorage (session-only)
  return (
    localStorage.getItem("cultivation-user") ||
    sessionStorage.getItem("cultivation-user")
  );
}

/** Persist user data according to Remember Me preference. */
export async function persistUser(
  json: string,
  rememberMe: boolean
): Promise<void> {
  if (typeof window === "undefined") return;

  if (rememberMe) {
    localStorage.setItem("cultivation-user", json);
    localStorage.setItem(REMEMBER_FLAG, "1");
    sessionStorage.removeItem("cultivation-user");

    // Native: also write to Capacitor Preferences for reliability
    if (isNativePlatform()) {
      try {
        const Prefs = await getPreferences();
        await Prefs.set({ key: "cultivation-user", value: json });
        await Prefs.set({ key: REMEMBER_FLAG, value: "1" });
      } catch {
        // localStorage write already succeeded
      }
    }
  } else {
    sessionStorage.setItem("cultivation-user", json);
    localStorage.removeItem("cultivation-user");
    localStorage.removeItem(REMEMBER_FLAG);

    if (isNativePlatform()) {
      try {
        const Prefs = await getPreferences();
        await Prefs.remove({ key: "cultivation-user" });
        await Prefs.remove({ key: REMEMBER_FLAG });
      } catch {
        // no-op
      }
    }
  }
}

/** Clear all auth storage on logout. */
export async function clearPersistedUser(): Promise<void> {
  if (typeof window === "undefined") return;

  localStorage.removeItem("cultivation-user");
  localStorage.removeItem(REMEMBER_FLAG);
  sessionStorage.removeItem("cultivation-user");

  if (isNativePlatform()) {
    try {
      const Prefs = await getPreferences();
      await Prefs.remove({ key: "cultivation-user" });
      await Prefs.remove({ key: REMEMBER_FLAG });
    } catch {
      // no-op
    }
  }
}
