import { HashRouter, Route, Routes } from 'react-router-dom';
import { Splash } from './pages/splash';
import Home from './pages/home';
import { useEffect } from 'react';
import { useStore } from './context/store';

export default function App() {
  const { setStore } = useStore();

  const getResourcesAndSystemConfigs = async () => {
    const resources = await window.api.getResources();
    const systemConfigs = await window.api.getSystemConfigs();
    const resolution = await window.api.getResolution();
    setStore((store: StoreType) => ({
      ...store,
      systemConfigs: systemConfigs,
      resources: resources,
      resolution: resolution,
    }));
    setStore((store: StoreType) => ({ ...store, systemConfigs: { ...store.systemConfigs, isLoading: true } }));
  };

  useEffect(() => {
    getResourcesAndSystemConfigs();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
