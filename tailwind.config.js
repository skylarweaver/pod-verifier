/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'frog-green': '#22c55e',
        'frog-green-dark': '#16a34a',
        'frog-green-light': '#dcfce7',
        'lily-pad': '#84cc16',
        'pond-blue': '#0ea5e9',
        'pond-blue-dark': '#0284c7',
      },
      animation: {
        'hop': 'hop 2s infinite',
      },
      keyframes: {
        hop: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}