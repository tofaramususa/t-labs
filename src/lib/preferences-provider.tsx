"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemePreferences, DEFAULT_THEME_PREFERENCES } from "./theme";
import { preferencesStore } from "./preferences-store";
import { updateTheme, saveThemePreferences } from "./theme-utils";

interface PreferencesContextValue {
  preferences: ThemePreferences;
  setThemeMode: (mode: ThemePreferences["mode"]) => void;
  setThemePreset: (preset: ThemePreferences["preset"]) => void;
  toggleTheme: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined
);

interface PreferencesProviderProps {
  children: React.ReactNode;
  initialPreferences?: ThemePreferences;
}

export function PreferencesProvider({
  children,
  initialPreferences = DEFAULT_THEME_PREFERENCES,
}: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState<ThemePreferences>(initialPreferences);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initialize store with server preferences
    preferencesStore.setTheme(initialPreferences);
    setPreferences(initialPreferences);
    
    // Apply theme to DOM
    updateTheme(initialPreferences);
    
    setIsHydrated(true);

    // Subscribe to store changes
    const unsubscribe = preferencesStore.subscribe(() => {
      const newPreferences = preferencesStore.getState();
      setPreferences(newPreferences);
      updateTheme(newPreferences);
      saveThemePreferences(newPreferences);
    });

    return unsubscribe;
  }, [initialPreferences]);

  const setThemeMode = (mode: ThemePreferences["mode"]) => {
    preferencesStore.setThemeMode(mode);
  };

  const setThemePreset = (preset: ThemePreferences["preset"]) => {
    preferencesStore.setThemePreset(preset);
  };

  const toggleTheme = () => {
    const newMode = preferences.mode === "light" ? "dark" : "light";
    setThemeMode(newMode);
  };

  const value: PreferencesContextValue = {
    preferences,
    setThemeMode,
    setThemePreset,
    toggleTheme,
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}