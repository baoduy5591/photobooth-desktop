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
    }
  },
  isLoading: false,
  pathFolderAssets: '',
  orderInfo: {
    frame: ''
  },
  shootingMethod: ''
}

export const INIT_THEME: ThemeType = {
  pink: 'pink',
}