import { HashRouter, Route, Routes } from 'react-router-dom';
import { Splash } from './pages/splash';
import Home from './pages/home';
import { useEffect } from 'react';
import { useStore } from './context/store';
import EnterCode from './pages/enterCode';
import ConfirmFrame from './pages/confirmFrame';
import ShootingMethod from './pages/shootingMethod';
import Shooting from './pages/shooting';
import SelectPhotos from './pages/selectPhotos';

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
        <Route path='/' element={<Splash />} />
        <Route path='/home' element={<Home />} />
        <Route path='/enter-code' element={<EnterCode />} />
        <Route path='/confirm-frame' element={<ConfirmFrame />} />
        <Route path='/shooting-method' element={<ShootingMethod />} />
        <Route path='/shooting' element={<Shooting />} />
        <Route path='/select-photos' element={<SelectPhotos />} />
      </Routes>
    </HashRouter>
  );
}
