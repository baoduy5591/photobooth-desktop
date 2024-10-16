import React, { ReactNode, useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_LIST_TAB_STICKER, CONST_RATIO_SCALE, CONST_THRESHOLD } from '../libs/constants';
import { Countdown } from '../components/countdown';
import { allowWithQuantityTouches, loadImage, randomRangeValue } from '../libs/common';
import { useNavigate } from 'react-router-dom';
import { INIT_STORE } from '../libs/initials';
import { useSound } from '../context/sound';
import { Stickers } from '../components/stickers';

export default function SelectSticker() {
  const { store, setStore } = useStore();
  const { playSoundTouch } = useSound();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedSticker, setSelectedSticker] = useState<
    (PathResourceType & {
      top: number;
      left: number;
      offsetX: number;
      offsetY: number;
      currentPageX: number;
      currentPageY: number;
      width: number;
      height: number;
      rotate: number;
    })[]
  >([]);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [currentChooseStickerIndex, setCurrentChooseStickerIndex] = useState<number>(null);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isTouchMove = useRef<boolean>(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const currentAngle = useRef<number>(0);
  const rotatePositionY = useRef<number>(0);
  const isChooseStickerByIndex = useRef<boolean>(false);

  const navigate = useNavigate();

  const chunkItemSticker = (items: PathResourceType[], size: number) => {
    const _list = [];
    const _length = items.length;
    for (let i = 0; i < _length; i += size) {
      _list.push(items.slice(i, i + size));
    }
    return _list;
  };

  const itemsSticker = chunkItemSticker(
    store.resources.stickers[
      CONST_LIST_TAB_STICKER[currentTabIndex].toLowerCase() as keyof typeof INIT_STORE.resources.stickers
    ],
    24,
  );

  const handleOnTouchStartPrev = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
  };

  const handleOnTouchStartNext = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    setCurrentIndex((index) => (index + 1 >= itemsSticker.length ? index : index + 1));
  };

  const handleOnTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    touchStartX.current = event.touches[0].clientX;
  };

  const handleOnTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    isTouchMove.current = true;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleOnTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    if (!isTouchMove.current) return;

    if (touchEndX.current - touchStartX.current > 100) {
      setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
    } else if (touchEndX.current - touchStartX.current < -100) {
      setCurrentIndex((index) => (index + 1 >= itemsSticker.length ? index : index + 1));
    }

    isTouchMove.current = false;
  };

  const handleOnTouchChangeCurrentIndex = (event: React.TouchEvent<HTMLDivElement>, newIndex: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    setCurrentIndex(newIndex);
  };

  const handleOnTouchEndChooseSticker = (event: React.TouchEvent<HTMLDivElement>, sticker: PathResourceType) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1) || isChooseStickerByIndex.current) return;

    playSoundTouch(false);
    if (isTouchMove.current) return;

    setSelectedSticker((prevSticker) => [
      ...prevSticker,
      {
        ...sticker,
        top: randomRangeValue(0, 50),
        left: randomRangeValue(0, 50),
        offsetX: 0,
        offsetY: 0,
        currentPageX: 0,
        currentPageY: 0,
        width: 160,
        height: 160,
        rotate: 0,
      },
    ]);

    setCurrentChooseStickerIndex(selectedSticker.length);
  };

  const handleOnTouchStartChooseStickerByIndex = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    isChooseStickerByIndex.current = true;
    playSoundTouch(false);
    const touch = event.touches[0];
    const { pageX, pageY } = touch;

    const stickerRect = event.currentTarget.getBoundingClientRect();
    const offsetX = pageX - stickerRect.left;
    const offsetY = pageY - stickerRect.top;
    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, offsetX, offsetY, currentPageX: pageX, currentPageY: pageY };
        }
        return sticker;
      }),
    );
    setCurrentChooseStickerIndex(index);
  };

  const handleOnTouchMoveChooseStickerByIndex = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    const touch = event.touches[0];
    const { pageX, pageY } = touch;

    // check move is valid
    const deltaX = pageX - selectedSticker[index].currentPageX;
    const deltaY = pageY - selectedSticker[index].currentPageY;
    if (Math.abs(deltaX) < CONST_THRESHOLD && Math.abs(deltaY) < CONST_THRESHOLD) return;

    const frameRect = frameRef.current.getBoundingClientRect();
    if (!frameRect) return;

    const sticker = selectedSticker[index];
    const newX = pageX - frameRect.x - sticker.offsetX;
    const newY = pageY - frameRect.y - sticker.offsetY;
    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, top: newY, left: newX, currentPageX: pageX, currentPageY: pageY };
        }
        return sticker;
      }),
    );
  };

  const handleOnTouchEndChooseStickerByIndex = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    isChooseStickerByIndex.current = false;
  };

  const handleOnTouchStartChangeTab = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    setCurrentIndex(0);
    setCurrentTabIndex(index);
  };

  const handleOnTouchStartRotate = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    isChooseStickerByIndex.current = true;
    playSoundTouch(false);
    const { pageX, pageY } = event.touches[0];
    rotatePositionY.current = pageY;
    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, currentPageX: pageX, currentPageY: pageY };
        }
        return sticker;
      }),
    );
  };

  const checkDeltaValid = (deltaX: number, deltaY: number) => {
    if (deltaX === 0 || deltaY === 0) return false;

    return true;
  };

  const handleOnTouchMoveRotate = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    const { pageX, pageY } = event.touches[0];
    const sticker = selectedSticker[index];
    const newPageY = rotatePositionY.current + sticker.height;
    const angle = Math.atan2(pageY - newPageY, pageX - sticker.currentPageX) * (180 / Math.PI);
    if (Math.abs(angle - currentAngle.current) < CONST_THRESHOLD) return;

    if (angle - currentAngle.current > 0) {
      setSelectedSticker((prevSticker) =>
        prevSticker.map((sticker, _index) => {
          if (index === _index) {
            return { ...sticker, rotate: sticker.rotate + 10 };
          }
          return sticker;
        }),
      );
    } else {
      setSelectedSticker((prevSticker) =>
        prevSticker.map((sticker, _index) => {
          if (index === _index) {
            return { ...sticker, rotate: sticker.rotate - 10 };
          }
          return sticker;
        }),
      );
    }

    currentAngle.current = angle;
  };

  const handleTouchEndRotate = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    isChooseStickerByIndex.current = false;
  };

  const handleOnTouchStartZoom = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    isChooseStickerByIndex.current = true;
    const { pageX, pageY } = event.touches[0];
    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, currentPageX: pageX, currentPageY: pageY };
        }
        return sticker;
      }),
    );
  };
  const handleOnTouchMoveZoom = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    const { pageX, pageY } = event.touches[0];
    const deltaX = pageX - selectedSticker[index].currentPageX;
    const deltaY = pageY - selectedSticker[index].currentPageY;
    if (Math.abs(deltaX) < CONST_THRESHOLD || Math.abs(deltaY) < CONST_THRESHOLD) return;

    const average = (deltaX + deltaY) / 2;
    const newWidth = selectedSticker[index].width + average;
    const newHeight = selectedSticker[index].height + average;
    if (newWidth < 75 || newWidth > 350) return;

    if (newHeight < 75 || newHeight > 350) return;

    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return {
            ...sticker,
            currentPageX: pageX,
            currentPageY: pageY,
            width: sticker.width + average,
            height: sticker.height + average,
          };
        }
        return sticker;
      }),
    );
  };

  const handleOnTouchEndZoom = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    isChooseStickerByIndex.current = false;
  };

  const handleOnTouchStartCancel = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    playSoundTouch(false);
    const newSelectedSticker = selectedSticker.filter((sticker, _index) => _index !== index);
    setSelectedSticker(newSelectedSticker);
    setCurrentChooseStickerIndex(null);
  };

  const handleConvertCanvasToBase64 = async (
    pathImageEffect: string,
    selectedSticker: (PathResourceType & {
      top: number;
      left: number;
      offsetX: number;
      offsetY: number;
      currentPageX: number;
      currentPageY: number;
      width: number;
      height: number;
      rotate: number;
    })[],
    width: number,
    height: number,
  ) => {
    const listPromiseSticker = selectedSticker.map((sticker) => loadImage(store.pathFolderAssets + sticker.relPath));
    const results = await Promise.all([loadImage(pathImageEffect), ...listPromiseSticker]);
    const elementImageEffect = results[0];
    const elementStickers = results.slice(1, results.length);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(elementImageEffect, 0, 0, width, height);
    elementStickers.forEach((elementSticker, index) => {
      const x = selectedSticker[index].left * 2.8;
      const y = selectedSticker[index].top * 2.8;
      const w = selectedSticker[index].width * 2.8;
      const h = selectedSticker[index].height * 2.8;
      const angleInRadians = (selectedSticker[index].rotate * Math.PI) / 180;
      console.log(x, y, w, h);
      context.save();
      context.translate(x + w / 2, y + h / 2);
      context.rotate(angleInRadians);
      context.drawImage(elementSticker, -w / 2, -h / 2, w, h);
      context.restore();
    });
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const handleOnTouchStartCheckOutsideSticker = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    const stickerElement = stickerRef.current;

    if (stickerElement && !stickerElement.contains(event.target as Node)) {
      setCurrentChooseStickerIndex(null);
    }
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    const imageBase64 = await handleConvertCanvasToBase64(
      store.orderInfo.imageSelectEffect,
      selectedSticker,
      store.orderInfo.width,
      store.orderInfo.height,
    );

    const savePhoto = await window.api.saveImage({ imageBase64, orderInfo: store.orderInfo });
    if (savePhoto) {
      // reset store
      setStore((prevStore) => ({
        ...prevStore,
        shootingMethod: '',
        shootingTime: 10,
        orderInfo: {
          ...prevStore.orderInfo,
          imageSelectEffect: '',
          imageSelectPhoto: '',
          imageSelectSticker: '',
          frameMode: '',
          frameType: '',
          quantityShootingPhotos: null,
          quantitySelectedPhotos: null,
          selectedPhotos: [],
          frameRelPath: '',
          effect: { ...prevStore.orderInfo.effect, name: 'Original', className: '', style: '' },
        },
      }));
      // navigate('/complete');
    }
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute inset-0 py-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[650px] flex-col items-center justify-center'>
            <div className='flex items-center justify-center'>
              <div className='z-20 h-[80.1px] w-[103.2px] translate-x-5 -rotate-6'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>

              <div className='z-10 h-[80.1px] w-[103.2px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
              </div>

              <div className='h-[80.1px] w-[103.2px] -translate-x-4 rotate-12'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
              </div>
            </div>
            <div
              className='z-30 flex h-[800px] min-w-[545px] -translate-y-4 items-center justify-center rounded-3xl border-2 border-dashed border-custom-style-2-1 bg-custom-style-1 p-1'
              onTouchStart={(event) => handleOnTouchStartCheckOutsideSticker(event)}
            >
              <div
                ref={frameRef}
                className='relative flex items-center justify-center border-2 border-custom-style-3-1'
                style={{ height: `${store.orderInfo.height / 2.8}px`, width: `${store.orderInfo.width / 2.8}px` }}
              >
                <div className='h-full w-full'>
                  <DisplayImage src={store.orderInfo.imageSelectEffect} />
                </div>

                {selectedSticker?.map((sticker, index) => {
                  return (
                    <div
                      className={`absolute z-40 flex items-center justify-center rounded-md border-2 p-6 ${currentChooseStickerIndex === index ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                      onTouchStart={(event) => handleOnTouchStartChooseStickerByIndex(event, index)}
                      onTouchMove={(event) => handleOnTouchMoveChooseStickerByIndex(event, index)}
                      onTouchEnd={(event) => handleOnTouchEndChooseStickerByIndex(event)}
                    >
                      <div
                        ref={stickerRef}
                        key={index}
                        style={{
                          top: `${sticker.top}px`,
                          left: `${sticker.left}px`,
                          width: `${sticker.width}px`,
                          height: `${sticker.height}px`,
                        }}
                      >
                        <div
                          className='h-full w-full'
                          style={{ transform: `rotate(${sticker.rotate}deg)`, transition: 'transform 0.1s linear' }}
                        >
                          <DisplayImage src={store.pathFolderAssets + sticker.relPath} />
                        </div>
                      </div>

                      {currentChooseStickerIndex === index && (
                        <div className='absolute -top-[52px] left-1/2 h-12 border-l-2 border-dashed border-custom-style-2-1'>
                          <div
                            className='absolute -left-[31px] -top-[54px] h-[60px] w-[60px] p-2'
                            onTouchStart={(event) => handleOnTouchStartRotate(event, index)}
                            onTouchMove={(event) => handleOnTouchMoveRotate(event, index)}
                            onTouchEnd={(event) => handleTouchEndRotate(event)}
                          >
                            <div className='h-full w-full rounded-full bg-custom-style-1'>
                              <DisplayImage src={store.pathFolderAssets + store.resources.icons[56]?.relPath} />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -right-[28px] -top-[24px] h-[60px] w-[60px] p-3'
                          onTouchStart={(event) => handleOnTouchStartCancel(event, index)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[55]?.relPath} />
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -bottom-[24px] -right-[28px] h-[60px] w-[60px] p-2'
                          onTouchStart={(event) => handleOnTouchStartZoom(event, index)}
                          onTouchMove={(event) => handleOnTouchMoveZoom(event, index)}
                          onTouchEnd={(event) => handleOnTouchEndZoom(event)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[54]?.relPath} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='relative flex h-full grow flex-col items-center justify-center gap-y-8'>
            <div className='flex w-full items-center justify-end gap-x-6 px-10'>
              <div className='relative h-[99.5px] w-[668.7px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[39]?.relPath} />
                </div>

                <div className='absolute left-[180px] top-[26px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span className='text-custom-style-2-1'>Decorate </span>
                  <span>Your Photo More</span>
                </div>
              </div>

              <div className='mb-3'>
                <Countdown
                  url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
                  time={999}
                  routeGoToBack='/select-photos'
                />
              </div>
            </div>

            <div className='z-10 h-[750.4px] w-[1041.6px] rounded-xl bg-custom-style-3-1'>
              <div className='flex h-full w-full flex-col items-center justify-center'>
                <div className='my-4 h-[22px] w-[140px] rounded-full bg-custom-style-1'></div>
                <div className='relative h-full w-full px-6'>
                  <div
                    className='relative flex h-full w-full flex-col items-center justify-between bg-custom-style-1 px-10'
                    onTouchStart={(event) => handleOnTouchStart(event)}
                    onTouchMove={(event) => handleOnTouchMove(event)}
                    onTouchEnd={(event) => handleOnTouchEnd(event)}
                  >
                    <div className='absolute left-0 right-0 top-0 h-[40px] overflow-hidden'>
                      <div className='flex h-full w-full items-center justify-start text-center font-rokkitt text-[16px]'>
                        <div
                          className={`polygon-tab flex h-full min-w-[210px] -translate-x-[16px] justify-center gap-x-2 p-0.5 ${currentTabIndex === 0 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 0)}
                        >
                          <div className='h-[17px] w-[12px]'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[44]?.relPath} />
                          </div>
                          <span>{CONST_LIST_TAB_STICKER[0]}</span>
                        </div>

                        <div
                          className={`polygon-tab h-full min-w-[210px] -translate-x-[44px] p-0.5 ${currentTabIndex === 1 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 1)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[1]}</span>
                        </div>

                        <div
                          className={`polygon-tab h-full min-w-[210px] -translate-x-[72px] p-0.5 ${currentTabIndex === 2 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 2)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[2]}</span>
                        </div>

                        <div
                          className={`polygon-tab h-full min-w-[210px] -translate-x-[100px] p-0.5 ${currentTabIndex === 3 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 3)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[3]}</span>
                        </div>

                        <div
                          className={`polygon-tab h-full min-w-[210px] -translate-x-[128px] p-0.5 ${currentTabIndex === 4 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 4)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[4]}</span>
                        </div>
                      </div>

                      <div className='absolute bottom-0 left-0 right-0 h-[12px] bg-custom-style-2-2'></div>
                    </div>

                    <Stickers
                      itemsSticker={itemsSticker}
                      currentIndex={currentIndex}
                      handleOnTouchEndChooseSticker={handleOnTouchEndChooseSticker}
                    />

                    <div className='absolute bottom-0 flex h-[100px] w-full items-center justify-center gap-x-4'>
                      {[...Array(itemsSticker.length)]
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
                <span>※ Slide to see more sticker</span>
              </div>
              <div className='h-[30px] min-w-max'>
                <span>※ Move the sticker to the position you like</span>
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
