/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      filter: {
        orange: 'brightness(120%) saturate(180%) sepia(20%)',
        yellow: 'brightness(130%) saturate(150%) sepia(10%)',
        blue: 'brightness(110%) saturate(160%) hue-rotate(200deg)',
        pink: 'brightness(120%) saturate(170%) hue-rotate(330deg)',
        green: 'brightness(115%) saturate(140%) hue-rotate(90deg)',
        'sunny-yellow': 'brightness(140%) saturate(150%) sepia(5%)',
        dynamic: 'brightness(125%) saturate(180%) hue-rotate(50deg)',
        'orange-yellow': 'brightness(130%) saturate(170%) sepia(30%)',
        aqua: 'brightness(120%) saturate(160%) hue-rotate(190deg)',
        lavender: 'brightness(110%) saturate(150%) hue-rotate(270deg)',
        'light-pink': 'brightness(125%) saturate(180%) hue-rotate(330deg)',
        red: 'brightness(110%) saturate(160%) hue-rotate(15deg)',
        'light-yellow': 'brightness(135%) saturate(140%) sepia(15%)',
        'earth-tone': 'brightness(120%) saturate(130%) sepia(25%)',
        'dark-blue': 'brightness(110%) saturate(160%) hue-rotate(210deg)',
        'black-white': 'brightness(110%) grayscale(100%)',
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
          'style-3-1': 'var(--picker-color-style-3-1)',
          'style-3-2': 'var(--picker-color-style-3-2)',
          'style-4-1': 'var(--picker-color-style-4-1)',
          'style-4-2': 'var(--picker-color-style-4-2)',
          'style-5-1': 'var(--picker-color-style-5-1)',
          'style-5-2': 'var(--picker-color-style-5-2)',
          'style-5-3': 'var(--picker-color-style-5-3)',
          'style-6-1': 'var(--picker-color-style-6-1)',
        },
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px',
        7: '7px',
        8: '8px',
        9: '9px',
        10: '10px',
        11: '11px',
        12: '12px',
        13: '13px',
        14: '14px',
        15: '15px',
      },
    },
  },
  plugins: [require('tailwindcss-filters')],
};
