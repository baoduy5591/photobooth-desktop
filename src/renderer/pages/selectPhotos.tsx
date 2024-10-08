import React, { useEffect, useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_POSITION_FRAMES, CONST_SCALE_PHOTOS } from '../libs/constants';
import { Countdown } from '../components/countdown';
import { allowWithQuantityTouches, chunkItems, getPhotoOnCanvas } from '../libs/common';
import { Canvas } from '../components/canvas';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/sound';

export default function SelectPhotos() {
  const { store, setStore } = useStore();

  const { playSoundTouch } = useSound();

  const [resizedPhotos, setResizedPhotos] = useState<string[][]>([[]]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [indexForClean, setIndexForClean] = useState<number>(-1);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isTouchMove = useRef<boolean>(false);

  const navigate = useNavigate();

  const handleOnTouchStartPrev = (event: React.TouchEvent<HTMLDivElement>) => {
    playSoundTouch(false);
    setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
  };

  const handleOnTouchStartNext = (event: React.TouchEvent<HTMLDivElement>) => {
    playSoundTouch(false);
    setCurrentIndex((index) => (index + 1 >= resizedPhotos.length ? index : index + 1));
  };

  const handleOnTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleOnTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    isTouchMove.current = true;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleOnTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchMove.current) return;

    if (touchEndX.current - touchStartX.current > 100) {
      setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
      isTouchMove.current = false;
      return;
    }

    if (touchEndX.current - touchStartX.current < -100) {
      setCurrentIndex((index) => (index + 1 >= resizedPhotos.length ? index : index + 1));
      isTouchMove.current = false;
      return;
    }
  };

  const checkIsPhotoExist = (selectedPhotos: { photo: string; index: number }[], photo: string) => {
    for (let i = 0; i < selectedPhotos.length; i++) {
      if (selectedPhotos[i].photo === photo) return true;
    }

    return false;
  };

  const getIndex = (selectedPhotos: { photo: string; index: number }[], frameMode: string, frameType: string) => {
    const _frameMode = CONST_POSITION_FRAMES[frameMode as keyof typeof CONST_POSITION_FRAMES];
    const _frameType = _frameMode[frameType as keyof typeof _frameMode];
    const getAllIndexSelectedPhotos = selectedPhotos.map((item) => item.index);
    const getAllIndexPositionList = _frameType.map((_, index) => index);
    for (let i = 0; i < getAllIndexPositionList.length; i++) {
      if (!getAllIndexSelectedPhotos.includes(getAllIndexPositionList[i])) return i;
    }

    return null;
  };

  const handleOnTouchEndChoosePhoto = (event: React.TouchEvent<HTMLDivElement>, photo: string) => {
    event.stopPropagation();
    playSoundTouch(false);
    if (isTouchMove.current) {
      if (touchEndX.current - touchStartX.current > 100) {
        setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
        isTouchMove.current = false;
        return;
      }

      if (touchEndX.current - touchStartX.current < -100) {
        setCurrentIndex((index) => (index + 1 >= resizedPhotos.length ? index : index + 1));
        isTouchMove.current = false;
        return;
      }
    }

    const { selectedPhotos } = store.orderInfo;
    if (checkIsPhotoExist(selectedPhotos, photo)) return;

    const _index = getIndex(selectedPhotos, store.orderInfo.frameMode, store.orderInfo.frameType);
    if (_index === null) return;

    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        selectedPhotos: [...prevStore.orderInfo.selectedPhotos, { photo: photo, index: _index }],
      },
    }));
    setIndexForClean(-1);
  };

  const handleOnMoveTogglePhoto = (event: React.TouchEvent<HTMLDivElement>) => {
    isTouchMove.current = true;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleOnTouchChangeCurrentIndex = (event: React.TouchEvent<HTMLDivElement>, newIndex: number) => {
    playSoundTouch(false);
    setCurrentIndex(newIndex);
  };

  const handleConvertCanvasToBase64 = async (
    width: number,
    height: number,
    frameMode: string,
    frameType: string,
    selectedPhotos: string[],
    positionFrames: PositionFramesType,
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
        image.src = store.pathFolderUserPhotos + photo;
        image.onload = () => {
          const position = listPosition[index];
          position?.forEach((p) => {
            context.drawImage(image, p.x, p.y, p.w, p.h);
          });
          resolve();
        };
      });
    };

    const promises = selectedPhotos.map((photo, index) => loadImage(photo, index));
    await Promise.all(promises);
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    playSoundTouch(false);
    // if (store.orderInfo.selectedPhotos.length < store.orderInfo.quantitySelectedPhotos) return;

    // const base64String = await handleConvertCanvasToBase64(
    //   store.orderInfo.width,
    //   store.orderInfo.height,
    //   store.orderInfo.frameMode,
    //   store.orderInfo.frameType,
    //   store.orderInfo.selectedPhotos,
    //   CONST_POSITION_FRAMES,
    // );
    // setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, imageSelectPhoto: base64String } }));
    // setTimeout(() => {
    //   navigate('/select-effect');
    // }, 300);
  };

  const handleOnTouchStartCleanPhoto = (event: React.TouchEvent<HTMLDivElement>) => {
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
  };

  useEffect(() => {
    const getResizedPhotos = async () => {
      const resizedPhotos = await window.api.getUserResizedPhotos();
      const chunkPhotos = chunkItems(resizedPhotos, 6);
      setResizedPhotos(chunkPhotos);
    };

    getResizedPhotos();
  }, []);

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute inset-0 py-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[650px] flex-col items-center justify-center'>
            <div className='relative h-[143.2px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[37]?.relPath} />
              </div>

              <div className='absolute left-[110px] top-[30px] text-[32px] text-custom-style-1'>
                <span className='text-custom-style-2-1'>{store.orderInfo.selectedPhotos.length}</span>
                <span>/</span>
                <span>{store.orderInfo.quantitySelectedPhotos}</span>
              </div>
            </div>

            <div className='flex items-center justify-center gap-x-8'>
              <div className='h-[78.6px] w-[101.3px] -rotate-6'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>

              <div className='h-[78.6px] w-[101.3px] rotate-6'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
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
                <div className='absolute inset-0 z-10 select-none'>
                  <DisplayImage src={store.pathFolderAssets + store.orderInfo.frameRelPath} />
                </div>

                <div className='absolute inset-0' onTouchStart={(event) => handleOnTouchStartCleanPhoto(event)}>
                  <Canvas
                    width={store.orderInfo.width}
                    height={store.orderInfo.height}
                    selectedPhotos={store.orderInfo.selectedPhotos}
                    pathUserPhotos={store.pathFolderUserPhotos}
                    frameMode={store.orderInfo.frameMode}
                    frameType={store.orderInfo.frameType}
                    indexForClean={indexForClean}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='relative flex h-full grow flex-col items-center justify-center gap-y-8'>
            <div className='absolute left-[80px] top-[150px] h-[80.1px] w-[103.2px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
            </div>

            <div className='flex w-full translate-x-0 translate-y-0 items-center justify-end gap-x-6 px-10'>
              <div className='relative h-[99.5px] w-[668.7px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[39]?.relPath} />
                </div>

                <div className='absolute left-[170px] top-[26px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span>Select </span>
                  <span className='text-custom-style-2-1'>{store.orderInfo.quantitySelectedPhotos} </span>
                  <span>Photos To Print</span>
                </div>
              </div>

              <div className='mb-3'>
                <Countdown
                  url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
                  time={999}
                  routeGoToBack='/home'
                />
              </div>
            </div>

            <div className='z-10 h-[750.4px] w-[1041.6px] rounded-xl bg-custom-style-3-1'>
              <div className='flex h-full w-full flex-col items-center justify-center'>
                <div className='my-4 h-[22px] w-[140px] rounded-full bg-custom-style-1'></div>
                <div className='relative h-full w-full px-6'>
                  <div
                    className='flex h-full w-full flex-col items-center justify-between bg-custom-style-1 px-10'
                    onTouchStart={(event) => handleOnTouchStart(event)}
                    onTouchMove={(event) => handleOnTouchMove(event)}
                    onTouchEnd={(event) => handleOnTouchEnd(event)}
                  >
                    <div className='flex flex-1 items-center overflow-x-hidden pb-10 pt-16'>
                      {resizedPhotos?.map((photos, index) => {
                        return (
                          <div
                            key={index}
                            className='grid h-full min-w-full grid-cols-3 content-start justify-items-center gap-x-6 gap-y-20 transition-transform duration-300'
                            style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
                          >
                            {photos?.map((photo, index) => {
                              return (
                                <div
                                  key={index}
                                  className='w-[270px h-[180px]'
                                  onTouchEnd={(event) => handleOnTouchEndChoosePhoto(event, photo)}
                                  onTouchMove={(event) => handleOnMoveTogglePhoto(event)}
                                >
                                  {store.orderInfo.selectedPhotos.map((item) => item.photo).includes(photo) ? (
                                    <div className='relative h-full w-full'>
                                      <div
                                        className={`absolute -top-[32px] left-1/2 h-[30.8px] w-[34.8px] -translate-x-1/2`}
                                      >
                                        <DisplayImage
                                          src={store.pathFolderAssets + store.resources.icons[43]?.relPath}
                                        />
                                      </div>

                                      <div className='h-full w-full rounded-lg border-4 border-dashed border-custom-style-2-1 p-1'>
                                        <div className='h-full w-full'>
                                          <DisplayImage src={store.pathFolderUserPhotos + photo} />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className='h-full w-full border-4 border-transparent'>
                                      <DisplayImage src={store.pathFolderUserPhotos + photo} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    <div className='flex h-[75px] w-full items-center justify-center gap-x-4'>
                      {[...Array(resizedPhotos.length)]
                        .map((_, i) => i)
                        .map((item, index) => {
                          if (item === currentIndex) {
                            return (
                              <div key={index} className='h-[42px] w-[44px]'>
                                <DisplayImage src={store.pathFolderAssets + store.resources.icons[40]?.relPath} />
                              </div>
                            );
                          }

                          return (
                            <div
                              key={index}
                              className='h-[30px] w-[30px]'
                              onTouchStart={(event) => handleOnTouchChangeCurrentIndex(event, index)}
                            >
                              <DisplayImage src={store.pathFolderAssets + store.resources.icons[41]?.relPath} />
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div
                    className='absolute left-[27px] top-[260px] h-[50px] w-[50px] p-1'
                    onTouchStart={(event) => handleOnTouchStartPrev(event)}
                  >
                    <div className='h-full w-full'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[42]?.relPath} />
                    </div>
                  </div>

                  <div
                    className='absolute right-[27px] top-[260px] h-[50px] w-[50px] p-1'
                    onTouchStart={(event) => handleOnTouchStartNext(event)}
                  >
                    <div className='h-full w-full'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[38]?.relPath} />
                    </div>
                  </div>
                </div>

                <div className='my-4 min-h-[45px] min-w-[45px] rounded-full bg-custom-style-1 p-1.5'>
                  <div className='h-full w-full rounded-full bg-custom-style-3-1'></div>
                </div>
              </div>
            </div>

            <div className='absolute bottom-0 left-0 right-0 text-center font-rokkitt text-[24px] text-custom-style-3-1'>
              <div className='h-[30px] min-w-max'>
                <span>※ Slide to see more photos</span>
              </div>
              <div className='h-[30px] min-w-max'>
                <span>※ To deselect, touch the picture you want to cancel</span>
              </div>
            </div>
          </div>

          <div
            className='flex h-full w-[200px] items-center justify-center'
            onTouchStart={(event) => handleOnTouchStartNextPage(event)}
          >
            <div className='h-[79.8px] w-[79.8px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[38]?.relPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
