import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f9f7f4',
          100: '#f3efe8',
          200: '#e6dcc9',
          300: '#d8c8a9',
          400: '#c3a77a',
          500: '#a78953',
          600: '#8d6f3b',
          700: '#71572e',
          800: '#594425',
          900: '#3a2c18',
        },
        ink: '#0b0b0c',
        sand: '#e9e4db',
        bone: '#f5f2ec',
        gold: '#b08d57',
      },
      fontFamily: {
        display: ['var(--font-calsans)', 'ui-sans-serif', 'system-ui'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        luxe: '0 10px 30px -10px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        grain: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 preserveAspectRatio=%27none%27 viewBox=%270 0 400 400%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27400%27 height=%27400%27 filter=%27url(%23n)%27 opacity=%270.05%27/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}

export default config

