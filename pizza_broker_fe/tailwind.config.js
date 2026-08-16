/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        crust: {
          50: "#fdf6ee",
          100: "#faead6",
          200: "#f3d2ac",
          300: "#eab378",
          400: "#df8c46",
          500: "#d16f27",
          600: "#b6551d",
          700: "#953f1b",
          800: "#79341c",
          900: "#642c1a",
          950: "#3a1a0f",
        },
        tomato: {
          50: "#fef2f1",
          100: "#fde3e0",
          200: "#fbcbc6",
          300: "#f7a89f",
          400: "#f0796b",
          500: "#e5503d",
          600: "#d1391f",
          700: "#af2e1a",
          800: "#8f2a1a",
          900: "#77281b",
          950: "#4a1a12",
        },
        basil: {
          50: "#f1f9ee",
          100: "#e0f2d9",
          200: "#c2e4b6",
          300: "#98cf85",
          400: "#6fb75c",
          500: "#4f9c3d",
          600: "#3c7d2f",
          700: "#316328",
          800: "#2a4f24",
          900: "#244320",
        },
      },
      fontFamily: {
        display: ["'Fredoka'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: 0, transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
          "40%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        "pop-in": "pop-in 0.22s ease-out",
        "bounce-dot": "bounce-dot 1.2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
