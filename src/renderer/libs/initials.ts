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
    },
    icons: []
  },
  isLoading: false,
  pathFolderAssets: ''
}

export const INIT_THEME: ThemeType = {
  pink: 'pink',
}