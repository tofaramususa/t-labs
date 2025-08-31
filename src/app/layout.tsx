import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { PreferencesProvider } from "@/lib/preferences-provider";
import { getServerThemePreferences } from "@/lib/server-theme-utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Midday | Run your business smarter",
		template: "%s | Midday",
	},
	description:
		"Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
	openGraph: {
		title: "Midday | Run your business smarter",
		description:
			"Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
		url: baseUrl,
		siteName:
			"Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "https://cdn.midday.ai/opengraph-image.jpg",
				width: 800,
				height: 600,
			},
			{
				url: "https://cdn.midday.ai/opengraph-image.jpg",
				width: 1800,
				height: 1600,
			},
		],
	},
	twitter: {
		title: "Midday | Run your business smarter",
		description:
			"Midday provides you with greater insight into your business and automates the boring tasks, allowing you to focus on what you love to do instead.",
		images: [
			{
				url: "https://cdn.midday.ai/opengraph-image.jpg",
				width: 800,
				height: 600,
			},
			{
				url: "https://cdn.midday.ai/opengraph-image.jpg",
				width: 1800,
				height: 1600,
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export const viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)" },
		{ media: "(prefers-color-scheme: dark)" },
	],
};

export default async function Layout({ children }: { children: ReactElement }) {
	const themePreferences = await getServerThemePreferences();

	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={themePreferences.mode}
			data-theme-preset={themePreferences.preset}
		>
			<body
				className={cn(
					`${GeistSans.variable} ${GeistMono.variable}`,
					"bg-black text-white overflow-x-hidden font-sans antialiased",
				)}
			>
				<PreferencesProvider initialPreferences={themePreferences}>
					<Header />
					<main className="relative">{children}</main>
				</PreferencesProvider>
			</body>
		</html>
	);
}
