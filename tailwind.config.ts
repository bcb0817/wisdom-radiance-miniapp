import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"], theme: { extend: { colors: { teal: { 50: "#f0faf8", 100: "#d9f1ec", 500: "#2f8f83", 600: "#24756d", 700: "#1e5f5a" }, lavender: "#7d6b9f", gold: "#d4a94d" }, boxShadow: { soft: "0 8px 28px rgba(37, 98, 91, .09)" } } }, plugins: [] };
export default config;
