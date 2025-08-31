"use client";

import { ThemeMode, ThemePreset, ThemePreferences } from "./theme";

export function updateThemeMode(mode: ThemeMode) {
	const html = document.documentElement;

	if (mode === "dark") {
		html.classList.add("dark");
	} else {
		html.classList.remove("dark");
	}
}

export function updateThemePreset(preset: ThemePreset) {
	const html = document.documentElement;
	html.setAttribute("data-theme-preset", preset);
}

export function updateTheme(preferences: ThemePreferences) {
	updateThemeMode(preferences.mode);
	updateThemePreset(preferences.preset);
}

export function setValueToCookie(name: string, value: string, days = 365) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getValueFromCookie(name: string): string | null {
	if (typeof document === "undefined") return null;

	const nameEQ = name + "=";
	const ca = document.cookie.split(";");

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

export function saveThemePreferences(preferences: ThemePreferences) {
	setValueToCookie("theme-mode", preferences.mode);
	setValueToCookie("theme-preset", preferences.preset);
}

export function loadThemePreferences(): ThemePreferences {
	const mode = (getValueFromCookie("theme-mode") as ThemeMode) || "light";
	const preset =
		(getValueFromCookie("theme-preset") as ThemePreset) || "default";

	return { mode, preset };
}
