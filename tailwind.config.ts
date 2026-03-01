import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#e03500",
          dark: "#c02e00",
        },
      },
      fontFamily: {
        sans: ['"Outfit"', "Helvetica", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      screens: {
        tablet: { max: "900px" },
        mobile: { max: "600px" },
      },
    },
  },
  plugins: [],
};

export default config;
