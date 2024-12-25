import React, { useRef } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_LIST_EFFECTS, CONST_MODE_WIDE } from '../libs/constants';
import { allowWithQuantityTouches, loadImage } from '../libs/common';
import { useNavigate } from 'react-router-dom';
import { Countdown } from '../components/countdown';
import { useSound } from '../context/sound';

export default function SelectEffect() {
  const { store, setStore } = useStore();
  const { playSoundTouch } = useSound();

  const isTouchMoveScroll = useRef<boolean>(false);
  const _effect = useRef<{ name: string; className: string; style: string }>(store.orderInfo.effect);

  const navigate = useNavigate();

  const handleOnTouchMoveScrollPhotos = () => {
    isTouchMoveScroll.current = true;
  };

  const handleOnTouchEndScrollPhotos = () => {
    isTouchMoveScroll.current = false;
  };

  const handleOnTouchEndTogglePhoto = (
    event: React.TouchEvent<HTMLDivElement>,
    effect: { name: string; className: string; style: string },
  ) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1) || isTouchMoveScroll.current) return;

    playSoundTouch(false);
    setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, effect: effect } }));
    _effect.current = effect;
  };

  const handleConvertCanvasToBase64 = async (
    pathImageEffect: string,
    effectStyle: string,
    width: number,
    height: number,
  ) => {
    const elementImageEffect = await loadImage(pathImageEffect);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.filter = effectStyle;
    context.drawImage(elementImageEffect, 0, 0, width, height);
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    const base64String = await handleConvertCanvasToBase64(
      store.orderInfo.originalBase64,
      store.orderInfo.effect.style,
      store.orderInfo.width,
      store.orderInfo.height,
    );

    setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, imageSelectEffect: base64String } }));
    setTimeout(() => {
      navigate('/select-sticker');
    }, 500);
  };

  const handleTimeout = () => {
    handleConvertCanvasToBase64(
      store.orderInfo.originalBase64,
      _effect.current.style,
      store.orderInfo.width,
      store.orderInfo.height,
    ).then((base64String) => {
      setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, imageSelectEffect: base64String } }));
      navigate('/select-sticker');
    });
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.assetsFolderPath + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute inset-0 py-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[650px] flex-col items-center justify-center'>
            <div className='relative h-[143.2px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[37]?.relPath} />
              </div>

              <div className='absolute left-0 top-[35px] flex w-full items-center justify-center text-[30px] text-custom-style-1'>
                <span>{store.orderInfo.effect.name}</span>
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
                  <DisplayImage src={store.orderInfo.originalBase64} />
                </div>

                <div className='absolute inset-0 border-2 border-custom-style-3-1'>
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

                <div className='absolute left-[230px] top-[29px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span>Select Your </span>
                  <span className='text-custom-style-2-1'>Effect</span>
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
                      {CONST_LIST_EFFECTS?.map((effect, index) => {
                        return (
                          <div
                            key={index}
                            className='relative mb-6 mt-14'
                            style={{ width: '290px', height: `${290 / store.orderInfo.ratio}px` }}
                            onTouchEnd={(event) => handleOnTouchEndTogglePhoto(event, effect)}
                          >
                            <div className='relative h-full w-full'>
                              {store.orderInfo.effect.name === effect.name && (
                                <div className={`absolute -top-[32px] left-1/2 h-[30.8px] w-[34.8px] -translate-x-1/2`}>
                                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[43]?.relPath} />
                                </div>
                              )}
                              <div
                                className={`h-full w-full rounded-lg border-4 p-1 ${store.orderInfo.effect.name === effect.name ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                              >
                                <div className='${effect.className} h-full w-full' style={{ filter: effect.style }}>
                                  <DisplayImage
                                    src={store.userPhotosFolderPath + store.orderInfo.selectedPhotos[0].photo}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className='absolute -bottom-10 left-1/2 min-w-max -translate-x-1/2 px-2 font-rokkitt text-2xl text-custom-style-6-1 duration-300'>
                              <div
                                style={{
                                  transitionDuration: '0.3s',
                                  transform: `${store.orderInfo.effect.name === effect.name ? 'scale(1.1)' : 'scale(1)'} `,
                                  fontWeight: `${store.orderInfo.effect.name === effect.name ? '700' : '400'} `,
                                }}
                              >
                                {effect.name}
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
                      {CONST_LIST_EFFECTS?.map((effect, index) => {
                        return (
                          <div
                            key={index}
                            className='relative mb-6 mt-14'
                            style={{ width: '450px', height: `${450 / store.orderInfo.ratio}px` }}
                            onTouchEnd={(event) => handleOnTouchEndTogglePhoto(event, effect)}
                          >
                            <div className='relative h-full w-full'>
                              {store.orderInfo.effect.name === effect.name && (
                                <div className={`absolute -top-[32px] left-1/2 h-[30.8px] w-[34.8px] -translate-x-1/2`}>
                                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[43]?.relPath} />
                                </div>
                              )}
                              <div
                                className={`h-full w-full rounded-lg border-4 p-1 ${store.orderInfo.effect.name === effect.name ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                              >
                                <div className='${effect.className} h-full w-full' style={{ filter: effect.style }}>
                                  <DisplayImage
                                    src={store.userPhotosFolderPath + store.orderInfo.selectedPhotos[0].photo}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className='absolute -bottom-10 left-1/2 min-w-max -translate-x-1/2 px-2 font-rokkitt text-2xl text-custom-style-6-1 duration-300'>
                              <div
                                style={{
                                  transitionDuration: '0.3s',
                                  transform: `${store.orderInfo.effect.name === effect.name ? 'scale(1.1)' : 'scale(1)'} `,
                                  fontWeight: `${store.orderInfo.effect.name === effect.name ? '700' : '400'} `,
                                }}
                              >
                                {effect.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className='mb-4 mt-3 min-h-[45px] min-w-[45px] rounded-full bg-custom-style-1 p-1.5'>
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
