import localFont from "next/font/local";

// Load Tobias variable fonts - these contain all weights
export const tobiasFont = localFont({
  src: [
    {
      path: "../../public/fonts/TobiasTRIALVF-Uprights-BF6719af6e15aea.ttf",
      weight: "100 900", // Variable font supports weight range
      style: "normal",
    },
    {
      path: "../../public/fonts/TobiasTRIALVF-Italics-BF6719af6e1a816.ttf", 
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-tobias",
  display: "swap",
  preload: true,
});