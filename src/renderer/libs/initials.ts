export const INIT_STORE: StoreType = {
  systemConfigs: {
    defaultLanguage: '',
    backgroundAudio: '',
    touchAudio: '',
    warningAudio: '',
    videoIntro: '',
    hardwareInfo: {
      camera: {
        name: '',
        serial: '',
        isOk: false,
      },
      network: {
        ipV4: '',
        mac: '',
        monitorIP: '',
        isOk: false,
      },
      screen: {
        width: null,
        height: null,
      },
      disk: null,
    },
  },
  resources: {
    backgroundImages: [],
    stickers: {
      hot: [],
      birthday: [],
      flowers: [],
      heart: [],
      others: [],
    },
    videos: {
      loading: [],
      introduces: [],
    },
    icons: [],
    audios: {
      backgrounds: [],
      touch: [],
    },
    frames: {
      cutting: {
        typeA: {
          normal: [],
          season: [],
          special: [],
        },
        typeB: {
          normal: [],
          season: [],
          special: [],
        },
        typeC: {
          normal: [],
          season: [],
          special: [],
        },
      },
      regular: {
        typeA: {
          normal: [],
          season: [],
          special: [],
        },
        typeB: {
          normal: [],
          season: [],
          special: [],
        },
        typeC: {
          normal: [],
          season: [],
          special: [],
        },
        typeD: {
          normal: [],
          season: [],
          special: [],
        },
        typeE: {
          normal: [],
          season: [],
          special: [],
        },
        typeF: {
          normal: [],
          season: [],
          special: [],
        },
      },
      wide: {
        typeA: {
          normal: [],
          season: [],
          special: [],
        },
        typeB: {
          normal: [],
          season: [],
          special: [],
        },
      },
    },
  },
  isLoading: false,
  pathFolderAssets: '',
  pathFolderUserPhotos: '',
  orderInfo: {
    frameMode: 'cutting',
    frameType: 'typeC',
    frameStyle: 'season',
    frameOrder: 0,
    quantityShootingPhotos: 4,
    quantitySelectedPhotos: 2,
    frameRelPath: 'frames/cutting/typeC/season/00000.png',
    ratio: 1.5,
    width: 1200,
    height: 1800,
    framePrice: 30000,
    selectedPhotos: [],
    imageSelectPhoto: '',
    imageSelectEffect: '',
    imageFrameSticker: '',
    imageFrameStickerDraw: '',
    videoBase64: '',
    printCount: null,
    colorBase64: '',
    grayscaleBase64: '',
    orderNumber: '',
    effect: {
      name: 'Original',
      className: '',
      style: '',
    },
  },
  shootingMethod: 'countdown',
  shootingTime: 15,
  machineConfigs: {
    platform: '',
  },
};

export const INIT_THEME: ThemeType = {
  pink: 'pink',
};
