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
    saveImage: (data: { orderInfo: {} }) => Promise;
    saveImageFrameSticker: (imageBase64) => Promise;
    deleteFiles: () => Promise;
    generateVideo: (data: GenerateVideoType) => Promise;
    getQRCode: (orderId: string) => Promise;
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
  warningAudio: string;
  videoIntro: string;
}

interface OrderInfoType {
  frameMode: string;
  frameType: string;
  frameStyle: string;
  frameOrder: number;
  quantityShootingPhotos: number;
  quantitySelectedPhotos: number;
  frameRelPath: string;
  ratio: number;
  width: number;
  height: number;
  printCount: number;
  colorBase64: string;
  originalBase64: string;
  framePrice: number;
  grayscaleBase64: string;
  selectedPhotos: { photo: string; index: number }[];
  imageSelectPhoto: string;
  imageSelectEffect: string;
  imageFrameSticker: string;
  imageFrameStickerDraw: string;
  videoBase64: string;
  orderNumber: string;
  effect: {
    name: string;
    className: string;
    style: string;
  };
  _id: string;
}

// interface OrderInfoType {
//   frameMode: string;
//   frameType: string;
//   frameStyle: string;
//   quantityShootingPhotos: number;
//   quantitySelectedPhotos: number;
//   frameOrder: number;
//   frameRelPath: string;
//   ratio: number;
//   width: number;
//   height: number;
//   printCount: number;
//   grayscaleBase64: string;
//   colorBase64: string;
//   framePrice: number;
// }

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
  shootingTime: number;
  machineConfigs: MachineConfigsType;
}

interface FramePositionType {
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

interface BouncingType {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
}

interface GenerateVideoType {
  frameMode: string;
  frameWidth: number;
  frameHeight: number;
  photos: {
    photo: string;
    index: number;
  }[];
  effectName: string;
  positions: {
    x: number;
    y: number;
    w: number;
    h: number;
  }[][];
}
