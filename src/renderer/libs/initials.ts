export const INIT_STORE: StoreType = {
  systemConfigs: {
    defaultLanguage: '',
    backgroundImageTypeA: '',
    backgroundImageTypeB: '',
    backgroundImageTypeC: '',
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
    backgroundImages: {
      typeA: [],
      typeB: [],
      typeC: []
    },
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
    icons: []
  },
  isLoading: false,
  pathFolderAssets: ''
}

export const INIT_THEME: ThemeType = {
  pink: 'pink',
}