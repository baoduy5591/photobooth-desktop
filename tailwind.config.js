/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: 'var(--picker-color-text-base)',
        },
      },
      backgroundColor: {
        skin: {
          'fill-button': 'var(--picker-color-fill-button)',
          'fill-button-muted': 'var(--picker-color-fill-button-muted)',
        },
      },
      fontFamily: {
        rokkitt: 'Rokkitt',
        moreSugar: 'MoreSugar',
        baloo: 'Baloo',
        mochiyPopOne: 'MochiyPopOne',
      },
      colors: {
        'custom-pink': 'var(--picker-color-fill-button)',
      },
    },
  },
  plugins: [],
};
