import type { UserPreferences } from "./types";

export const PREFERENCES_STORAGE_KEY = "dy_user_preferences";
export const ONBOARDING_STORAGE_KEY = "dy_onboarding_seen";
export const HINT_STORAGE_KEY = "dy_hint_dismissed";
export const PREFERENCES_EVENT = "dy-preferences-changed";

const DEFAULT_PREFERENCES: UserPreferences = {
  motionEnabled: true,
  terminalSoundsEnabled: true,
  guidedModeDefault: true,
  showPersistentHint: true,
  onboardingSeen: false,
};

const hasWindow = () => typeof window !== "undefined";

const readBool = (key: string, fallback: boolean) => {
  if (!hasWindow()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;
    return value === "true";
  } catch {
    return fallback;
  }
};

const dispatchPreferencesChanged = () => {
  if (!hasWindow()) return;
  window.dispatchEvent(new CustomEvent(PREFERENCES_EVENT));
};

const getStoredObject = (): Partial<UserPreferences> => {
  if (!hasWindow()) return {};
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

const setStoredObject = (value: Partial<UserPreferences>) => {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // no-op in restricted environments
  }
};

const getReduceMotion = () => {
  if (!hasWindow() || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

const sanitizePreferences = (raw: Partial<UserPreferences>): UserPreferences => {
  const withLegacy = {
    ...raw,
    onboardingSeen: typeof raw.onboardingSeen === "boolean" ? raw.onboardingSeen : readBool(ONBOARDING_STORAGE_KEY, false),
    showPersistentHint:
      typeof raw.showPersistentHint === "boolean" ? raw.showPersistentHint : !readBool(HINT_STORAGE_KEY, false),
  };

  const merged: UserPreferences = {
    ...DEFAULT_PREFERENCES,
    ...withLegacy,
  };

  if (getReduceMotion()) {
    merged.motionEnabled = false;
  }

  return merged;
};

export function getUserPreferences(): UserPreferences {
  return sanitizePreferences(getStoredObject());
}

export function setUserPreferences(next: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences();
  const merged = sanitizePreferences({ ...current, ...next });

  setStoredObject(merged);

  if (hasWindow()) {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, String(merged.onboardingSeen));
      window.localStorage.setItem(HINT_STORAGE_KEY, String(!merged.showPersistentHint));
    } catch {
      // no-op
    }
  }

  dispatchPreferencesChanged();
  return merged;
}

export function resetUserPreferences(): UserPreferences {
  if (hasWindow()) {
    try {
      window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      window.localStorage.removeItem(HINT_STORAGE_KEY);
    } catch {
      // no-op
    }
  }
  const fresh = getUserPreferences();
  dispatchPreferencesChanged();
  return fresh;
}
