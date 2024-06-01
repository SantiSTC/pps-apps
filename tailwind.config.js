/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: "#1A4F63",
        customCian: "#068587",
        customGreen: "#6FB07F",
        customYellow: "#FCB03C",
        customRed: "#FC5B3F",
      }
    },
  },
  plugins: [],
}
