/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SignX Warm Cream & Off-White Design System
        cream: {
          50: '#FFFDF9',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EFE7E0',
          400: '#E5DCD3',
          500: '#D5C9BD',
        },
        // Primary SignX Vibrant Coral / Orange Accent
        coral: {
          50: '#FFF5F0',
          100: '#FEECE5',
          200: '#FDD5C6',
          300: '#FBB79E',
          400: '#F78A65',
          500: '#EB6238', // Primary CTA button & badge color
          600: '#D84E25',
          700: '#B63A17',
          800: '#922F15',
          900: '#772813',
        },
        // Secondary Deep Forest / Emerald Green Accent
        forest: {
          50: '#F0F7F4',
          100: '#DCEDE5',
          200: '#BCDEC0',
          300: '#92C7A9',
          400: '#52A67B',
          500: '#2D7A54',
          600: '#226042',
          700: '#1B4D35', // Primary dark green branding
          800: '#163E2B',
          900: '#113021',
        },
        // Dark Charcoal / Typography
        charcoal: {
          900: '#181C1B',
          800: '#242A28',
          700: '#353D3A',
          600: '#4D5653',
          500: '#697470',
          400: '#8E9995',
          300: '#B8C2BF',
          200: '#DCE2E0',
          100: '#EFF2F1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        handwriting: ['Caveat', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 8px 30px -4px rgba(27, 45, 35, 0.06), 0 4px 12px -2px rgba(27, 45, 35, 0.03)',
        'card-hover': '0 14px 40px -4px rgba(235, 98, 56, 0.12), 0 6px 18px -2px rgba(27, 45, 35, 0.05)',
        'btn': '0 6px 20px -2px rgba(235, 98, 56, 0.35)',
        'btn-forest': '0 6px 20px -2px rgba(27, 77, 53, 0.3)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'float-subtle': 'floatSubtle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
