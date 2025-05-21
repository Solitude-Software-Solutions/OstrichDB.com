/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sb-dark': '#121820', // Darker navy background
        'sb-dark-accent': '#1E2A38', // Slightly lighter navy
        'sb-cream': {
          light: '#F5F1E6',
          DEFAULT: '#EAE3D1', // Ostrich color
          dark: '#D8CCAF',
        },
        'sb-amber': {
          light: '#F5A742',
          DEFAULT: '#E08A2C', // DB color
          dark: '#C67620',
        },
        'sb-green': {
          light: '#3ECF8E',
          DEFAULT: '#24B47E',
          dark: '#1A8F62',
        },
        'sb-blue': {
          light: '#6BDEF8',
          DEFAULT: '#3ECEF5',
          dark: '#24A5CC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};