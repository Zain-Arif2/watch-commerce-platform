/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        surface: "#FFFFFF",
        primary: "#0B0B0C",
        accent: "#B0915B",
        accentLight: "#C8A45C",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
}