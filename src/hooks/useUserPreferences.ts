import { useCallback, useEffect, useState } from "react";
import {
  getUserPreferences,
  PREFERENCES_EVENT,
  resetUserPreferences,
  setUserPreferences,
} from "@/lib/preferences/storage";
import type { UserPreferences } from "@/lib/preferences/types";

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => getUserPreferences());

  useEffect(() => {
    const sync = () => setPreferences(getUserPreferences());
    sync();

    if (typeof window === "undefined") return;

    window.addEventListener(PREFERENCES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const updatePreferences = useCallback((next: Partial<UserPreferences>) => {
    const updated = setUserPreferences(next);
    setPreferences(updated);
    return updated;
  }, []);

  const resetPreferences = useCallback(() => {
    const updated = resetUserPreferences();
    setPreferences(updated);
    return updated;
  }, []);

  return { preferences, updatePreferences, resetPreferences };
};
