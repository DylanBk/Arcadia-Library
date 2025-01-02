/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "bg": "#020B13",
        "grey": "#262626",
        "gold1": "#B4944D",
        "gold2": "#A57A03",
        "barossa": "#400128",
        "offBarossa": "rgba(98, 3, 62, 0.4)"
      },
      screens: {
        "xs": "420px"
      }
    },
  },
  plugins: [],
}

