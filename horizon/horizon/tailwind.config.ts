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
		lg: "1.8rem",
		xl: ["2.2rem", "1.3"],
		"2xl": "2.4rem",
		"3xl": "2.6rem",
		"4xl": "3.2rem",
		"5xl": "4rem",
		"6xl": ["4.4rem", "1.1"],
		"7xl": ["4.8rem", "1.1"],
		"8xl": ["8rem", "1.1"],
	  },
	  colors: {
			transparent: "transparent",
			white: "#fff",
			"off-white": "#f7f8f8",
			"transparent-white": "rgba(255, 255, 255, 0.08)",
			background: "#000212",
			grey: "#858699",    
			"grey-dark": "#222326",
			"primary-text": "#b4bcd0",
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
		"page-gradient":
        "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3), transparent)",
	  },
	  boxShadow: {
		primary: "rgb(80 63 205 / 50%) 0px 1px 40px",
	  },
	  transitionDelay: {
		0: "0ms",
	  },
	  keyframes: {
		"fade-in": {
			from: { opacity: "0", y: "-10px"},
			to: { opacity: "1", y: "none"},
    	},
	},
	animation: {
		"fade-in": "fade-in 1000ms 0s ease",
		},
	},
  plugins: [],
};
export default config;
