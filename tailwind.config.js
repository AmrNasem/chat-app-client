/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,tsx,js,ts}", "./index.html"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
    extend: {
      colors: {
        gradient: "linear-gradient(45deg, #6c49ed, #b646ff)",
        "main-from": "#6c49ed",
        "main-to": "#b646ff",
        "text-main": "#31323b",
        "text-sec": "#b3b5ba",
        aside: "#f9fbfc",
        "other-message": "#e7eff7",
      },
    },
  },
  plugins: [],
};
