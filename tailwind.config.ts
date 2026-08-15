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
        "surface-muted": "#f7f4ee",
        "surface-warm": "#f1ecdf",
        primary: "#0284c7",
        "primary-hover": "#0369a1",
        "primary-soft": "#e7f1f6",
        "primary-subtle": "#f8f5ee",
        "brand-ink": "#172033",
        "brand-line": "#dfd8c9",
      },
    },
  },
  plugins: [],
} satisfies Config;
