/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d97706',
        darkBg: '#121212',
        darkCard: '#1a1a1a',
        wireBorder: '#333333',
        wireText: '#e5e5e5',
        wireMuted: '#a3a3a3',
        statusBlue: '#3b82f6',
        statusGreen: '#22c55e',
        statusRed: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
