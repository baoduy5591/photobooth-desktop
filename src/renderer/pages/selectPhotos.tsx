import React, { useEffect, useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_FRAME_POSITIONS, CONST_MODE_WIDE, CONST_SCALE_PHOTOS } from '../libs/constants';
import { Countdown } from '../components/countdown';
import { allowWithQuantityTouches, chunkItems, getPhotoOnCanvas } from '../libs/common';
import { Canvas } from '../components/canvas';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/sound';
import { useTranslation } from 'react-i18next';

export default function SelectPhotos() {
  const { store, setStore } = useStore();
  const { t: translate } = useTranslation();
  const { playSoundTouch } = useSound();

  const [convertedPhotos, setConvertedPhotos] = useState<string[]>([]);
  const [indexForClean, setIndexForClean] = useState<number>(-1);

  const isTouchMoveScroll = useRef<boolean>(false);
  const flatConvertedPhotos = useRef<string[]>([]);
  const _selectedPhotos = useRef<{ photo: string; index: number }[]>([]);

  const navigate = useNavigate();

  const checkIsPhotoExist = (selectedPhotos: { photo: string; index: number }[], photo: string) => {
    for (let i = 0; i < selectedPhotos.length; i++) {
      if (selectedPhotos[i].photo === photo) return true;
    }

    return false;
  };

  const getIndex = (selectedPhotos: { photo: string; index: number }[], frameMode: string, frameType: string) => {
    const _frameMode = CONST_FRAME_POSITIONS[frameMode as keyof typeof CONST_FRAME_POSITIONS];
    const _frameType = _frameMode[frameType as keyof typeof _frameMode];
    const getAllIndexSelectedPhotos = selectedPhotos.map((item) => item.index);
    const getAllIndexPositionList = _frameType.map((_, index) => index);
    for (let i = 0; i < getAllIndexPositionList.length; i++) {
      if (!getAllIndexSelectedPhotos.includes(getAllIndexPositionList[i])) return i;
    }

    return null;
  };

  const handleOnTouchEndChoosePhoto = (event: React.TouchEvent<HTMLDivElement>, photo: string) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1) || isTouchMoveScroll.current) return;

    playSoundTouch(false);
    const selectedPhotos = _selectedPhotos.current;
    if (checkIsPhotoExist(selectedPhotos, photo)) {
      const deletedPhoto = selectedPhotos.filter((item) => item.photo === photo);
      if (deletedPhoto.length > 1 || deletedPhoto.length === 0) return;

      const indexForDelete = deletedPhoto[0].index;
      const newSelectedPhotos = selectedPhotos.filter((item) => item.photo !== photo);
      _selectedPhotos.current = newSelectedPhotos;
      setStore((prevStore) => ({
        ...prevStore,
        orderInfo: {
          ...prevStore.orderInfo,
          selectedPhotos: newSelectedPhotos,
        },
      }));
      setIndexForClean(indexForDelete);
    } else {
      const _index = getIndex(selectedPhotos, store.orderInfo.frameMode, store.orderInfo.frameType);
      if (_index === null) return;

      _selectedPhotos.current.push({ photo: photo, index: _index });
      setStore((prevStore) => ({
        ...prevStore,
        orderInfo: {
          ...prevStore.orderInfo,
          selectedPhotos: [...prevStore.orderInfo.selectedPhotos, { photo: photo, index: _index }],
        },
      }));
      setIndexForClean(-1);
    }
  };

  const handleConvertCanvasToBase64 = async (
    width: number,
    height: number,
    frameMode: string,
    frameType: string,
    selectedPhotos: { photo: string; index: number }[],
    positionFrames: FramePositionType,
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const object = positionFrames[frameMode as keyof typeof positionFrames];
    const listPosition = object[frameType as keyof typeof object];

    const loadImage = (photo: string, index: number): Promise<void> => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = store.userPhotosFolderPath + photo;
        image.onload = () => {
          const position = listPosition[index];
          position?.forEach((p) => {
            context.drawImage(image, p.x, p.y, p.w, p.h);
          });
          resolve();
        };
      });
    };

    const promises = selectedPhotos.map((item) => loadImage(item.photo, item.index));
    await Promise.all(promises);
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    if (store.orderInfo.selectedPhotos.length < store.orderInfo.quantitySelectedPhotos) return;

    const base64String = await handleConvertCanvasToBase64(
      store.orderInfo.width,
      store.orderInfo.height,
      store.orderInfo.frameMode,
      store.orderInfo.frameType,
      store.orderInfo.selectedPhotos,
      CONST_FRAME_POSITIONS,
    );
    setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, originalBase64: base64String } }));
    setTimeout(() => {
      navigate('/select-effect');
    }, 300);
  };

  const handleOnTouchStartCleanPhoto = (event: React.TouchEvent<HTMLDivElement>) => {
    playSoundTouch(false);
    const touches = event.touches;
    if (!allowWithQuantityTouches(Array.from(touches), 1)) return;

    const touch = touches[0];
    const { clientX, clientY } = touch;
    const element = event.currentTarget;
    const elementBounding = element.getBoundingClientRect();
    const { x, y } = elementBounding;
    const _x = (clientX - x) * CONST_SCALE_PHOTOS;
    const _y = (clientY - y) * CONST_SCALE_PHOTOS;
    const _index = getPhotoOnCanvas(store.orderInfo.frameMode, store.orderInfo.frameType, _x, _y);
    if (_index === null) return;

    setIndexForClean(_index);
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        selectedPhotos: prevStore.orderInfo.selectedPhotos.filter((item) => item.index !== _index),
      },
    }));
    _selectedPhotos.current = _selectedPhotos.current.filter((item) => item.index !== _index);
  };

  const handleOnTouchMoveScrollPhotos = () => {
    isTouchMoveScroll.current = true;
  };

  const handleOnTouchEndScrollPhotos = () => {
    isTouchMoveScroll.current = false;
  };

  const handleTimeout = () => {
    if (_selectedPhotos.current.length < store.orderInfo.quantitySelectedPhotos) {
      while (_selectedPhotos.current.length < store.orderInfo.quantitySelectedPhotos) {
        const photosName = _selectedPhotos.current.map((item) => item.photo);
        const getPhotosNotSelect = flatConvertedPhotos.current.filter((photo) => !photosName.includes(photo));
        if (getPhotosNotSelect.length === 0) return;

        const _index = getIndex(_selectedPhotos.current, store.orderInfo.frameMode, store.orderInfo.frameType);
        if (_index === null) return;

        _selectedPhotos.current.push({ photo: getPhotosNotSelect[0], index: _index });
      }
      setStore((prevStore) => ({
        ...prevStore,
        orderInfo: {
          ...prevStore.orderInfo,
          selectedPhotos: _selectedPhotos.current,
        },
      }));
      handleConvertCanvasToBase64(
        store.orderInfo.width,
        store.orderInfo.height,
        store.orderInfo.frameMode,
        store.orderInfo.frameType,
        _selectedPhotos.current,
        CONST_FRAME_POSITIONS,
      ).then((base64String) => {
        setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, originalBase64: base64String } }));
        navigate('/select-effect');
      });
    }
  };

  useEffect(() => {
    const getResizedPhotos = async () => {
      const _convertedPhotos = await window.api.getUserConvertedPhotos();
      setConvertedPhotos(_convertedPhotos);
    };

    getResizedPhotos();
  }, []);

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.assetsFolderPath + store.clientSetting.backgroundImageSecondary} />

      <div className='absolute inset-0 py-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[650px] flex-col items-center justify-center'>
            <div className='relative h-[143.2px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[37]?.relPath} />
              </div>

              <div className='absolute left-[110px] top-[30px] text-[32px] text-custom-style-1'>
                <span className='text-custom-style-2-1'>{store.orderInfo.selectedPhotos.length}</span>
                <span>/</span>
                <span>{store.orderInfo.quantitySelectedPhotos}</span>
              </div>
            </div>

            <div className='flex items-center justify-center gap-x-8'>
              <div className='h-[78.6px] w-[101.3px] -rotate-6'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
              </div>

              <div className='h-[78.6px] w-[101.3px] rotate-6'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='flex w-full -translate-y-4 items-center justify-center'>
              <div
                className='relative mt-3 flex items-center justify-center'
                style={{
                  height: `${store.orderInfo.height / CONST_SCALE_PHOTOS}px`,
                  width: `${store.orderInfo.width / CONST_SCALE_PHOTOS}px`,
                }}
              >
                <div className='absolute inset-0' onTouchStart={(event) => handleOnTouchStartCleanPhoto(event)}>
                  <Canvas
                    width={store.orderInfo.width}
                    height={store.orderInfo.height}
                    selectedPhotos={store.orderInfo.selectedPhotos}
                    pathUserPhotos={store.userPhotosFolderPath}
                    frameMode={store.orderInfo.frameMode}
                    frameType={store.orderInfo.frameType}
                    indexForClean={indexForClean}
                  />
                </div>

                <div className='pointer-events-none absolute inset-0 border-2 border-custom-style-3-1'>
                  <DisplayImage src={store.assetsFolderPath + store.orderInfo.frameRelPath} />
                </div>
              </div>
            </div>
          </div>

          <div className='relative flex h-full grow flex-col items-center justify-center gap-y-8'>
            <div className='absolute left-[80px] top-[150px] h-[80.1px] w-[103.2px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
            </div>

            <div className='flex w-full translate-x-0 translate-y-0 items-center justify-end gap-x-6 px-10'>
              <div className='relative h-[99.5px] w-[668.7px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[39]?.relPath} />
                </div>

                <div className='absolute left-[170px] top-[26px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span>{translate('translation:selectPhotos.title1')} </span>
                  <span className='text-custom-style-2-1'>{store.orderInfo.quantitySelectedPhotos} </span>
                  <span>{translate('translation:selectPhotos.title2')}</span>
                </div>
              </div>

              <div className='mb-3'>
                <Countdown
                  url={store.assetsFolderPath + store.resources.icons[10]?.relPath}
                  time={300}
                  handleTimeout={handleTimeout}
                />
              </div>
            </div>

            <div className='z-10 h-[750.4px] w-[1041.6px] rounded-xl bg-custom-style-3-1'>
              <div className='flex h-full w-full flex-col items-center justify-center'>
                <div className='mt-4 h-[22px] w-[140px] rounded-full bg-custom-style-1'></div>

                <div className='relative h-full w-full overflow-hidden p-4'>
                  {store.orderInfo.frameMode !== CONST_MODE_WIDE ? (
                    <div
                      className='custom-scroll-bar visible-scroll-bar custom-scroll-bar-thumb custom-scroll-bar-hidden-button grid h-full w-full grid-cols-3 overflow-x-hidden overflow-y-scroll rounded-xl bg-custom-style-1 px-4'
                      onTouchEnd={handleOnTouchEndScrollPhotos}
                      onTouchMove={handleOnTouchMoveScrollPhotos}
                    >
                      {convertedPhotos?.map((photo, index) => {
                        return (
                          <div
                            className='mb-3 mt-9'
                            key={index}
                            style={{ width: '290px', height: `${290 / store.orderInfo.ratio}px` }}
                            onTouchEnd={(event) => handleOnTouchEndChoosePhoto(event, photo)}
                          >
                            <div className='relative h-full w-full'>
                              {store.orderInfo.selectedPhotos.map((item) => item.photo).includes(photo) && (
                                <div className={`absolute -top-[32px] left-1/2 h-[30.8px] w-[34.8px] -translate-x-1/2`}>
                                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[43]?.relPath} />
                                </div>
                              )}

                              <div
                                className={`h-full w-full rounded-lg border-4 p-1 ${store.orderInfo.selectedPhotos.map((item) => item.photo).includes(photo) ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                              >
                                <div className='h-full w-full'>
                                  <DisplayImage src={store.userPhotosFolderPath + photo} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className='custom-scroll-bar visible-scroll-bar custom-scroll-bar-thumb custom-scroll-bar-hidden-button grid h-full w-full grid-cols-2 overflow-x-hidden overflow-y-scroll rounded-xl bg-custom-style-1 px-4'
                      onTouchEnd={handleOnTouchEndScrollPhotos}
                      onTouchMove={handleOnTouchMoveScrollPhotos}
                    >
                      {convertedPhotos?.map((photo, index) => {
                        return (
                          <div
                            className='mb-3 mt-9'
                            key={index}
                            style={{ width: '450px', height: `${450 / store.orderInfo.ratio}px` }}
                            onTouchEnd={(event) => handleOnTouchEndChoosePhoto(event, photo)}
                          >
                            <div className='relative h-full w-full'>
                              {store.orderInfo.selectedPhotos.map((item) => item.photo).includes(photo) && (
                                <div className={`absolute -top-[32px] left-1/2 h-[30.8px] w-[34.8px] -translate-x-1/2`}>
                                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[43]?.relPath} />
                                </div>
                              )}

                              <div
                                className={`h-full w-full rounded-lg border-4 p-1 ${store.orderInfo.selectedPhotos.map((item) => item.photo).includes(photo) ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                              >
                                <div className='h-full w-full'>
                                  <DisplayImage src={store.userPhotosFolderPath + photo} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className='my-3 min-h-[45px] min-w-[45px] rounded-full bg-custom-style-1 p-1.5'>
                  <div className='h-full w-full rounded-full bg-custom-style-3-1'></div>
                </div>
              </div>
            </div>

            <div className='absolute bottom-0 left-0 right-0 text-center font-rokkitt text-[24px] text-custom-style-3-1'>
              <div className='h-[30px] min-w-max'>
                <span>※ {translate('translation:selectPhotos.note1')}</span>
              </div>
              <div className='h-[30px] min-w-max'>
                <span>※ {translate('translation:selectPhotos.note2')}</span>
              </div>
            </div>
          </div>

          <div
            className='flex h-full w-[200px] items-center justify-center'
            onTouchStart={(event) => handleOnTouchStartNextPage(event)}
          >
            <div className='h-[79.8px] w-[79.8px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[38]?.relPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
