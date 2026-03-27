/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        'rose-accent': 'var(--color-rose)',
        'purple-accent': 'var(--color-purple)',
        gold: 'var(--color-gold)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        sans: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
