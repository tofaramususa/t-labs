"use client";

import { ThemeMode, ThemePreset, ThemePreferences, DEFAULT_THEME_PREFERENCES } from "./theme";

interface PreferencesState {
  theme: ThemePreferences;
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setTheme: (preferences: ThemePreferences) => void;
}

class PreferencesStore {
  private state: ThemePreferences = DEFAULT_THEME_PREFERENCES;
  private listeners: (() => void)[] = [];

  getState = (): ThemePreferences => this.state;

  setState = (newState: Partial<ThemePreferences>) => {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener());
  };

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  };

  setThemeMode = (mode: ThemeMode) => {
    this.setState({ mode });
  };

  setThemePreset = (preset: ThemePreset) => {
    this.setState({ preset });
  };

  setTheme = (preferences: ThemePreferences) => {
    this.setState(preferences);
  };
}

export const preferencesStore = new PreferencesStore();

export const usePreferences = () => {
  const [state, setState] = React.useState(preferencesStore.getState());

  React.useEffect(() => {
    return preferencesStore.subscribe(() => {
      setState(preferencesStore.getState());
    });
  }, []);

  return {
    theme: state,
    setThemeMode: preferencesStore.setThemeMode,
    setThemePreset: preferencesStore.setThemePreset,
    setTheme: preferencesStore.setTheme,
  };
};

import React from "react";