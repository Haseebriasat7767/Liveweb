import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0C0C0D',
        charcoal: '#17181A',
        graphite: '#2A2B2E',
        stone: '#8A857E',
        mist: '#BDB8B0',
        bone: '#DED9D1',
        ivory: '#F4F1EC',
        paper: '#FBF9F6',
        bronze: '#A47C4F',
        brass: '#C7A578',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.32em',
        wide2: '0.18em',
      },
      maxWidth: {
        shell: '1560px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'scroll-dot': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(1200%)', opacity: '0' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1.12)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'scroll-dot': 'scroll-dot 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'slow-zoom': 'slow-zoom 24s ease-out forwards',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
