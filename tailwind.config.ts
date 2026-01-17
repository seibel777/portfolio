import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#dbdbdb",
          300: "#969696",
          400: "#6e6e6e",
          700: "#363636",
          800: "#2b2b2b",
          900: "#1a1a1a",
          950: "#0d0d0d"
        }
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
        pixel: ["var(--font-pixelify-sans)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
      }
    }
  },
  plugins: []
};

export default config;
