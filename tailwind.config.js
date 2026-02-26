/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#0f0f0f",
        card: "#1a1a1a",
        surface: "#141414",
        muted: "#aaaaaa",
        accent: {
          DEFAULT: "#e03500",
          dark: "#c02e00",
        },
        rim: "#2a2a2a",
      },
      fontFamily: {
        sans: ['"Outfit"', "Helvetica", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      screens: {
        tablet: { max: "900px" },
        mobile: { max: "600px" },
      },
    },
  },
  plugins: [],
};
