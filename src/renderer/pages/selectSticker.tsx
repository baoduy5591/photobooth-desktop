import React, { useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_FRAME_POSITIONS, CONST_LIST_TAB_STICKER, CONST_SCALE_PHOTOS, CONST_THRESHOLD } from '../libs/constants';
import { Countdown } from '../components/countdown';
import {
  allowWithQuantityTouches,
  getPositionByFrameModeAndFrameType,
  getPositionForQrCodeByFrameModeAndFrameType,
  loadImage,
  randomRangeValue,
} from '../libs/common';
import { useNavigate } from 'react-router-dom';
import { INIT_STORE } from '../libs/initials';
import { useSound } from '../context/sound';
import { Stickers } from '../components/stickers';

export default function SelectSticker() {
  const { store, setStore } = useStore();
  const { playSoundTouch } = useSound();
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const [currentChooseStickerIndex, setCurrentChooseStickerIndex] = useState<number>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageQRTest, setImageQRTest] = useState<string>('');

  const isTouchMoveScroll = useRef<boolean>(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const currentAngle = useRef<number>(0);
  const rotatePositionY = useRef<number>(0);
  const isChooseStickerByIndex = useRef<boolean>(false);
  const _selectedSticker = useRef<StickerPositionType[]>([]);

  const navigate = useNavigate();

  const itemsSticker =
    store.resources.stickers[
      CONST_LIST_TAB_STICKER[currentTabIndex].toLowerCase() as keyof typeof INIT_STORE.resources.stickers
    ];

  const handleOnTouchMoveScrollPhotos = () => {
    isTouchMoveScroll.current = true;
  };

  const handleOnTouchEndScrollPhotos = () => {
    isTouchMoveScroll.current = false;
  };

  const handleOnTouchEndChooseSticker = (event: React.TouchEvent<HTMLDivElement>, sticker: PathResourceType) => {
    if (
      !allowWithQuantityTouches(Array.from(event.touches), 1) ||
      isChooseStickerByIndex.current ||
      isTouchMoveScroll.current
    )
      return;

    playSoundTouch(false);
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: [
          ...prevStore.orderInfo.stickers,
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
        ],
      },
    }));

    _selectedSticker.current = [
      ..._selectedSticker.current,
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
    ];

    setCurrentChooseStickerIndex(_selectedSticker.current.length);
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
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
          if (index === _index) {
            return { ...sticker, offsetX, offsetY, currentPageX: pageX, currentPageY: pageY };
          }

          return sticker;
        }),
      },
    }));

    _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
      if (index === _index) {
        return { ...sticker, offsetX, offsetY, currentPageX: pageX, currentPageY: pageY };
      }

      return sticker;
    });

    setCurrentChooseStickerIndex(index);
  };

  const handleOnTouchMoveChooseStickerByIndex = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    const touch = event.touches[0];
    const { pageX, pageY } = touch;

    // check move is valid
    const deltaX = pageX - _selectedSticker.current[index].currentPageX;
    const deltaY = pageY - _selectedSticker.current[index].currentPageY;
    if (Math.abs(deltaX) < CONST_THRESHOLD && Math.abs(deltaY) < CONST_THRESHOLD) return;

    const frameRect = frameRef.current.getBoundingClientRect();
    if (!frameRect) return;

    const sticker = _selectedSticker.current[index];
    const newX = pageX - frameRect.x - sticker.offsetX;
    const newY = pageY - frameRect.y - sticker.offsetY;
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
          if (index === _index) {
            return { ...sticker, top: newY, left: newX, currentPageX: pageX, currentPageY: pageY };
          }

          return sticker;
        }),
      },
    }));

    _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
      if (index === _index) {
        return { ...sticker, top: newY, left: newX, currentPageX: pageX, currentPageY: pageY };
      }

      return sticker;
    });
  };

  const handleOnTouchEndChooseStickerByIndex = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    isChooseStickerByIndex.current = false;
  };

  const handleOnTouchStartChangeTab = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    setCurrentTabIndex(index);
  };

  const handleOnTouchStartRotate = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    isChooseStickerByIndex.current = true;
    playSoundTouch(false);
    const { pageX, pageY } = event.touches[0];
    rotatePositionY.current = pageY;
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
          if (index === _index) {
            return { ...sticker, currentPageX: pageX, currentPageY: pageY };
          }

          return sticker;
        }),
      },
    }));

    _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
      if (index === _index) {
        return { ...sticker, currentPageX: pageX, currentPageY: pageY };
      }

      return sticker;
    });
  };

  const handleOnTouchMoveRotate = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    const { pageX, pageY } = event.touches[0];
    const sticker = _selectedSticker.current[index];
    const newPageY = rotatePositionY.current + sticker.height;
    const angle = Math.atan2(pageY - newPageY, pageX - sticker.currentPageX) * (180 / Math.PI);
    if (Math.abs(angle - currentAngle.current) < CONST_THRESHOLD) return;

    if (angle - currentAngle.current > 0) {
      setStore((prevStore) => ({
        ...prevStore,
        orderInfo: {
          ...prevStore.orderInfo,
          stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
            if (index === _index) {
              return { ...sticker, rotate: sticker.rotate + 10 };
            }

            return sticker;
          }),
        },
      }));

      _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, rotate: sticker.rotate + 10 };
        }

        return sticker;
      });
    } else {
      setStore((prevStore) => ({
        ...prevStore,
        orderInfo: {
          ...prevStore.orderInfo,
          stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
            if (index === _index) {
              return { ...sticker, rotate: sticker.rotate - 10 };
            }

            return sticker;
          }),
        },
      }));

      _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, rotate: sticker.rotate - 10 };
        }

        return sticker;
      });
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
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
          if (index === _index) {
            return { ...sticker, currentPageX: pageX, currentPageY: pageY };
          }

          return sticker;
        }),
      },
    }));

    _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
      if (index === _index) {
        return { ...sticker, currentPageX: pageX, currentPageY: pageY };
      }

      return sticker;
    });
  };
  const handleOnTouchMoveZoom = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    const { pageX, pageY } = event.touches[0];
    const deltaX = pageX - _selectedSticker.current[index].currentPageX;
    const deltaY = pageY - _selectedSticker.current[index].currentPageY;
    if (Math.abs(deltaX) < CONST_THRESHOLD || Math.abs(deltaY) < CONST_THRESHOLD) return;

    const average = (deltaX + deltaY) / 2;
    const newWidth = _selectedSticker.current[index].width + average;
    const newHeight = _selectedSticker.current[index].height + average;
    if (newWidth < 20 || newWidth > 350) return;

    if (newHeight < 20 || newHeight > 350) return;

    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: prevStore.orderInfo.stickers.map((sticker, _index) => {
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
      },
    }));

    _selectedSticker.current = _selectedSticker.current.map((sticker, _index) => {
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
    });
  };

  const handleOnTouchEndZoom = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    isChooseStickerByIndex.current = false;
  };

  const handleOnTouchStartCancel = (event: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    event.stopPropagation();
    playSoundTouch(false);
    const newSelectedSticker = _selectedSticker.current.filter((sticker, _index) => _index !== index);
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        stickers: newSelectedSticker,
      },
    }));

    _selectedSticker.current = newSelectedSticker;
    setCurrentChooseStickerIndex(null);
  };

  const handleOnTouchStartCheckOutsideSticker = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    const stickerElement = stickerRef.current;
    if (stickerElement && !stickerElement.contains(event.target as Node)) {
      setCurrentChooseStickerIndex(null);
    }
  };

  const convertStickersAndFrameToBase64 = async (
    framePath: string,
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
    const listPromiseSticker = selectedSticker.map((sticker) => loadImage(store.assetsFolderPath + sticker.relPath));
    const results = await Promise.all([loadImage(framePath), ...listPromiseSticker]);
    const elementImageEffect = results[0];
    const elementStickers = results.slice(1, results.length);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(elementImageEffect, 0, 0, width, height);
    elementStickers.forEach((elementSticker, index) => {
      const x = selectedSticker[index].left * CONST_SCALE_PHOTOS + 24 * CONST_SCALE_PHOTOS; // 24 equal p-6, which distant from parent to icon
      const y = selectedSticker[index].top * CONST_SCALE_PHOTOS + 24 * CONST_SCALE_PHOTOS; // / 24 equal p-6, which distant from parent to icon
      const w = selectedSticker[index].width * CONST_SCALE_PHOTOS;
      const h = selectedSticker[index].height * CONST_SCALE_PHOTOS;
      const angleInRadians = (selectedSticker[index].rotate * Math.PI) / 180;
      context.save();
      context.translate(x + w / 2, y + h / 2);
      context.rotate(angleInRadians);
      context.drawImage(elementSticker, -w / 2, -h / 2, w, h);
      context.restore();
    });
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const mergeAllImagesSequentiallyNoQR = async (
    imageSelectEffect: string,
    imageStickerAndFrameBase64: string,
    width: number,
    height: number,
  ) => {
    const promises = [loadImage(imageSelectEffect), loadImage(imageStickerAndFrameBase64)];
    const results = await Promise.all(promises);
    const [effectImageElement, stickerAndFrameElement] = results;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(effectImageElement, 0, 0, width, height);
    context.drawImage(stickerAndFrameElement, 0, 0, width, height);
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const insertQrToImage = async (
    colorBase64NoQR: string,
    qrImage: string,
    width: number,
    height: number,
    qrPosition: { x: number; y: number; w: number; h: number },
  ) => {
    const promises = [loadImage(colorBase64NoQR), loadImage(qrImage)];
    const results = await Promise.all(promises);
    const [elementColorBase64, elementQr] = results;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(elementColorBase64, 0, 0, width, height);
    const { x, y, w, h } = qrPosition;
    context.drawImage(elementQr, x, y, w, h);
    const base64String = canvas.toDataURL('image/png');
    return base64String;
  };

  const processComplete = async () => {
    const { imageSelectEffect, frameRelPath, width, height, frameMode, frameType, selectedPhotos, effect } =
      store.orderInfo;
    const imageStickerAndFrameBase64 = await convertStickersAndFrameToBase64(
      store.assetsFolderPath + frameRelPath,
      _selectedSticker.current,
      store.orderInfo.width,
      store.orderInfo.height,
    );

    const _mergeAllImagesSequentiallyNoQR = await mergeAllImagesSequentiallyNoQR(
      imageSelectEffect,
      imageStickerAndFrameBase64,
      width,
      height,
    );

    const _saveImageFrameSticker = await window.api.saveImageFrameSticker(imageStickerAndFrameBase64);
    if (!_saveImageFrameSticker) {
      alert(
        'Save frame sticker image failed, please check the printer or contact the technical department. We apologize for the inconvenience !!!',
      );
      return false;
    }

    const _getQRCode = await window.api.getQRCode(store.orderInfo._id);
    if (!_getQRCode) {
      alert('Get QR Code failed !!!');
      return false;
    }

    const qrPosition = getPositionForQrCodeByFrameModeAndFrameType(frameMode, frameType);
    const colorBase64 = await insertQrToImage(_mergeAllImagesSequentiallyNoQR, _getQRCode, width, height, qrPosition);
    setImageQRTest(colorBase64); // delete after test

    const positions = getPositionByFrameModeAndFrameType(CONST_FRAME_POSITIONS, frameMode, frameType);
    const data = {
      frameMode: frameMode,
      frameWidth: width,
      frameHeight: height,
      photos: selectedPhotos,
      effectName: effect.name,
      positions: positions,
    };
    const generateVideo = await window.api.generateVideo(data);
    if (!generateVideo) {
      alert(
        'Save video failed, please check the printer or contact the technical department. We apologize for the inconvenience !!!',
      );
      return false;
    }

    store.orderInfo['colorBase64'] = colorBase64;
    store.orderInfo['colorBase64NoQR'] = _mergeAllImagesSequentiallyNoQR;
    store.orderInfo['videoBase64'] = generateVideo;
    const _saveImage = await window.api.saveImage({ orderInfo: store.orderInfo });
    if (!_saveImage) {
      alert(
        'Printer failed, please check the printer or contact the technical department. We apologize for the inconvenience !!!',
      );
      return false;
    }

    return true;
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    playSoundTouch(false);
    const _processComplete = await processComplete();
    if (!_processComplete) return false;

    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: { ...prevStore.orderInfo, ...INIT_STORE.orderInfo },
    }));

    navigate('/complete');
  };

  const handleTimeout = async () => {
    setIsLoading(true);
    const _processComplete = await processComplete();
    if (!_processComplete) return false;

    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: { ...prevStore.orderInfo, ...INIT_STORE.orderInfo },
    }));

    navigate('/complete');
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.assetsFolderPath + store.resources.backgroundImages[1]?.relPath} />
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-custom-style-1 font-rokkitt text-4xl font-semibold opacity-80'>
          <span className='animate-opacity-slow-infinite'>Please wait some minute . . .</span>
        </div>
      )}

      <div className='absolute inset-0 py-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[650px] flex-col items-center justify-center'>
            <div className='flex items-center justify-center'>
              <div className='z-20 h-[80.1px] w-[103.2px] translate-x-5 -rotate-6'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
              </div>

              <div className='z-10 h-[80.1px] w-[103.2px]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
              </div>

              <div className='h-[80.1px] w-[103.2px] -translate-x-4 rotate-12'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
              </div>
            </div>
            <div
              className='z-30 flex h-[800px] min-w-[545px] -translate-y-4 items-center justify-center rounded-3xl border-2 border-dashed border-custom-style-2-1 bg-custom-style-1 p-1'
              onTouchStart={(event) => handleOnTouchStartCheckOutsideSticker(event)}
            >
              <div
                ref={frameRef}
                className='relative flex items-center justify-center border-2 border-custom-style-3-1'
                style={{
                  height: `${store.orderInfo.height / CONST_SCALE_PHOTOS}px`,
                  width: `${store.orderInfo.width / CONST_SCALE_PHOTOS}px`,
                }}
              >
                <div className='h-full w-full'>
                  <DisplayImage src={store.orderInfo.imageSelectEffect} />
                </div>

                <div className='absolute inset-0'>
                  <DisplayImage src={store.assetsFolderPath + store.orderInfo.frameRelPath} />
                </div>

                {_selectedSticker.current?.map((sticker, index) => {
                  return (
                    <div
                      key={index}
                      className={`absolute z-40 flex items-center justify-center rounded-md border-2 p-6 ${currentChooseStickerIndex === index ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                      style={{
                        top: `${sticker.top}px`,
                        left: `${sticker.left}px`,
                      }}
                      onTouchStart={(event) => handleOnTouchStartChooseStickerByIndex(event, index)}
                      onTouchMove={(event) => handleOnTouchMoveChooseStickerByIndex(event, index)}
                      onTouchEnd={(event) => handleOnTouchEndChooseStickerByIndex(event)}
                    >
                      <div
                        ref={stickerRef}
                        style={{
                          width: `${sticker.width}px`,
                          height: `${sticker.height}px`,
                        }}
                      >
                        <div
                          className='h-full w-full'
                          style={{ transform: `rotate(${sticker.rotate}deg)`, transition: 'transform 0.1s linear' }}
                        >
                          <DisplayImage src={store.assetsFolderPath + sticker.relPath} />
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
                              <DisplayImage src={store.assetsFolderPath + store.resources.icons[56]?.relPath} />
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
                            <DisplayImage src={store.assetsFolderPath + store.resources.icons[55]?.relPath} />
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -bottom-[22px] -right-[26px] h-[55px] w-[55px] p-2'
                          onTouchStart={(event) => handleOnTouchStartZoom(event, index)}
                          onTouchMove={(event) => handleOnTouchMoveZoom(event, index)}
                          onTouchEnd={(event) => handleOnTouchEndZoom(event)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.assetsFolderPath + store.resources.icons[54]?.relPath} />
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
                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[39]?.relPath} />
                </div>

                <div className='absolute left-[180px] top-[26px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span className='text-custom-style-2-1'>Decorate </span>
                  <span>Your Photo More</span>
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
              <div className='flex h-full w-full flex-col items-center justify-center px-4'>
                <div className='my-4 h-[22px] w-[140px] rounded-full bg-custom-style-1'></div>

                <div className='h-full w-full flex-1 overflow-hidden bg-custom-style-1'>
                  <div className='relative flex h-12 items-center justify-start bg-custom-style-1 text-center font-rokkitt text-[16px]'>
                    <div
                      className={`polygon-tab flex h-full min-w-[210px] -translate-x-[16px] justify-center gap-x-2 p-0.5 ${currentTabIndex === 0 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                      onTouchStart={(event) => handleOnTouchStartChangeTab(event, 0)}
                    >
                      <div className='h-[17px] w-[12px]'>
                        <DisplayImage src={store.assetsFolderPath + store.resources.icons[44]?.relPath} />
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

                    <div className='absolute bottom-0 left-0 right-0 h-[12px] bg-custom-style-2-2'></div>
                  </div>

                  <div
                    className='custom-scroll-bar visible-scroll-bar custom-scroll-bar-thumb custom-scroll-bar-hidden-button h-full w-full overflow-x-hidden overflow-y-scroll rounded-xl bg-custom-style-1'
                    onTouchEnd={handleOnTouchEndScrollPhotos}
                    onTouchMove={handleOnTouchMoveScrollPhotos}
                  >
                    <Stickers
                      itemsSticker={itemsSticker}
                      handleOnTouchEndChooseSticker={handleOnTouchEndChooseSticker}
                    />
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
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[38]?.relPath} />
            </div>
          </div>
        </div>
      </div>

      {imageQRTest && (
        <div style={{ width: `${store.orderInfo.width / 2}px`, height: `${store.orderInfo.height / 2}px` }}>
          <DisplayImage src={imageQRTest} />
        </div>
      )}
    </div>
  );
}
