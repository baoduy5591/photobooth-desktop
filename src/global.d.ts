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
    getPathFolderUserPhotos: () => Promise;
    getOrderInfoById: (value) => Promise;
    getMachineConfigs: () => Promise;
    getUserResizedPhotos: () => Promise;
    saveImage: (data: { imageBase64: string; modeFrame: string }) => Promise;
  };
}

type TouchEventAndMouseEventType = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

interface ThemeType {
  pink: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  changeTheme: (key: string) => void;
}

interface PathResourceType {
  name: string;
  relPath: string;
  isNew: boolean;
  thumb: string;
}

interface StickerType {
  hot: PathResourceType[];
  birthday: PathResourceType[];
  flowers: PathResourceType[];
  heart: PathResourceType[];
  others: PathResourceType[];
}

interface VideosType {
  loading: PathResourceType[];
  introduces: PathResourceType[];
}

interface AudiosType {
  backgrounds: PathResourceType[];
  touch: PathResourceType[];
}

interface ResourcesType {
  backgroundImages: BackgroundImagesType;
  stickers: StickerType;
  videos: VideosType;
  icons: PathResourceType[];
  audios: AudiosType;
  frames: {
    cutting: {
      typeA: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeB: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeC: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
    };
    regular: {
      typeA: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeB: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeC: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeD: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeE: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeF: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
    };
    wide: {
      typeA: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
      typeB: {
        normal: PathResourceType[];
        season: PathResourceType[];
        special: PathResourceType[];
      };
    };
  };
}

interface HardwareInfoType {
  camera: { name: string; serial: string; isOk: boolean };
  network: { ipV4: string; mac: string; monitorIP: string; isOk: boolean };
  screen: { width: number; height: number };
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
  modeFrame: string;
  typeFrame: string;
  quantityImages: number;
  frame: string;
  selectedPhotos: string[];
  imageSelectPhoto: string;
  imageSelectEffect: string;
  imageSelectSticker: string
  effect: {
    name: string;
    className: string;
    style: string;
  }
}

interface MachineConfigsType {
  platform: string;
}

interface StoreType {
  systemConfigs: SystemConfigsType;
  resources: ResourcesType;
  isLoading: boolean;
  pathFolderAssets: string;
  pathFolderUserPhotos: string;
  orderInfo: OrderInfoType;
  shootingMethod: string;
  machineConfigs: MachineConfigsType;
}

interface PositionFramesType {
  cutting: {
    typeA: { x: number; y: number; w: number; h: number }[][];
    typeB: { x: number; y: number; w: number; h: number }[][];
    typeC: { x: number; y: number; w: number; h: number }[][];
  };
  regular: {
    typeA: { x: number; y: number; w: number; h: number }[][];
    typeB: { x: number; y: number; w: number; h: number }[][];
    typeC: { x: number; y: number; w: number; h: number }[][];
    typeD: { x: number; y: number; w: number; h: number }[][];
    typeE: { x: number; y: number; w: number; h: number }[][];
    typeF: { x: number; y: number; w: number; h: number }[][];
  };
  wide: {
    typeA: { x: number; y: number; w: number; h: number }[][];
    typeB: { x: number; y: number; w: number; h: number }[][];
  };
}
