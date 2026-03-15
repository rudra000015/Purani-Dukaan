import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  // Matches ThemeSync: root.classList.toggle('dark', theme === 'dark')
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Nunito', 'sans-serif'],
        display: ['Baloo 2', 'cursive'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: { DEFAULT: '#8d5524', light: '#b87333', dark: '#6b3f1a' },
        eco:     { DEFAULT: '#0c831f', light: '#e8f5e9' },
      },
      borderRadius: {
        '2xl': '16px', '3xl': '24px', '4xl': '32px',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover':'0 10px 40px rgba(0,0,0,0.10)',
        glow:        '0 0 0 3px rgba(141,85,36,0.15)',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'bounce-soft':'bounce-soft 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:        { from:{ opacity:'0', transform:'translateY(16px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        scaleIn:       { from:{ opacity:'0', transform:'scale(0.92)' },      to:{ opacity:'1', transform:'scale(1)' } },
        'bounce-soft': { '0%,100%':{ transform:'translateY(0)' },    '50%':{ transform:'translateY(-4px)' } },
        float:         { '0%,100%':{ transform:'translateY(0px) rotate(0deg)' }, '33%':{ transform:'translateY(-8px) rotate(1deg)' }, '66%':{ transform:'translateY(-4px) rotate(-1deg)' } },
      },
    },
  },
  plugins: [],
};

export default config;