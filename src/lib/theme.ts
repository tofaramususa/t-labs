export type ThemeMode = "light" | "dark";

export type ThemePreset = "default" | "brutalist" | "soft-pop" | "tangerine";

export interface ThemePreferences {
	mode: ThemeMode;
	preset: ThemePreset;
}

export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
	mode: "light",
	preset: "default",
};
