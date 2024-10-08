import { useEffect, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_LANGUAGE } from '../libs/constants';
import { useNavigate } from 'react-router-dom';

export function Splash() {
  const { store, setStore } = useStore();
  const [videoLoading, setVideoLoading] = useState<string>('');

  const navigate = useNavigate();

  const handleOnEnded = () => {
    setStore((store: StoreType) => ({ ...store, isLoading: false }));
    navigate('/home');
  };

  useEffect(() => {
    if (!store.isLoading) return;

    const defaultLanguage = store.systemConfigs.defaultLanguage;
    const index = CONST_CONFIG_LANGUAGE[defaultLanguage as keyof typeof CONST_CONFIG_LANGUAGE];
    setVideoLoading(store.pathFolderAssets + store.resources.videos.loading[index].relPath);
  }, [store.systemConfigs.defaultLanguage]);

  return (
    <div className='h-screen w-screen'>
      {store.isLoading && <video src={videoLoading} autoPlay onEnded={handleOnEnded} className='h-full w-full' />}
    </div>
  );
}
