import { cookies } from "next/headers";
import { ThemePreferences, DEFAULT_THEME_PREFERENCES, ThemeMode, ThemePreset } from "./theme";

export async function getServerThemePreferences(): Promise<ThemePreferences> {
  const cookieStore = await cookies();
  
  const mode = cookieStore.get("theme-mode")?.value as ThemeMode || DEFAULT_THEME_PREFERENCES.mode;
  const preset = cookieStore.get("theme-preset")?.value as ThemePreset || DEFAULT_THEME_PREFERENCES.preset;
  
  return { mode, preset };
}