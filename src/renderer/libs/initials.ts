export const INIT_STORE: StoreType = {
  systemConfigs: {
    language: '',
    backgroundImageTypeA: '00100.png',
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
    }
  },
  isLoading: false,
  resolution: {
    width: 0,
    height: 0
  },
  pathFolderAssets: ''
}