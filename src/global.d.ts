interface Window {
  api: {
    getResources: () => Promise;
    getSystemConfigs: () => Promise;
    getResolution: () => Promise;
    getPathFolderAssets: () => Promise;
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
  icons: PathResourceType[];
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
  backgroundImageTypeA: string;
  backgroundImageTypeB: string;
  backgroundImageTypeC: string;
  backgroundAudio: string;
  touchAudio: string;
  videoIntro: string;
}

interface StoreType {
  systemConfigs: SystemConfigsType;
  resources: ResourcesType; 
  pathFolderAssets: string;
  isLoading: boolean
}