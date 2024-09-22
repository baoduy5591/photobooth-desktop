import React, { useEffect, useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_LIST_TAB_STICKER, CONST_MOCK_DATA_FRAME, CONST_RATIO_SCALE, CONST_THRESHOLD } from '../libs/constants';
import { Countdown } from '../components/countdown';
import { checkIsTouch, loadImage } from '../libs/common';
import { useNavigate } from 'react-router-dom';
import { INIT_STORE } from '../libs/initials';

export default function SelectSticker() {
  const { store, setStore } = useStore();
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
  const [enableMoveSticker, setEnableMoveSticker] = useState<boolean>(false);
  const [isTouchControlSticker, setIsTouchControlSticker] = useState<boolean>(false);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isTouchMove = useRef<boolean>(false);
  const isTouchEnd = useRef<boolean>(false);

  const isTouchPrev = useRef<boolean>(false);
  const isTouchNext = useRef<boolean>(false);
  const isTouchChangeCurrentIndex = useRef<boolean>(false);
  const isTouchNextPage = useRef<boolean>(false);
  const isTouchChooseSticker = useRef<boolean>(false);
  const isTouchChangeTab = useRef<boolean>(false);
  const isTouchRotate = useRef<boolean>(false);
  const isTouchApply = useRef<boolean>(false);
  const isTouchCancel = useRef<boolean>(false);
  const isTouchZoomIn = useRef<boolean>(false);
  const isTouchZoomOut = useRef<boolean>(false);

  const isTouchStartSticker = useRef<boolean>(false);
  const isTouchMoveSticker = useRef<boolean>(false);
  const isTouchEndSticker = useRef<boolean>(false);

  const frameRef = useRef<HTMLDivElement>(null);

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

  const handleOnTouchStartPrev = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchPrev)) return;

    setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
  };

  const handleOnTouchStartNext = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchNext)) return;

    setCurrentIndex((index) => (index + 1 >= itemsSticker.length ? index : index + 1));
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
      setCurrentIndex((index) => (index + 1 >= itemsSticker.length ? index : index + 1));
      isTouchMove.current = false;
      return;
    }
  };

  const handleOnTouchChangeCurrentIndex = (event: TouchEventAndMouseEventType, newIndex: number) => {
    if (!checkIsTouch(event, isTouchChangeCurrentIndex)) return;

    setCurrentIndex(newIndex);
  };

  const handleOnTouchEndChooseSticker = (event: TouchEventAndMouseEventType, sticker: PathResourceType) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchChooseSticker)) return;

    if (isTouchMove.current) {
      if (touchEndX.current - touchStartX.current > 100) {
        setCurrentIndex((index) => (index - 1 <= 0 ? 0 : index - 1));
        isTouchMove.current = false;
        return;
      }

      if (touchEndX.current - touchStartX.current < -100) {
        setCurrentIndex((index) => (index + 1 >= itemsSticker.length ? index : index + 1));
        isTouchMove.current = false;
        return;
      }
    }

    setSelectedSticker((prevSticker) => [
      ...prevSticker,
      {
        ...sticker,
        top: 0,
        left: 0,
        offsetX: 0,
        offsetY: 0,
        currentPageX: 0,
        currentPageY: 0,
        width: 124,
        height: 124,
        rotate: 0,
      },
    ]);

    setIsTouchControlSticker(false);
  };

  const handleOnTouchStartSticker = (event: TouchEventAndMouseEventType, index: number) => {
    if (!checkIsTouch(event, isTouchStartSticker) || isTouchControlSticker) return;

    let pageX: number;
    let pageY: number;
    if ('touches' in event) {
      const touch = event.touches[0];
      pageX = touch.pageX;
      pageY = touch.pageY;
    } else {
      pageX = event.pageX;
      pageY = event.pageY;
    }

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
    setEnableMoveSticker(true);
  };

  const handleOnTouchMoveSticker = (event: TouchEventAndMouseEventType, index: number) => {
    if (!checkIsTouch(event, isTouchMoveSticker) || !enableMoveSticker) return;

    let pageX;
    let pageY;
    if ('touches' in event) {
      const touch = event.touches[0];
      pageX = touch.pageX;
      pageY = touch.pageY;
    } else {
      pageX = event.pageX;
      pageY = event.pageY;
    }

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
          return { ...sticker, top: newY, left: newX };
        }
        return sticker;
      }),
    );
  };

  const handleOnTouchEndSticker = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchEndSticker)) return;

    setEnableMoveSticker(false);
    setIsTouchControlSticker(false);
  };

  const handleOnTouchStartChangeTab = (event: TouchEventAndMouseEventType, index: number) => {
    if (!checkIsTouch(event, isTouchChangeTab)) return;

    setCurrentIndex(0);
    setCurrentTabIndex(index);
  };

  const handleOnTouchStartRotate = (event: TouchEventAndMouseEventType, index: number) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchRotate)) return;

    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, rotate: sticker.rotate + 10 };
        }
        return sticker;
      }),
    );

    setIsTouchControlSticker(true);
    setEnableMoveSticker(false);
  };

  const handleOnTouchStartApply = (event: TouchEventAndMouseEventType, index: number) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchApply)) return;

    setCurrentChooseStickerIndex(null);
    setIsTouchControlSticker(true);
    setEnableMoveSticker(false);
  };

  const handleOnTouchStartCancel = (event: TouchEventAndMouseEventType, index: number) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchCancel)) return;

    const newSelectedSticker = selectedSticker.filter((sticker, _index) => _index !== index);
    setSelectedSticker(newSelectedSticker);
    setCurrentChooseStickerIndex(null);
    setIsTouchControlSticker(false);
    setEnableMoveSticker(false);
  };

  const handleOnTouchStartZoomIn = (event: TouchEventAndMouseEventType, index: number) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchZoomIn)) return;

    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, width: sticker.width - CONST_RATIO_SCALE, height: sticker.height - CONST_RATIO_SCALE };
        }

        return sticker;
      }),
    );
    setIsTouchControlSticker(true);
    setEnableMoveSticker(false);
  };

  const handleOnTouchStartZoomOut = (event: TouchEventAndMouseEventType, index: number) => {
    event.stopPropagation();
    if (!checkIsTouch(event, isTouchZoomOut)) return;

    setSelectedSticker((prevSticker) =>
      prevSticker.map((sticker, _index) => {
        if (index === _index) {
          return { ...sticker, width: sticker.width + CONST_RATIO_SCALE, height: sticker.height + CONST_RATIO_SCALE };
        }

        return sticker;
      }),
    );
    setIsTouchControlSticker(true);
    setEnableMoveSticker(false);
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
      const x = selectedSticker[index].left * 2.79 + 10 * 2.79;
      const y = selectedSticker[index].top * 2.79 + 10 * 2.79;
      const w = selectedSticker[index].width * 2.79 - 20 * 2.79;
      const h = selectedSticker[index].height * 2.79 - 20 * 2.79;
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

  const handleOnTouchStartNextPage = async (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchNextPage)) return;

    const imageBase64 = await handleConvertCanvasToBase64(
      store.orderInfo.imageSelectEffect,
      selectedSticker,
      CONST_MOCK_DATA_FRAME.width,
      CONST_MOCK_DATA_FRAME.height,
    );
    const savePhoto = await window.api.saveImage({ imageBase64, modeFrame: CONST_MOCK_DATA_FRAME.modeFrame });
    if (savePhoto) {
      // reset store
      setStore((prevStore) => ({
        ...prevStore,
        shootingMethod: '',
        orderInfo: {
          ...prevStore.orderInfo,
          imageSelectEffect: '',
          imageSelectPhoto: '',
          imageSelectSticker: '',
          modeFrame: '',
          typeFrame: '',
          quantityImages: 0,
          selectedPhotos: [],
          frame: '',
          effect: { ...prevStore.orderInfo.effect, name: 'Original', className: '', style: '' },
        },
      }));
      navigate('/complete');
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
            <div className='z-30 flex h-[800px] w-[580px] -translate-y-4 items-center justify-center rounded-3xl border-2 border-dashed border-custom-style-2-1 bg-custom-style-1'>
              <div ref={frameRef} className='relative flex h-[645px] w-[430px] items-center justify-center'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                  {/* <DisplayImage src={store.orderInfo.imageSelectEffect} /> */}
                </div>

                {selectedSticker?.map((sticker, index) => {
                  return (
                    <div
                      key={index}
                      className={`absolute z-40 flex items-center justify-center border-2 p-2 ${currentChooseStickerIndex === index ? 'border-dashed border-custom-style-2-1' : 'border-transparent'}`}
                      style={{
                        top: `${sticker.top}px`,
                        left: `${sticker.left}px`,
                        width: `${sticker.width}px`,
                        height: `${sticker.height}px`,
                      }}
                      onTouchStart={(event) => handleOnTouchStartSticker(event, index)}
                      onMouseDown={(event) => handleOnTouchStartSticker(event, index)}
                      onTouchMove={(event) => handleOnTouchMoveSticker(event, index)}
                      onMouseMove={(event) => handleOnTouchMoveSticker(event, index)}
                      onTouchEnd={(event) => handleOnTouchEndSticker(event)}
                      onMouseUp={(event) => handleOnTouchEndSticker(event)}
                    >
                      <div className='h-full w-full' style={{ transform: `rotate(${sticker.rotate}deg)` }}>
                        <DisplayImage src={store.pathFolderAssets + sticker.relPath} />
                      </div>

                      {currentChooseStickerIndex === index && (
                        <div className='absolute -top-[48px] left-1/2 h-12 border-l-2 border-dashed border-custom-style-2-1'>
                          <div
                            className='absolute -left-[26px] -top-[30px] h-[50px] w-[50px] p-2'
                            onTouchStart={(event) => handleOnTouchStartRotate(event, index)}
                            onMouseDown={(event) => handleOnTouchStartRotate(event, index)}
                          >
                            <div className='h-full w-full rounded-full bg-custom-style-1'>
                              <DisplayImage src={store.pathFolderAssets + store.resources.icons[56]?.relPath} />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -left-6 -top-6 h-[50px] w-[50px] p-2'
                          onTouchStart={(event) => handleOnTouchStartApply(event, index)}
                          onMouseDown={(event) => handleOnTouchStartApply(event, index)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[54]?.relPath} />
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -right-6 -top-6 h-[50px] w-[50px] p-2'
                          onTouchStart={(event) => handleOnTouchStartCancel(event, index)}
                          onMouseDown={(event) => handleOnTouchStartCancel(event, index)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[55]?.relPath} />
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -bottom-6 -left-6 h-[50px] w-[50px] p-2'
                          onTouchStart={(event) => handleOnTouchStartZoomIn(event, index)}
                          onMouseDown={(event) => handleOnTouchStartZoomIn(event, index)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[58]?.relPath} />
                          </div>
                        </div>
                      )}

                      {currentChooseStickerIndex === index && (
                        <div
                          className='absolute -bottom-6 -right-6 h-[50px] w-[50px] p-2'
                          onTouchStart={(event) => handleOnTouchStartZoomOut(event, index)}
                          onMouseDown={(event) => handleOnTouchStartZoomOut(event, index)}
                        >
                          <div className='h-full w-full rounded-full bg-custom-style-1'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[57  ]?.relPath} />
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
                          className={`polygonTab flex h-full min-w-[210px] -translate-x-[16px] justify-center gap-x-2 p-0.5 ${currentTabIndex === 0 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 0)}
                          onMouseDown={(event) => handleOnTouchStartChangeTab(event, 0)}
                        >
                          <div className='h-[17px] w-[12px]'>
                            <DisplayImage src={store.pathFolderAssets + store.resources.icons[44]?.relPath} />
                          </div>
                          <span>{CONST_LIST_TAB_STICKER[0]}</span>
                        </div>

                        <div
                          className={`polygonTab h-full min-w-[210px] -translate-x-[44px] p-0.5 ${currentTabIndex === 1 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 1)}
                          onMouseDown={(event) => handleOnTouchStartChangeTab(event, 1)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[1]}</span>
                        </div>

                        <div
                          className={`polygonTab h-full min-w-[210px] -translate-x-[72px] p-0.5 ${currentTabIndex === 2 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 2)}
                          onMouseDown={(event) => handleOnTouchStartChangeTab(event, 2)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[2]}</span>
                        </div>

                        <div
                          className={`polygonTab h-full min-w-[210px] -translate-x-[100px] p-0.5 ${currentTabIndex === 3 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 3)}
                          onMouseDown={(event) => handleOnTouchStartChangeTab(event, 3)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[3]}</span>
                        </div>

                        <div
                          className={`polygonTab h-full min-w-[210px] -translate-x-[128px] p-0.5 ${currentTabIndex === 4 ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                          onTouchStart={(event) => handleOnTouchStartChangeTab(event, 4)}
                          onMouseDown={(event) => handleOnTouchStartChangeTab(event, 4)}
                        >
                          <span>{CONST_LIST_TAB_STICKER[4]}</span>
                        </div>
                      </div>

                      <div className='absolute bottom-0 left-0 right-0 h-[12px] bg-custom-style-2-2'></div>
                    </div>

                    <div className='flex h-full w-full items-center overflow-x-hidden py-16'>
                      {itemsSticker.map((stickers, index) => {
                        return (
                          <div
                            key={index}
                            className='grid h-full min-w-full grid-cols-6 content-start justify-items-center gap-y-8 transition-transform duration-500'
                            style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
                          >
                            {stickers.map((sticker, index) => {
                              return (
                                <div
                                  key={index}
                                  className='h-[90px] w-[90px] rounded-full bg-custom-style-3-3 p-4'
                                  onTouchEnd={(event) => handleOnTouchEndChooseSticker(event, sticker)}
                                  onMouseUp={(event) => handleOnTouchEndChooseSticker(event, sticker)}
                                >
                                  <div className='h-full w-full'>
                                    <DisplayImage src={store.pathFolderAssets + sticker.relPath} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

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
