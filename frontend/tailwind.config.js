/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Colors
        "primary": "#2f5c9b",
        "primary-container": "#4b75b6",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#a9c8ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#fefcff",
        "on-primary-fixed": "#001b3d",
        "on-primary-fixed-variant": "#124684",

        // Secondary Colors
        "secondary": "#186c37",
        "secondary-container": "#a0f2af",
        "secondary-fixed": "#a3f5b2",
        "secondary-fixed-dim": "#87d898",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#1e713b",
        "on-secondary-fixed": "#00210b",
        "on-secondary-fixed-variant": "#005225",

        // Tertiary Colors
        "tertiary": "#775700",
        "tertiary-container": "#966e00",
        "tertiary-fixed": "#ffdea2",
        "tertiary-fixed-dim": "#f6be3c",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed": "#261900",
        "on-tertiary-fixed-variant": "#5c4200",

        // Error Colors
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Surface Colors
        "surface": "#faf8ff",
        "surface-container": "#ededf7",
        "surface-container-low": "#f2f3fd",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e7e7f1",
        "surface-container-highest": "#e1e2ec",
        "surface-dim": "#d9d9e3",
        "surface-bright": "#faf8ff",

        // Text Colors
        "on-surface": "#191b22",
        "on-surface-variant": "#414751",
        "on-background": "#191b22",
        "outline": "#717783",
        "outline-variant": "#c1c7d3",

        // Semantic
        "background": "#faf8ff",
        "inverse-surface": "#2e3038",
        "inverse-on-surface": "#f0f0fa",
        "inverse-primary": "#a9c8ff",
        "surface-tint": "#325f9e",
      },
      fontFamily: {
        "sans": ["Lexend", "sans-serif"],
        "headline": ["Lexend", "sans-serif"],
        "body": ["Lexend", "sans-serif"],
        "label": ["Lexend", "sans-serif"],
        "material-symbols": ["Material Symbols Outlined", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(25, 27, 34, 0.06)",
        "elevation-high": "0 10px 30px rgba(0, 0, 0, 0.1)",
        "floating": "0 20px 50px rgba(47, 92, 155, 0.1)",
        "glass": "0 20px 50px rgba(47, 92, 155, 0.1)",
      },
      backdropBlur: {
        "glass": "20px",
      },
    },
  },
  plugins: [],
}
