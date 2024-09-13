/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
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
  plugins: [],
};
