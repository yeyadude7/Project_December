/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    
    extend: {
      borderWidth: {
        '1': '1px',
      },
      colors: {
        "highlight": "#3d73c9"
      }
    },
  },
  plugins: [],
}