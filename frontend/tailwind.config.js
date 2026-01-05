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
          DEFAULT: '#054d6c', // Dark blue - main color
          dark: '#033a52',
          light: '#0c6a93',
        },
        primary: {
          DEFAULT: '#d92465', // Pink/magenta - primary buttons
          dark: '#b81d54',
          light: '#e6397a',
        },
        bgLight: {
          DEFAULT: '#f1f5f9', // Light gray - background
        },
        secondary: {
          DEFAULT: '#f1f5f9', // Light gray - secondary buttons
          dark: '#e2e8f0',
        },
        onMain: {
          DEFAULT: '#0c6a93', // Lighter blue - buttons on main background
          dark: '#054d6c',
          light: '#1a7ba8',
        },
        
      },
    },
  },
  plugins: [],
}

