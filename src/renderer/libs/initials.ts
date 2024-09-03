export const INIT_STORE: StoreType = {
  systemConfigs: {
    language: '',
    isLoading: false,
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
  resolution: {
    width: 0,
    height: 0
  }
}