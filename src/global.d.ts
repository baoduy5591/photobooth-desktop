declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

interface Window {
  api: {
    getResources: () => Promise;
    getSystemConfigs: () => Promise;
    getResolution: () => Promise;
    getPathFolderAssets: () => Promise;
    getOrderInfoById: (value) => Promise;
  }
}

type TouchEventAndMouseEventType = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

interface ThemeType {
  pink: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
  changeTheme: (key: string) => void;
}


interface PathResourceType {
  name: string;
  relPath: string;
  isNew: boolean;
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

interface AudiosType {
  backgrounds: PathResourceType[],
  touch: PathResourceType[]
}

interface ResourcesType {
  backgroundImages: BackgroundImagesType;
  stickers: StickerType;
  videos: VideosType;
  icons: PathResourceType[];
  audios: AudiosType;
}

interface HardwareInfoType {
  camera: { name: string, serial: string, isOk: boolean };
  network: { ipV4: string; mac: string; monitorIP: string; isOk: boolean };
  screen: { width: number, height: number };
  disk: number;
}

interface SystemConfigsType {
  hardwareInfo: HardwareInfoType;
  defaultLanguage: string;
  backgroundAudio: string;
  touchAudio: string;
  videoIntro: string;
}

interface OrderInfoType {
  frame: string;
}

interface StoreType {
  systemConfigs: SystemConfigsType;
  resources: ResourcesType;
  isLoading: boolean
  pathFolderAssets: string;
  orderInfo: OrderInfoType
}