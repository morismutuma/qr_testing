/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: '#f8f5ff',
          100: '#f0ebff',
          200: '#e1d7ff',
          300: '#c9b8ff',
          400: '#ad95ff',
          500: '#9370ff',
          600: '#7d4fff',
          700: '#6b3fff',
          800: '#5a33cc',
          900: '#4a2a99',
        },
      },
    },
  },
  plugins: [],
}
