import { createContext, useContext, useMemo } from 'react';
import { useStore } from './store';

interface SoundContextType {
  playSoundTouch: (isLoop: boolean) => void;
  playSoundWarning: (isLoop: boolean) => void;
  playSoundBackground: (isLoop: boolean) => void;
  pauseSoundBackground: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { store } = useStore();

  console.log(store);
  const soundTouch = useMemo(
    () => new Audio(store.assetsFolderPath + store.clientSetting.touchAudio),
    [store.clientSetting.touchAudio, store.assetsFolderPath],
  );
  const soundWarning = useMemo(
    () => new Audio(store.assetsFolderPath + store.clientSetting.warningAudio),
    [store.clientSetting.warningAudio, store.assetsFolderPath],
  );
  const soundBackground = useMemo(
    () => new Audio(store.assetsFolderPath + store.clientSetting.backgroundAudio),
    [store.clientSetting.backgroundAudio, store.assetsFolderPath],
  );

  const playSoundBackground = (isLoop: boolean) => {
    soundBackground.loop = isLoop;
    soundBackground.currentTime = 0;
    soundBackground.play();
  };

  const pauseSoundBackground = () => {
    soundBackground.pause();
  };

  const playSoundTouch = (isLoop: boolean) => {
    soundTouch.loop = isLoop;
    soundTouch.currentTime = 0;
    soundTouch.play();
  };

  const playSoundWarning = (isLoop: boolean) => {
    soundWarning.loop = isLoop;
    soundWarning.currentTime = 0;
    soundWarning.play();
  };

  return (
    <SoundContext.Provider value={{ playSoundBackground, pauseSoundBackground, playSoundTouch, playSoundWarning }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) return;

  return context;
};
