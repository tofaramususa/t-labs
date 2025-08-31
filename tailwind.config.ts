import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: ["class"],
	theme: {
		container: {
			center: true,
		},
		extend: {
			fontFamily: {
				tobias: ["Tobias", "Times New Roman", "Georgia", "serif"],
				inter: [
					"Inter",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"sans-serif",
				],
				sans: [
					"Inter",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"sans-serif",
				],
				serif: ["Tobias", "Times New Roman", "Georgia", "serif"],
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
} satisfies Config;
