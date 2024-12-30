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
    getClientSetting: () => Promise;
    getResolution: () => Promise;
    getPathFolderAssets: () => Promise;
    getPathFolderUserPhotos: () => Promise;
    getOrderInfoById: (value) => Promise;
    getMachineConfigs: () => Promise;
    getUserConvertedPhotos: () => Promise;
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
  order: number;
}

interface StickerPositionType {
  name: PathResourceType['name'];
  relPath: PathResourceType['relPath'];
  isNew: PathResourceType['isNew'];
  thumb: PathResourceType['thumb'];
  order: number;
  top: number;
  left: number;
  offsetX: number;
  offsetY: number;
  currentPageX: number;
  currentPageY: number;
  width: number;
  height: number;
  rotate: number;
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

interface ClientSettingType {
  hardwareInfo: HardwareInfoType;
  defaultLanguage: string;
  backgroundImagePrimary: string;
  backgroundImageSecondary: string;
  backgroundAudio: string;
  touchAudio: string;
  warningAudio: string;
  videoIntro: string;
}

interface OrderInfoType {
  _id: string;
  orderNumber: string;
  orderType: string;
  orderBase: string;
  printCount: number;
  isGrayScale: boolean;
  grayScaleBase64: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  originalPrice: number;
  finalPrice: number;
  couponCode: string;
  discountPrice: number;
  effect: {
    name: string;
    className: string;
    style: string;
  };
  stickers: StickerPositionType[];
  frameMode: string;
  frameType: string;
  frameStyle: string;
  frameNumber: number;
  quantityShootingPhotos: number;
  quantitySelectedPhotos: number;
  frameRelPath: string;
  ratio: number;
  width: number;
  height: number;
  colorBase64: string;
  colorBase64NoQR: string;
  originalBase64: string;
  framePrice: number;
  selectedPhotos: { photo: string; index: number }[];
  imageSelectPhoto: string;
  imageSelectEffect: string;
  imageSelectSticker: string;
  imageFrameSticker: string;
  imageFrameStickerDraw: string;
  videoBase64: string;
  isVideoUploaded: boolean;
  isImageUploaded: boolean;
  currentPrintCount: number;
  timeCode: string;
  shootingMethod: string;
  shootingTime: number;
  isDeleted: boolean;
  isFreeTimeMode: boolean;
  isDark: boolean;
  step: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreType {
  clientSetting: ClientSettingType;
  resources: ResourcesType;
  isLoading: boolean;
  assetsFolderPath: string;
  userPhotosFolderPath: string;
  orderInfo: OrderInfoType;
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

interface QrDetailType {
  x: number;
  y: number;
  w: number;
  h: number;
  xDate: number;
  yDate: number;
  fontDate: string;
  fillStyleDate: string;
  xOrderNumber: number;
  yOrderNumber: number;
  fontOrderNumber: string;
  fillStyleOrderNumber: string;
}
