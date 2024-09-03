import { useEffect, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_LANGUAGE } from '../libs/constants';
import { useNavigate } from 'react-router-dom';

export function Splash() {
  const { store, setStore } = useStore();
  const [videoLoading, setVideoLoading] = useState<string>('');

  const navigate = useNavigate();

  const handleOnEnded = () => {
    setStore((store: StoreType) => ({ ...store, systemConfigs: { ...store.systemConfigs, isLoading: false } }));
    navigate('/home');
  };

  useEffect(() => {
    if (!store.systemConfigs.isLoading) return;

    const languageSystem = store.systemConfigs.language;
    const index = CONST_CONFIG_LANGUAGE[languageSystem as keyof typeof CONST_CONFIG_LANGUAGE];
    setVideoLoading(store.resources.videos.loading[index].relPath);
  }, [store.systemConfigs.language]);

  return (
    <div className='h-screen w-screen'>
      {store.systemConfigs.isLoading && (
        <video autoPlay onEnded={handleOnEnded} className='h-full w-full'>
          <source src={videoLoading} />
        </video>
      )}
    </div>
  );
}
