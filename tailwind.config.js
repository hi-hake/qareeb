/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        panel2: 'var(--panel2)',
        line: 'var(--line)',
        txt: 'var(--txt)',
        dim: 'var(--dim)',
        cardtop: 'var(--card-top)',
        teal: '#2ACFEA',
        tealdeep: '#1797B3',
        orange: '#FF7A3C',
        best: '#2ED37C',
      },
      fontFamily: {
        disp: ['Space Grotesk', 'IBM Plex Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
