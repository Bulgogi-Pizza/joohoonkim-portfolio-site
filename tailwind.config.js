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
    // 브레이크포인트마다 max-width가 계단식으로 바뀌면 창 크기 조절 시 레이아웃이 튀므로, 1536px까지는 폭을 그대로 따라가게 한다
    container: {
      screens: { '2xl': '1536px' },
    },
    extend: {
      // 창 폭에 비례해 연속으로 변하는 값 (기존 브레이크포인트 값 사이를 선형 보간)
      spacing: {
        gutter: 'clamp(1.5rem, 4vw, 3rem)',
        'nav-gap': 'clamp(1.25rem, calc(4.69vw - 1.75rem), 2rem)',
      },
      fontSize: {
        hero: ['clamp(2.25rem, calc(0.75rem + 3.75vw), 3.75rem)', { lineHeight: '1.05' }],
        'page-title': ['clamp(1.875rem, calc(1.25rem + 1.5625vw), 2.25rem)', { lineHeight: '1.15' }],
        'section-title': ['clamp(1.5rem, calc(0.875rem + 1.5625vw), 1.875rem)', { lineHeight: '1.25' }],
        nav: ['clamp(13px, calc(8px + 0.5vw), 14px)', { lineHeight: '1.25rem' }],
      },
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
