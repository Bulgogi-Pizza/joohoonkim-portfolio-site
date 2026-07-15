/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      colors: {
        paper: '#ffffff',
        card: '#ffffff',
        ink: {
          DEFAULT: '#16181d',
          2: '#4b5261',
          3: '#6b7280',
        },
        line: '#e8e9e4',
        accent: '#1d4ed8',
        dark: {
          bg: '#0b0d12',
          card: '#12151c',
          ink: {
            DEFAULT: '#e8eaf0',
            2: '#9aa3b3',
            3: '#7d8598',
          },
          line: 'rgba(255,255,255,.08)',
          accent: '#6b8cff',
        },
      },
      boxShadow: {
        elev: '0 1px 2px rgba(22,24,29,.05), 0 4px 12px rgba(22,24,29,.06)',
        'elev-hover': '0 2px 4px rgba(22,24,29,.05), 0 16px 32px rgba(22,24,29,.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
