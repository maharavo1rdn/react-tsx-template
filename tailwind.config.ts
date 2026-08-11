import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        accent: {
          light: "#e0f2fe",
          DEFAULT: "#0ea5e9",
          dark: "#0284c7",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          subtle: "#f1f5f9",
        },
        border: {
          DEFAULT: "#e2e8f0",
          light: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;