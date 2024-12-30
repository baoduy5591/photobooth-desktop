import { HashRouter, Route, Routes } from 'react-router-dom';
import { Splash } from './pages/splash';
import Home from './pages/home';
import { useEffect, useState } from 'react';
import { useStore } from './context/store';
import EnterCode from './pages/enterCode';
import Shooting from './pages/shooting';
import SelectPhotos from './pages/selectPhotos';
import SelectEffect from './pages/selectEffect';
import SelectSticker from './pages/selectSticker';
import Complete from './pages/complete';
import SelectFrameType from './pages/selectFrameType';
import SelectFrameDesign from './pages/selectFrameDesign';
import SelectPrintQuantity from './pages/selectPrintQuantity';

export default function App() {
  const { store, setStore } = useStore();

  const getResourcesAndSystemConfigs = async () => {
    const resources = await window.api.getResources();
    const assetsFolderPath = await window.api.getPathFolderAssets();
    const userPhotosFolderPath = await window.api.getPathFolderUserPhotos();
    setStore((prevStore: StoreType) => ({
      ...prevStore,
      resources: { ...prevStore.resources, ...resources },
      assetsFolderPath,
      userPhotosFolderPath,
      isLoading: true,
    }));

    const clientSetting = await window.api.getClientSetting();
    if (clientSetting) {
      setStore((prevStore: StoreType) => ({
        ...prevStore,
        clientSetting: { ...prevStore.clientSetting, ...clientSetting },
      }));
    }
  };

  useEffect(() => {
    getResourcesAndSystemConfigs();
  }, []);

  return (
    <div>
      {store.orderInfo.isFreeTimeMode && <div className='fixed left-10 top-0 z-50'>9999999999999</div>}
      <HashRouter>
        <Routes>
          <Route path='/' element={<Splash />} />
          {/* <Route path='/' element={<SelectPhotos />} /> */}
          {/* <Route path='/' element={<Shooting />} /> */}
          {/* <Route path='/' element={<SelectSticker />} /> */}
          {/* <Route path='/' element={<SelectFrameType />} /> */}
          {/* <Route path='/' element={<SelectFrameDesign />} /> */}
          {/* <Route path='/' element={<SelectPrintQuantity />} /> */}
          <Route path='/home' element={<Home />} />
          <Route path='/enter-code' element={<EnterCode />} />
          <Route path='/select-frame-type' element={<SelectFrameType />} />
          <Route path='/select-frame-design' element={<SelectFrameDesign />} />
          <Route path='/select-print-quantity' element={<SelectPrintQuantity />} />
          <Route path='/shooting' element={<Shooting />} />
          <Route path='/select-photos' element={<SelectPhotos />} />
          <Route path='/select-effect' element={<SelectEffect />} />
          <Route path='/select-sticker' element={<SelectSticker />} />
          <Route path='/complete' element={<Complete />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
