/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Verde salvia — color principal de la marca
        sage: {
          50: '#f3f5f1',
          100: '#e3e8dd',
          200: '#c8d2bd',
          300: '#a7b698',
          400: '#879978',
          500: '#6c805d',
          600: '#556649',
          700: '#44523c',
          800: '#384333',
          900: '#2f3a2c',
          950: '#181f17',
        },
        // Terracota / melocotón — acento cálido
        clay: {
          50: '#fdf7f2',
          100: '#fbece0',
          200: '#f5d5bd',
          300: '#edb792',
          400: '#e49262',
          500: '#dc7740',
          600: '#cd5f34',
          700: '#a94a2d',
          800: '#883d2a',
          900: '#6f3424',
        },
        // Beige crema — fondo principal
        cream: {
          50: '#fdfbf6',
          100: '#f8f3e7',
          200: '#f1e8d2',
          300: '#e7d7b1',
          400: '#dbc28a',
          500: '#cca866',
        },
        // Marrón profundo — texto principal
        bark: {
          400: '#5c4d3f',
          500: '#3d3127',
          600: '#2d2520',
          700: '#1f1a16',
          800: '#15110e',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      backgroundImage: {
        // Patrón sutil de puntos para fondos texturizados
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.18 0 0 0 0 0.14 0 0 0 0 0.10 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
