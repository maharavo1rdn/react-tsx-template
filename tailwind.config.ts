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
        "surface-muted": "#f8fafc",
        "surface-warm": "#f6f4ef",
        primary: "#0ea5e9",
        "primary-hover": "#0284c7",
        "primary-soft": "#e0f2fe",
        "primary-subtle": "#f0f9ff",
      },
    },
  },
  plugins: [],
} satisfies Config;
