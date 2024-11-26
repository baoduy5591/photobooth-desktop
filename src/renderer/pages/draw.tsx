import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { BackgroundImage } from '../components/backgroundImage';
import { IconCursor, IconPenErase, IconPenMediumLine, IconPenThickLine, IconPenThinLine } from '../libs/icons';
import { COLORS, CONST_FRAME_POSITIONS, keyDraw } from '../libs/constants';
import { useNavigate } from 'react-router-dom';
import { allowWithQuantityTouches, getPositionByFrameModeAndFrameType, loadImage } from '../libs/common';
import { useSound } from '../context/sound';
import { Countdown } from '../components/countdown';
import { INIT_STORE } from '../libs/initials';

interface ConfigItemType {
  thin: { color: string; lineWidth: number; isActive: boolean; icon: React.ReactNode };
  medium: { color: string; lineWidth: number; isActive: boolean; icon: React.ReactNode };
  thick: { color: string; lineWidth: number; isActive: boolean; icon: React.ReactNode };
  erase: { color: string; lineWidth: number; isActive: boolean; icon: React.ReactNode };
  cursor: { color: string; lineWidth: number; isActive: boolean; icon: React.ReactNode };
}

export function Draw() {
  const { store, setStore } = useStore();
  const { playSoundTouch } = useSound();
  const navigate = useNavigate();

  const [configItems, setConfigItems] = useState<ConfigItemType>({
    thin: { color: '#0d99ff', lineWidth: 5, isActive: true, icon: <IconPenThinLine /> },
    medium: { color: '#e7191f', lineWidth: 10, isActive: false, icon: <IconPenMediumLine /> },
    thick: { color: '#fee37a', lineWidth: 20, isActive: false, icon: <IconPenThickLine /> },
    erase: { color: '#ff909d', lineWidth: 50, isActive: false, icon: <IconPenErase /> },
    cursor: { color: '', lineWidth: 0, isActive: false, icon: <IconCursor /> },
  });
  const [isCursor, setIsCursor] = useState<boolean>(false);
  const [isErase, setIsErase] = useState<boolean>(false);
  const [eraseCoordinate, setEraseCoordinate] = useState<{ x: number; y: number }>({ x: 225, y: 375 });
  const [isShowModalColor, setIsShowModalColor] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>('#0d99ff');
  const [isShowModalLineWidth, setIsShowModalLineWidth] = useState<boolean>(false);
  const [lineWidth, setLineWidth] = useState<number>(configItems.thin.lineWidth);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasPositionRef = useRef<BouncingType>({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentCoordinateRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modalColorRef = useRef<HTMLDivElement>(null);
  const modalLineWidthRef = useRef<HTMLDivElement>(null);

  const canvasWidth = store.orderInfo.width / 2;
  const canvasHeight = store.orderInfo.height / 2;

  const getPositionCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;
    const canvasBouncing = canvas.getBoundingClientRect();
    canvasPositionRef.current = canvasBouncing;
  };

  const getContextOfCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.lineJoin = 'round';
    context.lineCap = 'round';
    contextRef.current = context;
  };

  const setStrokeStyleForContext = (strokeStyle: string) => {
    const context = contextRef.current;
    context.strokeStyle = strokeStyle;
  };

  const setLineWidthForContext = (lineWidth: number) => {
    const context = contextRef.current;
    context.lineWidth = lineWidth;
  };

  const draw = (
    xCurrentCoordinate: number,
    yCurrentCoordinate: number,
    xMoveCoordinate: number,
    yMoveCoordinate: number,
  ) => {
    const context = contextRef.current;
    context.beginPath();
    context.moveTo(xCurrentCoordinate * 2, yCurrentCoordinate * 2);
    context.lineTo(xMoveCoordinate * 2, yMoveCoordinate * 2);
    context.stroke();
  };

  const handleEraseStrokeByCoordinate = (xCoordinateOnCanvas: number, yCoordinateOnCanvas: number) => {
    const context = contextRef.current;
    const areaSize = configItems.erase.lineWidth * 4;
    context.clearRect(
      xCoordinateOnCanvas * 2 - areaSize / 2,
      yCoordinateOnCanvas * 2 - areaSize / 2,
      areaSize,
      areaSize,
    );
  };

  const handleDrawWhenStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const { touches } = event;
    if (touches.length !== 1 || isCursor) return;

    const touch = touches[0];
    const { pageX: xCoordinate, pageY: yCoordinate } = touch;

    const { x, y } = canvasPositionRef.current;
    const xCoordinateOnCanvas = xCoordinate - x;
    const yCoordinateOnCanvas = yCoordinate - y;
    // erase stroke by coordinate
    if (configItems.erase.isActive) {
      // update position mouse when erase
      setEraseCoordinate((prev) => ({
        ...prev,
        x: xCoordinateOnCanvas - (configItems.erase.lineWidth * 2) / 2,
        y: yCoordinateOnCanvas - (configItems.erase.lineWidth * 2) / 2,
      }));
      setIsErase(true);
      return;
    }

    draw(xCoordinateOnCanvas, yCoordinateOnCanvas, xCoordinateOnCanvas, yCoordinateOnCanvas);
    currentCoordinateRef.current = { x: xCoordinateOnCanvas, y: yCoordinateOnCanvas };
  };

  const handleDrawWhenMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const { touches } = event;
    if (touches.length !== 1 || isCursor) return;

    const touch = touches[0];
    const { pageX: xCoordinate, pageY: yCoordinate } = touch;
    const { x, y } = canvasPositionRef.current;
    const xCoordinateOnCanvas = xCoordinate - x;
    const yCoordinateOnCanvas = yCoordinate - y;
    // erase stroke by coordinate
    if (isErase) {
      handleEraseStrokeByCoordinate(xCoordinateOnCanvas, yCoordinateOnCanvas);
      setEraseCoordinate((prev) => ({
        ...prev,
        x: xCoordinateOnCanvas - (configItems.erase.lineWidth * 2) / 2,
        y: yCoordinateOnCanvas - (configItems.erase.lineWidth * 2) / 2,
      }));
      return;
    }

    const { x: xCurrentCoordinate, y: yCurrentCoordinate } = currentCoordinateRef.current;
    draw(xCurrentCoordinate, yCurrentCoordinate, xCoordinateOnCanvas, yCoordinateOnCanvas);
    currentCoordinateRef.current = { x: xCoordinateOnCanvas, y: yCoordinateOnCanvas };
  };

  const handleDrawWhenEnd = () => {
    if (isCursor) return;

    if (configItems.erase.isActive) {
      setIsErase(false);
    }
  };

  const setConfigPensByKey = (key: string) => {
    setConfigItems((prevConfig) => {
      return Object.keys(prevConfig).reduce(
        (newConfig, currentKey) => {
          newConfig[currentKey as keyof typeof prevConfig] = {
            ...prevConfig[currentKey as keyof typeof prevConfig],
            isActive: currentKey === key,
          };
          return newConfig;
        },
        { ...prevConfig },
      );
    });
  };

  const getPenByKey = (key: string) => {
    return configItems[key as keyof typeof configItems];
  };

  const getPenIsActivated = (): {} | ConfigItemType['thin' | 'medium' | 'thick' | 'erase'] => {
    const keys = Object.keys(configItems).filter((key) => configItems[key as keyof typeof configItems].isActive);
    if (keys.length !== 1) return false;

    const pen = getPenByKey(keys[0]);
    if (!pen) return false;

    return pen;
  };

  const handleChooseItem = (event: React.TouchEvent<HTMLDivElement>, key: string) => {
    event.stopPropagation();
    if (event.touches.length !== 1) return;

    const pen = getPenByKey(key);
    switch (key) {
      case keyDraw.thin:
      case keyDraw.medium:
      case keyDraw.thick:
        setConfigPensByKey(key);
        setStrokeStyleForContext(pen.color);
        setLineWidthForContext(pen.lineWidth);
        setIsCursor(false);
        setCurrentColor(pen.color);
        setLineWidth(pen.lineWidth);
        setIsShowModalColor(false);
        setIsShowModalLineWidth(false);
        setIsErase(false);
        break;
      case keyDraw.erase:
        setConfigPensByKey(key);
        setLineWidth(pen.lineWidth);
        setIsCursor(false);
        setIsShowModalColor(false);
        setIsShowModalLineWidth(false);
        break;
      case keyDraw.cursor:
        setConfigPensByKey(key);
        setIsCursor(true);
        setIsShowModalColor(false);
        setIsShowModalLineWidth(false);
        setIsErase(false);
    }
  };

  const handleShowModalColor = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.touches.length !== 1 || isCursor || configItems.erase.isActive) return;

    setIsShowModalColor(!isShowModalColor);
    setIsShowModalLineWidth(false);
  };

  const handleChooseColor = (event: React.TouchEvent<HTMLDivElement>, color: string) => {
    event.stopPropagation();
    if (event.touches.length !== 1) return;

    setConfigItems((prevConfig) => {
      return Object.keys(prevConfig).reduce(
        (newConfig, currentKey) => {
          newConfig[currentKey as keyof typeof prevConfig] = {
            ...prevConfig[currentKey as keyof typeof prevConfig],
            color: prevConfig[currentKey as keyof typeof prevConfig].isActive
              ? color
              : prevConfig[currentKey as keyof typeof prevConfig].color,
          };
          return newConfig;
        },
        { ...prevConfig },
      );
    });
    setStrokeStyleForContext(color);
    setCurrentColor(color);
    setIsShowModalColor(false);
  };

  const handleShowModalLineWidth = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.touches.length !== 1 || isCursor) return;

    setIsShowModalLineWidth(!isShowModalLineWidth);
    setIsShowModalColor(false);
  };

  const handleChangeWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _lineWidth = Number(event.target.value);
    setConfigItems((prevConfig) => {
      return Object.keys(prevConfig).reduce(
        (newConfig, currentKey) => {
          newConfig[currentKey as keyof typeof prevConfig] = {
            ...prevConfig[currentKey as keyof typeof prevConfig],
            lineWidth: prevConfig[currentKey as keyof typeof prevConfig].isActive
              ? _lineWidth
              : prevConfig[currentKey as keyof typeof prevConfig].lineWidth,
          };
          return newConfig;
        },
        { ...prevConfig },
      );
    });

    setLineWidth(_lineWidth);
    // if pen Erase active, then not re-set lineWidth for context
    if (isErase) return;

    setLineWidthForContext(_lineWidth);
  };

  const handleCheckOutSide = (event: React.TouchEvent<HTMLDivElement>) => {
    if ((!isShowModalColor && !isShowModalLineWidth) || event.touches.length !== 1) return;

    if (modalColorRef.current && !modalColorRef.current.contains(event.target as HTMLDivElement)) {
      setIsShowModalColor(false);
    }

    if (modalLineWidthRef.current && !modalLineWidthRef.current.contains(event.target as HTMLDivElement)) {
      setIsShowModalLineWidth(false);
    }
  };

  const handleConvertCanvasToBase64 = async (imageFrameSticker: string, width: number, height: number) => {
    const canvasDraw = canvasRef.current;
    const elementImageFrameSticker = await loadImage(imageFrameSticker);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(elementImageFrameSticker, 0, 0, width, height);
    context.drawImage(canvasDraw, 0, 0, width, height);
    const imageBase64 = canvas.toDataURL('image/png');
    return imageBase64;
  };

  const handleProcessPrint = async () => {
    const imageBase64 = await handleConvertCanvasToBase64(
      store.orderInfo.imageFrameSticker,
      store.orderInfo.width,
      store.orderInfo.height,
    );
    store.orderInfo.imageFrameStickerDraw = imageBase64;
    const saveFrameSticker = await window.api.saveImageFrameSticker(imageBase64);
    if (!saveFrameSticker) {
      setIsLoading(false);
      alert(
        'Save frame sticker draw image failed, please check the printer or contact the technical department. We apologize for the inconvenience !!!',
      );
      return;
    }

    const positions = getPositionByFrameModeAndFrameType(
      CONST_FRAME_POSITIONS,
      store.orderInfo.frameMode,
      store.orderInfo.frameType,
    );
    const data = {
      frameMode: store.orderInfo.frameMode,
      frameWidth: store.orderInfo.width,
      frameHeight: store.orderInfo.height,
      photos: store.orderInfo.selectedPhotos,
      effectName: store.orderInfo.effect.name,
      positions: positions,
    };
    const generateVideoToBase64 = await window.api.generateVideo(data);
    if (!generateVideoToBase64) {
      alert(
        'Process video failed, please check the printer or contact the technical department. We apologize for the inconvenience !!!',
      );
      return;
    }

    store.orderInfo.videoBase64 = generateVideoToBase64;
    // const savePhoto = await window.api.saveImage({ imageBase64, orderInfo: store.orderInfo });
    // if (!savePhoto) {
    //   setIsLoading(false);
    //   alert(
    //     'Printer failed, please check the printer or contact the technical department. We apologize for the inconvenience !!!',
    //   );
    //   return;
    // }
    // setStore((prevStore) => ({
    //   ...prevStore,
    //   shootingMethod: INIT_STORE.shootingMethod,
    //   shootingTime: INIT_STORE.shootingTime,
    //   orderInfo: { ...INIT_STORE.orderInfo },
    // }));

    navigate('/complete');
  };

  const handleOnTouchStartNextPage = async (event: React.TouchEvent<HTMLDivElement>) => {
    if (!allowWithQuantityTouches(Array.from(event.touches), 1)) return;

    setIsLoading(true);
    playSoundTouch(false);
    await handleProcessPrint();
  };

  const handleTimeout = async () => {
    setIsLoading(true);
    await handleProcessPrint();
  };

  useEffect(() => {
    getPositionCanvas();
    getContextOfCanvas();
    setStrokeStyleForContext(configItems.thin.color);
    setLineWidthForContext(configItems.thin.lineWidth);
  }, []);

  return (
    <div
      className='relative flex h-screen items-center justify-center'
      onTouchStart={(event) => handleCheckOutSide(event)}
    >
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-custom-style-1 font-rokkitt text-4xl font-semibold opacity-80'>
          <span className='animate-opacity-slow-infinite'>Please wait some minute . . .</span>
        </div>
      )}

      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute right-60 top-40'>
        <Countdown
          url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
          time={300}
          handleTimeout={handleTimeout}
        />
      </div>

      <div className='absolute bottom-0 right-0 h-[440px] w-[406px] rotate-180'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute left-1 top-1/2 z-10 flex h-[700px] w-[130px] -translate-y-1/2 flex-col justify-around rounded-2xl border border-custom-style-3-2 bg-custom-style-1 py-6 shadow-2xl'>
        {Object.keys(configItems).map((key, index) => {
          if (key === keyDraw.cursor) {
            return (
              <div
                key={index}
                onTouchStart={(event) => handleChooseItem(event, keyDraw.cursor)}
                className={`h-16 w-16 self-center p-2 ${configItems[key as keyof typeof configItems].isActive ? 'rounded-xl border border-custom-style-3-1 bg-custom-style-3-4 shadow-xl' : ''}`}
              >
                {configItems[key as keyof typeof configItems].icon}
              </div>
            );
          }

          return (
            <div
              key={index}
              onTouchStart={(event) => handleChooseItem(event, key)}
              className={`${configItems[key as keyof typeof configItems].isActive ? '' : '-translate-x-1/2'}`}
            >
              <span style={{ color: configItems[key as keyof typeof configItems].color }}>
                {configItems[key as keyof typeof configItems].icon}
              </span>
            </div>
          );
        })}

        <div
          className={`relative h-16 w-16 self-center p-2 ${isCursor || configItems.erase.isActive ? 'opacity-40' : ''} ${isShowModalColor ? 'rounded-xl border border-custom-style-3-2 bg-custom-style-3-4 shadow-xl' : ''}`}
        >
          <div
            className='h-full w-full rounded-full border border-custom-style-3-2'
            style={{ backgroundColor: currentColor }}
            onTouchStart={(event) => handleShowModalColor(event)}
          ></div>

          {isShowModalColor && (
            <div
              ref={modalColorRef}
              className='absolute -right-[500px] -top-[180px] grid h-[500px] w-[450px] grid-cols-4 gap-2 overflow-y-hidden rounded-2xl bg-custom-style-1 p-4 shadow-2xl'
            >
              {COLORS.map((color, index) => {
                return (
                  <div
                    key={index}
                    onTouchStart={(event) => handleChooseColor(event, color)}
                    className={`h-20 w-20 rounded-full p-2 ${color === currentColor ? 'border-2 border-custom-style-3-2' : ''}`}
                  >
                    <div
                      className='h-full w-full rounded-full border-2 border-custom-style-3-2'
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={`relative h-16 w-16 self-center p-4 ${isCursor ? 'opacity-40' : ''} ${isShowModalLineWidth ? 'rounded-xl border border-custom-style-3-2 bg-custom-style-3-4 shadow-xl' : ''}`}
        >
          <div>
            {isShowModalLineWidth && (
              <div
                ref={modalLineWidthRef}
                className='absolute -right-[500px] -top-[40px] flex h-40 w-[450px] items-center justify-center gap-x-6 rounded-2xl bg-custom-style-1 p-4 font-rokkitt text-2xl tracking-wider shadow-2xl'
              >
                <div className='flex flex-1 flex-col justify-center gap-y-4'>
                  <label htmlFor='id__input_range'>Weight</label>
                  <div className='relative flex h-6 items-center justify-center'>
                    <input
                      type='range'
                      name='input_range'
                      id='id__input_range'
                      min={0}
                      max={100}
                      value={lineWidth}
                      onChange={(event) => handleChangeWeight(event)}
                      className='custom-input-type-range h-full w-full'
                    />

                    <div
                      className='pointer-events-none absolute left-0 top-1/2 h-[5px] -translate-y-1/2 bg-custom-style-2-1'
                      style={{ width: `${lineWidth}%` }}
                    ></div>

                    <div className='pointer-events-none absolute -left-[15px] top-1/2 h-full w-[308px] -translate-y-1/2'>
                      <div
                        className='pointer-events-none absolute top-1/2 h-[60px] w-[60px] -translate-y-1/2 rounded-full bg-custom-style-2-1 opacity-50'
                        style={{ left: `${lineWidth}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <input
                  type='text'
                  className='mt-10 h-14 w-14 rounded-xl border border-custom-style-3-1 text-center outline-none'
                  value={lineWidth}
                  readOnly
                />
              </div>
            )}
          </div>
          <div
            onTouchStart={(event) => handleShowModalLineWidth(event)}
            className='items-center- flex h-full w-full flex-col justify-center gap-y-2'
          >
            <div className='h-1 w-full bg-custom-style-3-1'></div>
            <div className='h-2 w-full bg-custom-style-3-1'></div>
            <div className='h-3 w-full bg-custom-style-3-1'></div>
          </div>
        </div>
      </div>

      <div
        className='relative border-2 border-custom-style-3-1'
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        onTouchStart={(event) => handleDrawWhenStart(event)}
        onTouchMove={(event) => handleDrawWhenMove(event)}
        onTouchEnd={handleDrawWhenEnd}
      >
        <div className='absolute left-0 top-0 h-full w-full'>
          <DisplayImage src={store.orderInfo.imageSelectEffect} />
        </div>

        <div className='absolute left-0 top-0 h-full w-full'>
          <DisplayImage src={store.orderInfo.imageFrameSticker} />
        </div>

        <canvas ref={canvasRef} className='absolute left-0 top-0 h-full w-full'></canvas>

        {isErase && (
          <div
            className='absolute rounded-full border-2 border-custom-style-2-1 bg-custom-style-3-3 shadow-2xl'
            style={{
              top: `${eraseCoordinate.y}px`,
              left: `${eraseCoordinate.x}px`,
              width: `${configItems.erase.lineWidth * 2}px`,
              height: `${configItems.erase.lineWidth * 2}px`,
            }}
          ></div>
        )}
      </div>

      <div
        className='absolute right-10 top-1/2 flex -translate-y-1/2 items-center justify-center'
        onTouchStart={(event) => handleOnTouchStartNextPage(event)}
      >
        <div className='h-[79.8px] w-[79.8px]'>
          <DisplayImage src={store.pathFolderAssets + store.resources.icons[38]?.relPath} />
        </div>
      </div>
    </div>
  );
}
