export const CONST_CONFIG_LANGUAGE: { en: number; vi: number; ja: number } = {
  en: 0,
  ja: 1,
  vi: 2,
};

export const CONST_CONFIG_FONTS: { en: string; ja: string; vi: string } = {
  en: 'MoreSugar',
  ja: 'MochiyPopOne',
  vi: 'Baloo',
};

export const CONST_ERROR = '#ERROR#';
export const CONST_PICTURE_TIME = 'PICTURE TIME';

export const CONST_MODE_CUTTING = 'cutting';
export const CONST_MODE_REGULAR = 'regular';
export const CONST_MODE_WIDE = 'wide';

export const CONST_TYPE_FRAMES_FOR_DOUBLE: string[] = ['typeC', 'typeD', 'typeE', 'typeF'];

export const CONST_COUNTDOWN_METHOD = 'countdown';
export const CONST_REMOTE_METHOD = 'remote';

export const CONST_WINDOW_OS = 'win32';
export const CONST_DARWIN_OS = 'darwin';

export const CONST_MOCK_DATA_FRAME = {
  modeFrame: 'cutting',
  typeFrame: 'typeA',
  quantityImages: 6,
  quantitySelectedImages: 4,
  width: 1200,
  height: 1800,
  frame: 'frames/cutting/typeA/normal/00000.png',
  ratio: 1.5,
};

export const CONST_FRAME_POSITIONS: FramePositionType = {
  cutting: {
    typeA: [
      [
        { x: 41, y: 50, w: 541, h: 363 },
        { x: 619, y: 50, w: 541, h: 363 },
      ],
      [
        { x: 41, y: 430, w: 541, h: 363 },
        { x: 619, y: 430, w: 541, h: 363 },
      ],
      [
        { x: 41, y: 810, w: 541, h: 363 },
        { x: 619, y: 810, w: 541, h: 363 },
      ],
      [
        { x: 41, y: 1190, w: 541, h: 363 },
        { x: 619, y: 1190, w: 541, h: 363 },
      ],
    ],
    typeB: [
      [
        { x: 41, y: 50, w: 541, h: 541 },
        { x: 619, y: 50, w: 541, h: 541 },
      ],
      [
        { x: 41, y: 608, w: 541, h: 541 },
        { x: 619, y: 608, w: 541, h: 541 },
      ],
      [
        { x: 41, y: 1166, w: 541, h: 541 },
        { x: 619, y: 1166, w: 541, h: 541 },
      ],
    ],
    typeC: [
      [
        { x: 41, y: 50, w: 541, h: 727 },
        { x: 619, y: 50, w: 541, h: 727 },
      ],
      [
        { x: 41, y: 797, w: 541, h: 727 },
        { x: 619, y: 797, w: 541, h: 727 },
      ],
    ],
  },

  regular: {
    typeA: [
      [{ x: 41, y: 50, w: 551, h: 763 }],
      [{ x: 609, y: 50, w: 551, h: 763 }],
      [{ x: 41, y: 833, w: 551, h: 763 }],
      [{ x: 609, y: 833, w: 551, h: 763 }],
    ],
    typeB: [
      [{ x: 65, y: 130, w: 535, h: 528 }],
      [{ x: 617, y: 123, w: 535, h: 528 }],
      [{ x: 50, y: 678, w: 535, h: 528 }],
      [{ x: 601, y: 669, w: 536, h: 528 }],
      [{ x: 58, y: 1223, w: 535, h: 528 }],
      [{ x: 609, y: 1213, w: 536, h: 528 }],
    ],
    typeC: [
      [{ x: 52, y: 45, w: 552, h: 779 }],
      [{ x: 624, y: 45, w: 552, h: 779 }],
      [{ x: 1196, y: 45, w: 552, h: 779 }],
    ],
    typeD: [
      [{ x: 43, y: 53, w: 548, h: 750 }],
      [{ x: 610, y: 225, w: 548, h: 750 }],
      [{ x: 43, y: 825, w: 548, h: 750 }],
      [{ x: 610, y: 997, w: 548, h: 750 }],
    ],
    typeE: [
      [{ x: 51, y: 43, w: 554, h: 431 }],
      [{ x: 623, y: 43, w: 554, h: 431 }],
      [{ x: 1195, y: 43, w: 554, h: 431 }],
      [{ x: 51, y: 496, w: 554, h: 431 }],
      [{ x: 623, y: 496, w: 554, h: 431 }],
      [{ x: 1195, y: 496, w: 554, h: 431 }],
    ],
    typeF: [
      [{ x: 51, y: 43, w: 504, h: 358 }],
      [{ x: 573, y: 43, w: 504, h: 358 }],
      [{ x: 1095, y: 43, w: 504, h: 358 }],
      [{ x: 51, y: 420, w: 504, h: 358 }],
      [{ x: 1095, y: 420, w: 504, h: 358 }],
      [{ x: 51, y: 798, w: 504, h: 358 }],
      [{ x: 573, y: 798, w: 504, h: 358 }],
      [{ x: 1095, y: 798, w: 504, h: 358 }],
    ],
  },

  wide: {
    typeA: [
      [{ x: 41, y: 50, w: 553, h: 392 }],
      [{ x: 607, y: 50, w: 553, h: 392 }],
      [{ x: 41, y: 461, w: 553, h: 392 }],
      [{ x: 607, y: 461, w: 553, h: 392 }],
      [{ x: 41, y: 871, w: 553, h: 392 }],
      [{ x: 607, y: 871, w: 553, h: 392 }],
      [{ x: 41, y: 1281, w: 553, h: 392 }],
      [{ x: 607, y: 1281, w: 553, h: 392 }],
    ],
    typeB: [
      [{ x: 41, y: 50, w: 553, h: 540 }],
      [{ x: 607, y: 50, w: 553, h: 540 }],
      [{ x: 41, y: 608, w: 553, h: 540 }],
      [{ x: 607, y: 608, w: 553, h: 540 }],
      [{ x: 41, y: 1166, w: 553, h: 540 }],
      [{ x: 607, y: 1166, w: 553, h: 540 }],
    ],
  },
};

