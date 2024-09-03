interface Window {
  api: {
    getResources: () => Promise;
    getSystemConfigs: () => Promise;
  }
}

interface PathResourceType {
  name: string;
  relPath: string;
  isNew: boolean;
}

interface BackgroundImagesType {
  typeA: PathResourceType[];
  typeB: PathResourceType[];
  typeC: PathResourceType[];
}

interface StickerType {
  hot: PathResourceType[];
  birthday: PathResourceType[];
  flowers: PathResourceType[];
  heart: PathResourceType[];
  others: PathResourceType[];
}

interface VideosType {
  loading: PathResourceType[],
  introduces: PathResourceType[]
}

interface ResourcesType {
  backgroundImages: BackgroundImagesType;
  stickers: StickerType;
  videos: VideosType;
}

interface SystemConfigsType {
  language: string;
  isLoading: boolean;
  backgroundImageTypeA: string;
}

interface StoreType {
  systemConfigs: SystemConfigsType;
  resources: ResourcesType;
}