import React, { useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_LIST_EFFECTS } from '../libs/constants';
import { checkIsTouch, loadImage } from '../libs/common';
import { useNavigate } from 'react-router-dom';
import { Countdown } from '../components/countDown1';
import { useSound } from '../context/sound';

export default function SelectEffect() {
  const { store, setStore } = useStore();
  const { playSoundTouch } = useSound();

  const chunkPhotoEffects = (items: { name: string; className: string; style: string }[], size: number) => {
    const _list = [];
    const _length = items.length;
    for (let i = 0; i < _length; i += size) {
      _list.push(items.slice(i, i + size));
    }
    return _list;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [photoEffects, setPhotoEffects] = useState<{ name: string; className: string; style: string }[][]>(
    chunkPhotoEffects(CONST_LIST_EFFECTS, 6),
  );
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

  const handleOnTouchStartPrev = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!checkIsTouch(event, isTouchPrev)) return;

    playSoundTouch(false);
    setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
  };

  const handleOnTouchStartNext = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!checkIsTouch(event, isTouchNext)) return;

    playSoundTouch(false);
    setCurrentIndex((index) => (index + 1 >= photoEffects.length ? index : index + 1));
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
      setCurrentIndex((index) => (index + 1 >= photoEffects.length ? index : index + 1));
      isTouchMove.current = false;
      return;
    }
  };

  const handleOnTouchEndTogglePhoto = (
    event: React.TouchEvent<HTMLDivElement>,
    effect: { name: string; className: string; style: string },
  ) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchTogglePhoto)) return;

    playSoundTouch(false);
    if (isTouchMove.current) {
      if (touchEndX.current - touchStartX.current > 100) {
        setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
        isTouchMove.current = false;
        return;
      }

      if (touchEndX.current - touchStartX.current < -100) {
        setCurrentIndex((index) => (index + 1 >= photoEffects.length ? index : index + 1));
        isTouchMove.current = false;
        return;
      }
    }

    setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, effect: effect } }));
  };

  const handleOnMoveTogglePhoto = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!checkIsTouch(event, isTouchMoveTogglePhoto)) return;

    isTouchMove.current = true;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleOnTouchChangeCurrentIndex = (event: React.TouchEvent<HTMLDivElement>, newIndex: number) => {
    if (!checkIsTouch(event, isTouchChangeCurrentIndex)) return;

    playSoundTouch(false);
    setCurrentIndex(newIndex);
  };

  const handleConvertCanvasToBase64 = async (
    pathImageEffect: string,
    pathFrame: string,
    effectStyle: string,
    width: number,
    height: number,
  ) => {
    const results = await Promise.all([loadImage(pathImageEffect), loadImage(pathFrame)]);
    const [elementImageEffect, elementFrame] = results;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.filter = effectStyle;
    context.drawImage(elementImageEffect, 0, 0, width, height);
    context.filter = 'none';
    context.drawImage(elementFrame, 0, 0, width, height);
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    if (!checkIsTouch(event, isTouchNextPage)) return;

    playSoundTouch(false);
    const base64String = await handleConvertCanvasToBase64(
      store.orderInfo.imageSelectPhoto,
      store.pathFolderAssets + store.orderInfo.frameRelPath,
      store.orderInfo.effect.style,
      store.orderInfo.width,
      store.orderInfo.height,
    );

    setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, imageSelectEffect: base64String } }));
    setTimeout(() => {
      navigate('/select-sticker');
    }, 500);
  };

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

              <div className='absolute left-0 top-[35px] flex w-full items-center justify-center text-[30px] text-custom-style-1'>
                <span>{store.orderInfo.effect.name}</span>
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

            <div
              className='flex -translate-y-4 items-center justify-center'
              style={{ height: `${store.orderInfo.height / 2.8}px`, width: `${store.orderInfo.width / 2.8}px` }}
            >
              <div className='relative mt-3 flex h-full w-full items-center justify-center'>
                <div
                  className='absolute inset-0'
                  style={{
                    filter: store.orderInfo.effect.style,
                  }}
                >
                  <DisplayImage src={store.orderInfo.imageSelectPhoto} />
                </div>

                <div className='absolute inset-0'>
                  <DisplayImage src={store.pathFolderAssets + store.orderInfo.frameRelPath} />
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

                <div className='absolute left-[230px] top-[29px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span>Select Your </span>
                  <span className='text-custom-style-2-1'>Effect</span>
                </div>
              </div>

              <div className='mb-3'>
                <Countdown
                  url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
                  time={90}
                  routeGoToBack='/select-photos'
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
                      {photoEffects?.map((effect, index) => {
                        return (
                          <div
                            key={index}
                            className='grid h-full min-w-full grid-cols-3 content-start justify-items-center gap-x-6 gap-y-20 transition-transform duration-300'
                            style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
                          >
                            {effect?.map((eff, index) => {
                              return (
                                <div
                                  key={index}
                                  className='w-[270px relative h-[180px]'
                                  onTouchEnd={(event) => handleOnTouchEndTogglePhoto(event, eff)}
                                  // onMouseUp={(event) => handleOnTouchEndTogglePhoto(event, eff)}
                                  onTouchMove={(event) => handleOnMoveTogglePhoto(event)}
                                >
                                  {store.orderInfo.effect.name === eff.name ? (
                                    <div className='relative h-full w-full'>
                                      <div
                                        className={`absolute -top-[32px] left-1/2 h-[30.8px] w-[34.8px] -translate-x-1/2`}
                                      >
                                        <DisplayImage
                                          src={store.pathFolderAssets + store.resources.icons[43]?.relPath}
                                        />
                                      </div>

                                      <div className='h-full w-full rounded-lg border-4 border-dashed border-custom-style-2-1 p-1'>
                                        <div className='${eff.className} h-full w-full' style={{ filter: eff.style }}>
                                          <DisplayImage
                                            src={store.pathFolderUserPhotos + store.orderInfo.selectedPhotos[0]}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className='h-full w-full' style={{ filter: eff.style }}>
                                      <DisplayImage
                                        src={store.pathFolderUserPhotos + store.orderInfo.selectedPhotos[0]}
                                      />
                                    </div>
                                  )}

                                  <div className='absolute -bottom-8 left-0 right-0 select-none text-center font-rokkitt text-[18px]'>
                                    <span>{eff.name}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    <div className='flex h-[75px] w-full items-center justify-center gap-x-4'>
                      {[...Array(photoEffects.length)]
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
                              // onMouseDown={(event) => handleOnTouchChangeCurrentIndex(event, index)}
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
                    // onMouseDown={(event) => handleOnTouchStartPrev(event)}
                  >
                    <div className='h-full w-full'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[42]?.relPath} />
                    </div>
                  </div>

                  <div
                    className='absolute right-[27px] top-[260px] h-[50px] w-[50px] p-1'
                    onTouchStart={(event) => handleOnTouchStartNext(event)}
                    // onMouseDown={(event) => handleOnTouchStartNext(event)}
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
                <span>※ Slide to see more effects</span>
              </div>
              <div className='h-[30px] min-w-max'>
                <span>※ To deselect, touch the effect you want to cancel</span>
              </div>
            </div>
          </div>

          <div
            className='flex h-full w-[200px] items-center justify-center'
            onTouchStart={(event) => handleOnTouchStartNextPage(event)}
            // onMouseDown={(event) => handleOnTouchStartNextPage(event)}
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
