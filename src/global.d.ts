interface Window {
  api: {
    getPathResources: () => Promise;
  }
}

type BackgroundImagesType = string[];
interface StickerType {
  hot: string[];
  birthday: string[];
  flowers: string[];
  others: string[];
}

interface ResourcesType {
  backgroundImages: BackgroundImagesType;
  stickers: StickerType;
}

interface StoreType {
  resources: ResourcesType;
}