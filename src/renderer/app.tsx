import { HashRouter, Route, Routes } from 'react-router-dom';
import { Splash } from './pages/splash';
import Home from './pages/home';
import { useEffect } from 'react';
import { useStore } from './context/store';
import EnterCode from './pages/enterCode';

export default function App() {
  const { setStore } = useStore();

  const getResourcesAndSystemConfigs = async () => {
    const resources = await window.api.getResources();
    const systemConfigs = await window.api.getSystemConfigs();
    const pathFolderAssets = await window.api.getPathFolderAssets();
    setStore((store: StoreType) => ({
      ...store,
      systemConfigs: { ...store.systemConfigs, ...systemConfigs },
      resources: { ...store.resources, ...resources },
      pathFolderAssets: pathFolderAssets,
      isLoading: true,
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
      </Routes>
    </HashRouter>
  );
}
