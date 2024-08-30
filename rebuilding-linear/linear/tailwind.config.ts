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
		xs: "1.3rem",
		sm: "1.4rem",
		md: "1.6rem",
		lg: ["2.2rem", "1.3"], //adding font size and line height too. 
		"5xl": ["8rem", "1"],
	  },
	  colors: {
			transparent: "transparent",
			white: "#fff",
			"white-a08": "rgba(255, 255, 255, 0.08)",
			background: "#000212",
			grey: "#858699",    
			"grey-dark": "#222326",
	  },
	  spacing: {
		0: "0",
		1: "0.4rem",
		2: "0.8rem",
		3: "1.2rem",
		4: "1.6rem",
		5: "2rem",
		6: "2.4rem",
		7: "2.8rem",
		8: "3.2rem",
		9: "3.6rem",
		10: "4rem",
		11: "4.4rem",
		12: "4.8rem",
		"navigation-height": "var(--navigation-height)",
	  },
	  backgroundImage: {
		"primary-gradient": "linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%)",
		"secondary-gradient": "linear-gradient(90deg, #3d3d3d 0%, #5a5a5a 100%)",
		"accent-gradient": "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
		"dark-gradient": "linear-gradient(180deg, #1a1a1a 0%, #2c2c2c 100%)",
		"light-gradient": "linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 100%)",
	  },
	  boxShadow: {
		primary: "rgb(80 63 205 / 50%) 0px 1px 40px",
	  },
    },
  plugins: [],
};
export default config;
