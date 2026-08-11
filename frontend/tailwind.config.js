/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          navy: '#0F172A',
          'navy-light': '#1E293B',
          amber: '#F59E0B',
          'amber-light': '#FBBF24',
          cyan: '#00A8B5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
