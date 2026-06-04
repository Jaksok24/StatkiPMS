/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eef8ff",
          100: "#d9efff",
          200: "#bce3ff",
          300: "#8fd1ff",
          400: "#5bb7f7",
          500: "#2f97e5",
          600: "#1d79c4",
          700: "#175f9d",
          800: "#184f81",
          900: "#1a436b",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};