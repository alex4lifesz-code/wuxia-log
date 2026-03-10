/**
 * Persistent storage abstraction.
 *
 * On native Capacitor platforms, uses @capacitor/preferences (Android
 * SharedPreferences) which reliably survives app kills and OS memory
 * reclamation.  On web, falls back to localStorage / sessionStorage.
 */

import { isNativePlatform } from "./platform";

const REMEMBER_FLAG = "cultivation-remember";

const STORAGE_TIMEOUT_MS = 3000;

async function getPreferences() {
  const { Preferences } = await import("@capacitor/preferences");
  return Preferences;
}

/** Race a promise against a timeout. Rejects if the timeout fires first. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Storage timeout")), ms)
    ),
  ]);
}

/** Read a persisted value (Remember Me). */
export async function getPersistedUser(): Promise<string | null> {
  // Native: prefer Capacitor Preferences for reliability
  if (typeof window !== "undefined" && isNativePlatform()) {
    try {
      const Prefs = await withTimeout(getPreferences(), STORAGE_TIMEOUT_MS);
      const { value } = await withTimeout(
        Prefs.get({ key: "cultivation-user" }),
        STORAGE_TIMEOUT_MS
      );
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
        const Prefs = await withTimeout(getPreferences(), STORAGE_TIMEOUT_MS);
        await withTimeout(Prefs.set({ key: "cultivation-user", value: json }), STORAGE_TIMEOUT_MS);
        await withTimeout(Prefs.set({ key: REMEMBER_FLAG, value: "1" }), STORAGE_TIMEOUT_MS);
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
        const Prefs = await withTimeout(getPreferences(), STORAGE_TIMEOUT_MS);
        await withTimeout(Prefs.remove({ key: "cultivation-user" }), STORAGE_TIMEOUT_MS);
        await withTimeout(Prefs.remove({ key: REMEMBER_FLAG }), STORAGE_TIMEOUT_MS);
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
      const Prefs = await withTimeout(getPreferences(), STORAGE_TIMEOUT_MS);
      await withTimeout(
        Prefs.remove({ key: "cultivation-user" }),
        STORAGE_TIMEOUT_MS
      );
      await withTimeout(
        Prefs.remove({ key: REMEMBER_FLAG }),
        STORAGE_TIMEOUT_MS
      );
    } catch {
      // no-op — web storage already cleared above
    }
  }
}
