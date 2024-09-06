import { createContext, useContext, useMemo } from 'react';
import { useStore } from './store';

interface SoundContextType {
  playSoundTouch: (isLoop: boolean) => void;
  playSoundBackground: (isLoop: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { store } = useStore();

  const soundTouch = useMemo(
    () => new Audio(store.pathFolderAssets + store.systemConfigs.touchAudio),
    [store.systemConfigs.touchAudio],
  );
  const soundBackground = useMemo(
    () => new Audio(store.pathFolderAssets + store.systemConfigs.backgroundAudio),
    [store.systemConfigs.backgroundAudio],
  );

  const playSoundBackground = (isLoop: boolean) => {
    soundBackground.loop = isLoop;
    soundBackground.currentTime = 0;
    soundBackground.play();
  };

  const playSoundTouch = (isLoop: boolean) => {
    soundTouch.loop = isLoop;
    soundTouch.currentTime = 0;
    soundTouch.play();
  };

  return <SoundContext.Provider value={{ playSoundBackground, playSoundTouch }}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) return;

  return context;
};
