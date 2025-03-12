import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-grass-primary',
    'bg-grass-primary-light',
    'bg-grass-primary-dark',
    'bg-grass-accent',
    'bg-grass-bg',
    'bg-grass-bg-light',
    'hover:bg-grass-primary-light',
    'hover:text-grass-accent',
    'border-grass-primary',
    'text-grass-primary',
    'text-grass-accent',
  ],
  theme: {
    extend: {
      colors: {
        grass: {
          primary: '#1B5E20',
          'primary-light': '#2E7D32',
          'primary-dark': '#1B4E1B',
          accent: '#00FF00',
          bg: '#000000',
          'bg-light': '#121212',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 255, 0, 0.1), 0 2px 4px -1px rgba(0, 255, 0, 0.06)',
        'glow': '0 0 15px rgba(0, 255, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config 