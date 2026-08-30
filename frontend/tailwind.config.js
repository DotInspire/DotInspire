/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#F3C649',
          500: '#E5B80B',
          600: '#D4AF37',
          700: '#B38F20',
        },
        charcoal: {
          800: '#1C1C1E',
          900: '#121212',
          950: '#0A0A0B',
        },
      },
      fontFamily: {
        serif: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'slow-zoom': 'zoom 15s ease-out infinite alternate',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        zoom: {
          '0%': { transform: 'scale(1.0)' },
          '100%': { transform: 'scale(1.06)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
