/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F1115',
        'bg-surface': '#1A1D23',
        'bg-hover': '#20252B',
        'bg-accent': '#14171C',
        'text-primary': '#F0F3F8',
        'text-secondary': '#A6B0C3',
        'text-muted': '#606B7A',
        'buy': '#00C896',
        'buy-bg': 'rgba(0, 200, 150, 0.08)',
        'sell': '#FF5F5F',
        'sell-bg': 'rgba(255, 95, 95, 0.08)',
        'border': '#2C313A',
        'divider': '#3A3F4B',
        'input-bg': '#1F232A',
        'filter-border': '#4A5568',
      },
    },
  },
  plugins: [],
}