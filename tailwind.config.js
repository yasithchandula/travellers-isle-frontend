/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Product Sans", "Inter", "sans-serif"],
        product: ["Product Sans", "sans-serif"],
        sans_bold: ["Product Sans Bold"]
      },
      colors: {
        ti: {
          teal: "#3A7E75",
          mint: "#A7D3C4",
          sand: "#F6EFE7",
          forest: "#243F40",
          sky: "#E3F5F1",
          red: "#E97171",
          darkmint: "#7BBCA8",
          mist: "#F4F6F7",
          clay: "#D9CFC4"
        },
      },
    },
  },
  plugins: [],
}

