/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'loc-accent': '#D40511',
        'loc-accent-light': '#FFF0F0',
        'loc-accent-mid': '#F5C6C6',
        'vnt-accent': '#FFCC00',
        'vnt-accent-light': '#FFFBE0',
        'vnt-accent-mid': '#FFE066',
        'vnt-accent-text': '#7A5C00',
      },
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
        'mono': ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
