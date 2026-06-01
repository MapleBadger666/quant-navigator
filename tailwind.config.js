/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          950: '#050816',
          900: '#08111f',
          800: '#0d1b2d',
          700: '#14263c',
          500: '#1f7a8c',
          accent: '#35f2c4',
          gold: '#f8c14a',
        },
      },
      boxShadow: {
        terminal: '0 18px 50px rgba(0, 0, 0, 0.35)',
        glow: '0 0 0 1px rgba(53, 242, 196, 0.16), 0 18px 55px rgba(53, 242, 196, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
