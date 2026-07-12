/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#facc15', // Odoo-like yellow/orange accent
        darkBg: '#1e1e1e',
        darkCard: '#2d2d2d',
      }
    },
  },
  plugins: [],
}
