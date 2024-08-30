import { useEffect, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_LANGUAGE } from '../libs/constants';
import { useNavigate } from 'react-router-dom';

export function Splash() {
  const { store, setStore } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<string>('');

  const navigate = useNavigate();

  const getResourcesAndSystemConfigs = async () => {
    const resources = await window.api.getResources();
    const systemConfigs = await window.api.getSystemConfigs();
    setStore((store: StoreType) => ({ ...store, systemConfigs: systemConfigs, resources: resources }));
    setIsLoading(true);
  };

  const handleOnEnded = () => {
    navigate('/home');
  };

  useEffect(() => {
    getResourcesAndSystemConfigs();
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const languageSystem = store.systemConfigs.language;
    const index = CONST_CONFIG_LANGUAGE[languageSystem as keyof typeof CONST_CONFIG_LANGUAGE];
    setVideoLoading(store.resources.videos.loading[index].relPath);
  }, [store.systemConfigs.language]);

  return (
    <div className='h-screen w-screen'>
      {isLoading && (
        <video autoPlay onEnded={handleOnEnded} className='h-full w-full'>
          <source src={videoLoading} />
        </video>
      )}
    </div>
  );
}
