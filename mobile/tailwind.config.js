/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nexus: {
          transparentYellow: "#F5EFC6",
          sceptreRed: "#4D0E12",
          ceruleanBlue: "#A5BCD6",
          pottingSoil: "#4A2E27",
          javaBrown: "#231815",
        },
      },
    },
  },
  plugins: [],
};
