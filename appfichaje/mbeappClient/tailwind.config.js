/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005360',
        },
        secondary: {
          DEFAULT: '#c9ac7e',
        },
        neutral: {
          DEFAULT: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
