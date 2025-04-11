/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9FBF',
          dark: '#E57FAB',
        },
        secondary: {
          DEFAULT: '#A9DCAD',
          dark: '#7BC77F',
        },
        text: '#333333',
        background: '#FFF7F9',
        card: '#FFFFFF',
      },
    },
    fontFamily: {
      sans: ['Noto Sans SC', 'sans-serif'],
      serif: ['Noto Serif SC', 'serif'],
    },
  },
  plugins: [],
}