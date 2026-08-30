/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        craft: {
          50: '#fffaf5',
          100: '#fef3e7',
          200: '#fce4c8',
          300: '#facfa0',
          400: '#f6ab5c',
          500: '#f28e2b',
          600: '#d96c16',
          700: '#b44e13',
          800: '#903e17',
          900: '#753517',
          950: '#401809'
        },
        terracotta: {
          DEFAULT: '#C85A32',
          light: '#E27B54',
          dark: '#9F3E1B'
        },
        indigoCraft: {
          DEFAULT: '#1E2B4D',
          light: '#2E3F6E',
          dark: '#11182B'
        },
        sand: {
          DEFAULT: '#F5EFEB',
          light: '#FAF7F5',
          dark: '#E2D9D2'
        },
        darkBg: {
          DEFAULT: '#0B0F17',
          card: '#131B2A',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(200, 90, 50, 0.15)'
        }
      },
      fontFamily: {
        heading: ['"Syne"', '"Outfit"', 'sans-serif'],
        display: ['"Syne"', '"Outfit"', '"Cinzel"', 'sans-serif'],
        luxury: ['"Syne"', '"Outfit"', 'sans-serif'],
        serif: ['"Syne"', '"Outfit"', 'sans-serif'],
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
