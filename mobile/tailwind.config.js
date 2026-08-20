/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: { colors: { nexus: { palladian: "#EEE9DF", oatmeal: "#C9C1B1", blue: "#2C3B4D", abyss: "#1B2632", flame: "#FFB162", truffle: "#A35139" } } } },
  plugins: [],
};
