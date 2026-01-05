/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend: ['Lexend', 'sans-serif'],
      },
      colors: {
        main: {
          DEFAULT: '#005C7B', // Deep teal from Yescapa
          dark: '#004A63',
          light: '#007A9F',
        },
        primary: {
          DEFAULT: '#D92662', // Hot Pink
          dark: '#B01E4E',
          light: '#E8457D',
        },
        bgLight: {
          DEFAULT: '#F7F9FA', // Very light blue-gray
        },
        secondary: {
          DEFAULT: '#FFC400', // Yellow accent
        },
        onMain: {
          DEFAULT: '#007A9F',
          dark: '#005C7B',
        },
      },
    },
  },
  plugins: [],
}

