import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        background: "#fbfaf7",
        surface: "#ffffff",
        "surface-muted": "#fbfaf7",
        "surface-warm": "#f7f3eb",
        primary: "#0284c7",
        "primary-hover": "#0369a1",
        "primary-soft": "#e7f1f6",
        "primary-subtle": "#fcfaf5",
        "brand-ink": "#172033",
        "brand-line": "#ebe5d9",
      },
    },
  },
  plugins: [],
} satisfies Config;
