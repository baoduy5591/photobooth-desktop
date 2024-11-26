import { HashRouter, Route, Routes } from 'react-router-dom';
import { Splash } from './pages/splash';
import Home from './pages/home';
import { useEffect } from 'react';
import { useStore } from './context/store';
import EnterCode from './pages/enterCode';
import Shooting from './pages/shooting';
import SelectPhotos from './pages/selectPhotos';
import SelectEffect from './pages/selectEffect';
import SelectSticker from './pages/selectSticker';
import Complete from './pages/complete';
import { Draw } from './pages/draw';

export default function App() {
  const { setStore } = useStore();

  const getResourcesAndSystemConfigs = async () => {
    const resources = await window.api.getResources();
    const systemConfigs = await window.api.getSystemConfigs();
    const pathFolderAssets = await window.api.getPathFolderAssets();
    const pathFolderUserPhotos = await window.api.getPathFolderUserPhotos();
    const machineConfigs = await window.api.getMachineConfigs();
    setStore((store: StoreType) => ({
      ...store,
      systemConfigs: { ...store.systemConfigs, ...systemConfigs },
      resources: { ...store.resources, ...resources },
      pathFolderAssets,
      pathFolderUserPhotos,
      isLoading: true,
      machineConfigs: { ...store.machineConfigs, ...machineConfigs },
    }));
  };

  useEffect(() => {
    getResourcesAndSystemConfigs();
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* <Route path='/' element={<Splash />} /> */}
        <Route path='/' element={<SelectPhotos />} />
        <Route path='/home' element={<Home />} />
        <Route path='/enter-code' element={<EnterCode />} />
        <Route path='/shooting' element={<Shooting />} />
        <Route path='/select-photos' element={<SelectPhotos />} />
        <Route path='/select-effect' element={<SelectEffect />} />
        <Route path='/select-sticker' element={<SelectSticker />} />
        <Route path='/draw' element={<Draw />} />
        <Route path='/complete' element={<Complete />} />
      </Routes>
    </HashRouter>
  );
}
