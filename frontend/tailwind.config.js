/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "bg": "#010101",
        "grey": "#262626",
        "gold1": "#E6C468",
        "gold2": "#C1A05E",
        "barossa": "#7C2A2F",
        "offBarossa": "#9B3C47"
      },
      screens: {
        "xs": "420px"
      }
    },
  },
  plugins: [],
}

