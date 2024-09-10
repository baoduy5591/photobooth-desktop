export const INIT_STORE: StoreType = {
  systemConfigs: {
    defaultLanguage: '',
    backgroundAudio: '',
    touchAudio: '',
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
        height: null
      },
      disk: null

    }
  },
  resources: {
    backgroundImages: [],
    stickers: {
      hot: [],
      birthday: [],
      flowers: [],
      heart: [],
      others: []
    },
    videos: {
      loading: [],
      introduces: []
    },
    icons: [],
    audios: {
      backgrounds: [],
      touch: []
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
        }
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
        }
      }
    }
  },
  isLoading: false,
  pathFolderAssets: '',
  pathFolderUserPhotos: '',
  orderInfo: {
    modeFrame: '',
    typeFrame: '',
    quantityImages: null,
    frame: '',
    
  },
  shootingMethod: '',
  machineConfigs: {
    platform: ''
  }
}

export const INIT_THEME: ThemeType = {
  pink: 'pink',
}