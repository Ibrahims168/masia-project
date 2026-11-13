import type { Config } from "tailwindcss";
// Masia palette, sampled from the logo: midnight navy, champagne gold, copper.
const config: Config = {
  future: { hoverOnlyWhenSupported: true },
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: { 50: "#FCFBF8", 100: "#F3EFE6", 200: "#EDE4D2", 300: "#E5E0D5", 400: "#E6CF9F" },
        gold: { DEFAULT: "#D7B576", deep: "#8C6A33", copper: "#CE9D72" },
        ink: { DEFAULT: "#0B1733", soft: "#586178" },
        navy: { DEFAULT: "#051127", 800: "#0B1A3D", 700: "#16295A" },
      },
      fontFamily: {
        sans: ["Manrope", "Heebo", "Cairo", "system-ui", "sans-serif"],
        brand: ["Jost", "Manrope", "system-ui", "sans-serif"],
        ar: ["Cairo", "Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 24px 60px -20px rgba(5,17,39,.28)",
        soft: "0 10px 30px -12px rgba(5,17,39,.2)",
      },
    },
  },
  plugins: [],
};
export default config;
