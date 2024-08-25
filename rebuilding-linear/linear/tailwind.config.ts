import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	  fontFamily: {
		sans: "SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif"
	  },
	  fontSize: {
		md: "1.6rem",
		lg: "2.2rem",
		"5xl": "8rem",
	  },
	  colors: {
			background: "#000212",
	  },
    },
  plugins: [],
};
export default config;
