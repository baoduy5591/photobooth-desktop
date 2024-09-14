/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      filter: {
        'cool': 'brightness(1.1) contrast(1.1) sepia(0.3) hue-rotate(220deg)',
        'warm': 'brightness(1.1) contrast(1.1) sepia(0.5) hue-rotate(30deg)',
        'hot': 'brightness(1.2) contrast(1.2) sepia(0.7) hue-rotate(15deg)',
        'bright': 'brightness(1.5) contrast(1.2)',
        'very-bright': 'brightness(2) contrast(1.3)',
        'black-white': 'grayscale(100%) contrast(1.2)',
      },
      textColor: {
        custom: {
          'style-1': 'var(--picker-color-style-1)',
          'style-3-1': 'var(--picker-color-style-3-1)',
          'style-5-3': 'var(--picker-color-style-5-3)',
        },
      },
      backgroundColor: {
        custom: {
          'style-1': 'var(--picker-color-style-1)',
          'style-2-1': 'var(--picker-color-style-2-1)',
          'style-3-1': 'var(--picker-color-style-3-1)',
          'style-3-2': 'var(--picker-color-style-3-2)',
          'style-3-3': 'var(--picker-color-style-3-3)',
          'style-4-1': 'var(--picker-color-style-4-1)',
          'style-5-1': 'var(--picker-color-style-5-1)',
          'style-5-3': 'var(--picker-color-style-5-3)',
          'style-6-1': 'var(--picker-color-style-6-1)',
          'style-7-1': 'var(--picker-color-style-7-1)',
          'style-8-1': 'var(--picker-color-style-8-1)',
          'style-9-1': 'var(--picker-color-style-9-1)',
        },
      },
      fontFamily: {
        rokkitt: 'Rokkitt',
        moreSugar: 'MoreSugar',
        baloo: 'Baloo',
        mochiyPopOne: 'MochiyPopOne',
      },
      colors: {
        custom: {
          'style-1': 'var(--picker-color-style-1)',
          'style-2-1': 'var(--picker-color-style-2-1)',
          'style-2-2': 'var(--picker-color-style-2-2)',
          'style-4-1': 'var(--picker-color-style-4-1)',
          'style-4-2': 'var(--picker-color-style-4-2)',
          'style-5-1': 'var(--picker-color-style-5-1)',
          'style-5-2': 'var(--picker-color-style-5-2)',
          'style-5-3': 'var(--picker-color-style-5-3)',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-filters'),
  ],
};
