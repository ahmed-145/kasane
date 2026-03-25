import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F3',
        'background-dark': '#1A1814',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        accent: '#8B7355',
        border: '#E8E0D4',
        surface: '#F2EDE4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif JP', 'Georgia', 'serif'],
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
};

export default config;