export const CONST_LIST_EFFECTS = [
  {
    name: 'Orange',
    className: 'filter-orange',
    style: 'brightness(120%) saturate(180%) sepia(20%)',
  },
  {
    name: 'Original',
    className: '',
    style: 'none',
  },
  {
    name: 'Yellow',
    className: 'filter-yellow',
    style: 'brightness(130%) saturate(150%) sepia(10%)',
  },
  {
    name: 'Blue',
    className: 'filter-blue',
    style: 'brightness(110%) saturate(160%) hue-rotate(200deg)',
  },
  {
    name: 'Pink',
    className: 'filter-pink',
    style: 'brightness(120%) saturate(170%) hue-rotate(330deg)',
  },

  {
    name: 'Black & White',
    className: 'filter-black-white',
    style: 'brightness(110%) grayscale(100%)',
  },
  {
    name: 'Green',
    className: 'filter-green',
    style: 'brightness(115%) saturate(140%) hue-rotate(90deg)',
  },
  {
    name: 'Sunny & Yellow',
    className: 'filter-sunny-yellow',
    style: 'brightness(140%) saturate(150%) sepia(5%)',
  },
  {
    name: 'Dynamic',
    className: 'filter-dynamic',
    style: 'brightness(125%) saturate(180%) hue-rotate(50deg)',
  },
  {
    name: 'Orange & Yellow',
    className: 'filter-orange-yellow',
    style: 'brightness(130%) saturate(170%) sepia(30%)',
  },
  {
    name: 'Aqua',
    className: 'filter-aqua',
    style: 'brightness(120%) saturate(160%) hue-rotate(190deg)',
  },
  {
    name: 'Lavender',
    className: 'filter-lavender',
    style: 'brightness(110%) saturate(150%) hue-rotate(270deg)',
  },
  {
    name: 'Light & Pink',
    className: 'filter-light-pink',
    style: 'brightness(125%) saturate(180%) hue-rotate(330deg)',
  },
  {
    name: 'Red',
    className: 'filter-red',
    style: 'brightness(110%) saturate(160%) hue-rotate(15deg)',
  },
  {
    name: 'Light & Yellow',
    className: 'filter-light-yellow',
    style: 'brightness(135%) saturate(140%) sepia(15%)',
  },
  {
    name: 'Earth & Tone',
    className: 'filter-earth-tone',
    style: 'brightness(120%) saturate(130%) sepia(25%)',
  },
  {
    name: 'Dark & Blue',
    className: 'filter-dark-blue',
    style: 'brightness(110%) saturate(160%) hue-rotate(210deg)',
  },
];

export const CONST_LIST_TAB_STICKER: string[] = ['Hot', 'Birthday', 'Flowers', 'Heart', 'Others'];

export const CONST_THRESHOLD = 10;

export const CONST_RATIO_SCALE = 10;

export const CONST_SCALE_PHOTOS = 2.8;

export const COLORS: string[] = [
  '#ff909d',
  '#1e1e1e',
  '#e7191f',
  '#ffa629',
  '#14ae5c',
  '#9747ff',
  '#0d99ff',
  '#00f4cb',
  '#61a0e8',
  '#aaef57',
  '#d25165',
  '#e47586',
  '#eeebfb',
  '#f6f0e0',
  '#f8f6f7',
  '#fee37a',
  '#fdfdc6',
  '#ffb200',
  '#ffffff',
];

export const keyDraw: {
  thin: string;
  medium: string;
  thick: string;
  erase: string;
  cursor: string;
  pickColor: string;
  pickLineWidth: string;
} = {
  thin: 'thin',
  medium: 'medium',
  thick: 'thick',
  erase: 'erase',
  cursor: 'cursor',
  pickColor: 'pickColor',
  pickLineWidth: 'pickLineWidth',
};
