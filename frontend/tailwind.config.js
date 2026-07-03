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
      keyframes: {
        'blob-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.05)' },
        },
        'blob-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-25px, 15px) scale(1.08)' },
        },
        'watch-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        scroll: {
          '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(6px)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'blob-1': 'blob-1 8s ease-in-out infinite',
        'blob-2': 'blob-2 10s ease-in-out infinite',
        'watch-bob': 'watch-bob 4s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        wobble: 'wobble 6s ease-in-out infinite',
        scroll: 'scroll 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'fade-in-down': 'fade-in-down 0.18s ease-out',
      },
    },
  },
  plugins: [],
}
