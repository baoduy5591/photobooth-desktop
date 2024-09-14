import React, { useEffect, useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import {
  CONST_MOCK_DATA_FRAME,
  CONST_MODE_REGULAR,
  CONST_POSITION_FRAMES,
  CONST_TYPE_FRAMES_FOR_DOUBLE,
} from '../libs/constants';
import { Countdown } from '../components/countdown';
import { checkIsTouch, chunkItems } from '../libs/common';
import { Canvas } from '../components/canvas';
import { useNavigate } from 'react-router-dom';

export default function SelectPhotos() {
  const { store, setStore } = useStore();

  const checkIsDoubleFrames = () => {
    // const { modeFrame, typeFrame } = store.orderInfo;
    // use mock data frame
    const { modeFrame, typeFrame } = CONST_MOCK_DATA_FRAME;
    let isDouble = false;
    if (modeFrame === CONST_MODE_REGULAR && CONST_TYPE_FRAMES_FOR_DOUBLE.includes(typeFrame)) {
      isDouble = true;
    }

    return isDouble;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDouble, setIsDouble] = useState<boolean>(checkIsDoubleFrames());
  const [resizedPhotos, setResizedPhotos] = useState<string[][]>([[]]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isTouchMove = useRef<boolean>(false);
  const isTouchEnd = useRef<boolean>(false);

  const isTouchPrev = useRef<boolean>(false);
  const isTouchNext = useRef<boolean>(false);
  const isTouchTogglePhoto = useRef<boolean>(false);
  const isTouchMoveTogglePhoto = useRef<boolean>(false);
  const isTouchChangeCurrentIndex = useRef<boolean>(false);
  const isTouchNextPage = useRef<boolean>(false);

  const navigate = useNavigate();

  const handleOnTouchStartPrev = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchPrev)) return;

    setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
  };

  const handleOnTouchStartNext = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchNext)) return;

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
    if (!checkIsTouch(event, isTouchEnd)) return;

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

  const handleOnTouchEndTogglePhoto = (event: TouchEventAndMouseEventType, photo: string) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchTogglePhoto)) return;

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

    if (store.orderInfo.selectedPhotos.includes(photo)) {
      setStore((store) => ({
        ...store,
        orderInfo: {
          ...store.orderInfo,
          selectedPhotos: store.orderInfo.selectedPhotos.filter((_photo) => _photo !== photo),
        },
      }));
      return;
    } else {
      if (store.orderInfo.selectedPhotos.length < CONST_MOCK_DATA_FRAME.quantityImages) {
        setStore((store) => ({
          ...store,
          orderInfo: {
            ...store.orderInfo,
            selectedPhotos: [...store.orderInfo.selectedPhotos, photo],
          },
        }));
        return;
      }
    }
  };

  const handleOnMoveTogglePhoto = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!checkIsTouch(event, isTouchMoveTogglePhoto)) return;

    isTouchMove.current = true;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleOnTouchChangeCurrentIndex = (event: TouchEventAndMouseEventType, newIndex: number) => {
    if (!checkIsTouch(event, isTouchChangeCurrentIndex)) return;

    setCurrentIndex(newIndex);
  };

  const handleConvertCanvasToBase64 = async (
    width: number,
    height: number,
    modeFrame: string,
    typeFrame: string,
    selectedPhotos: string[],
    positionFrames: PositionFramesType,
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const object = positionFrames[modeFrame as keyof typeof positionFrames];
    const listPosition = object[typeFrame as keyof typeof object];

    const loadImage = (photo: string, index: number): Promise<void> => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = store.pathFolderUserPhotos + photo;
        image.onload = () => {
          const position = listPosition[index];
          position.forEach((p) => {
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

  const handleOnTouchStartNextPage = async (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchNextPage)) return;

    const base64String = await handleConvertCanvasToBase64(
      CONST_MOCK_DATA_FRAME.width,
      CONST_MOCK_DATA_FRAME.height,
      CONST_MOCK_DATA_FRAME.modeFrame,
      CONST_MOCK_DATA_FRAME.typeFrame,
      store.orderInfo.selectedPhotos,
      CONST_POSITION_FRAMES,
    );
    setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, imageSelectPhoto: base64String } }));

    setTimeout(() => {
      navigate('/select-effect');
    }, 250);
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

      <div className='absolute inset-0 p-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[550px] flex-col items-center justify-center'>
            <div className='relative h-[143.2px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[37]?.relPath} />
              </div>

              <div className='absolute left-[110px] top-[30px] text-[32px] text-custom-style-1'>
                <span className='text-custom-style-2-1'>{store.orderInfo.selectedPhotos.length}</span>
                <span>/</span>
                <span>{CONST_MOCK_DATA_FRAME.quantityImages}</span>
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

            <div className='flex h-[645px] w-full -translate-y-4 items-center justify-center'>
              {!isDouble ? (
                <div className='relative mt-3 flex h-full w-[430px] items-center justify-center'>
                  <div className='absolute inset-0'>
                    <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                  </div>

                  <Canvas
                    width={CONST_MOCK_DATA_FRAME.width}
                    height={CONST_MOCK_DATA_FRAME.height}
                    selectedPhotos={store.orderInfo.selectedPhotos}
                    pathUserPhotos={store.pathFolderUserPhotos}
                    modeFrame={CONST_MOCK_DATA_FRAME.modeFrame}
                    typeFrame={CONST_MOCK_DATA_FRAME.typeFrame}
                  />
                </div>
              ) : (
                <div className='mt-1 flex h-full w-full flex-col items-center justify-center gap-y-1'>
                  <div className='relative flex h-[320.5px] w-[480.8px] items-center justify-center'>
                    <div className='absolute inset-0'>
                      <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                    </div>

                    <Canvas
                      width={CONST_MOCK_DATA_FRAME.width}
                      height={CONST_MOCK_DATA_FRAME.height}
                      selectedPhotos={store.orderInfo.selectedPhotos}
                      pathUserPhotos={store.pathFolderUserPhotos}
                      modeFrame={CONST_MOCK_DATA_FRAME.modeFrame}
                      typeFrame={CONST_MOCK_DATA_FRAME.typeFrame}
                    />
                  </div>

                  <div className='relative flex h-[320.5px] w-[480.8px] items-center justify-center'>
                    <div className='absolute inset-0'>
                      <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                    </div>

                    <Canvas
                      width={CONST_MOCK_DATA_FRAME.width}
                      height={CONST_MOCK_DATA_FRAME.height}
                      selectedPhotos={store.orderInfo.selectedPhotos}
                      pathUserPhotos={store.pathFolderUserPhotos}
                      modeFrame={CONST_MOCK_DATA_FRAME.modeFrame}
                      typeFrame={CONST_MOCK_DATA_FRAME.typeFrame}
                    />
                  </div>
                </div>
              )}
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
                  <span className='text-custom-style-2-1'>{CONST_MOCK_DATA_FRAME.quantityImages} </span>
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
                                  onTouchEnd={(event) => handleOnTouchEndTogglePhoto(event, photo)}
                                  onMouseUp={(event) => handleOnTouchEndTogglePhoto(event, photo)}
                                  onTouchMove={(event) => handleOnMoveTogglePhoto(event)}
                                >
                                  {store.orderInfo.selectedPhotos.includes(photo) ? (
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
                                    <div className='h-full w-full'>
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
                              onMouseDown={(event) => handleOnTouchChangeCurrentIndex(event, index)}
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
                    onMouseDown={(event) => handleOnTouchStartPrev(event)}
                  >
                    <div className='h-full w-full'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[42]?.relPath} />
                    </div>
                  </div>

                  <div
                    className='absolute right-[27px] top-[260px] h-[50px] w-[50px] p-1'
                    onTouchStart={(event) => handleOnTouchStartNext(event)}
                    onMouseDown={(event) => handleOnTouchStartNext(event)}
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
            onMouseDown={(event) => handleOnTouchStartNextPage(event)}
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
