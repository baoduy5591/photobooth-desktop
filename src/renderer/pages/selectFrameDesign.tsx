import { useEffect, useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { Countdown } from '../components/countdown';
import { DisplayImage } from '../components/displayImage';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { useSound } from '../context/sound';
import { INIT_STORE } from '../libs/initials';
import { useTranslation } from 'react-i18next';
import { CONST_DATA_TYPES, CONST_MODE_CUTTING, CONST_MODE_REGULAR } from '../libs/constants';
import { allowWithQuantityTouches, getQuantitySelectedImages, loadImage } from '../libs/common';

export default function SelectFrameDesign() {
  const { store, setStore } = useStore()!;
  const { playSoundTouch } = useSound()!;
  const { t: translate, i18n } = useTranslation();

  const getDataFrameByModeFrameAndTypeFrame = () => {
    console.log(store.orderInfo.frameMode);
    console.log(store.orderInfo.frameStyle);
    console.log(store.orderInfo.frameNumber);
    const frameMode = store.orderInfo.frameMode;
    if (frameMode === CONST_MODE_CUTTING) {
      return store.resources.frames.cutting[store.orderInfo.frameType as keyof typeof store.resources.frames.cutting];
    } else if (frameMode === CONST_MODE_REGULAR) {
      return store.resources.frames.regular[store.orderInfo.frameType as keyof typeof store.resources.frames.regular];
    }

    return store.resources.frames.wide[store.orderInfo.frameType as keyof typeof store.resources.frames.wide];
  };

  const [tab, setTab] = useState<string>(CONST_DATA_TYPES[0]);

  const frames = getDataFrameByModeFrameAndTypeFrame();
  const frame = frames[store.orderInfo.frameStyle as keyof typeof frames][store.orderInfo.frameNumber];

  const isTouchMove = useRef<boolean>(false);
  const coordinateY = useRef<number>(0);

  const navigate = useNavigate();

  const handleChangeTab = (styleFrameName: string) => {
    playSoundTouch(false);
    setTab(styleFrameName);
  };

  const handleChooseThumbFrame = (event: React.TouchEvent<HTMLDivElement>, order: number) => {
    const touches = event.touches;
    if (!allowWithQuantityTouches(Array.from(touches), 1) || isTouchMove.current) return;

    playSoundTouch(false);
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: { ...prevStore.orderInfo, frameStyle: tab, frameNumber: order },
    }));
  };

  const handleOnTouchStartScrollFrameThumb = (event: React.TouchEvent<HTMLDivElement>) => {
    const touches = event.touches;
    if (!allowWithQuantityTouches(Array.from(touches), 1)) return;

    const { clientY } = touches[0];
    coordinateY.current = clientY;
  };

  const handleOnTouchMoveScrollFrameThumb = (event: React.TouchEvent<HTMLDivElement>) => {
    const touches = event.touches;
    if (!allowWithQuantityTouches(Array.from(touches), 1)) return;

    const { clientY } = touches[0];
    if (Math.abs(clientY - coordinateY.current) > 100) {
      isTouchMove.current = true;
    }
  };

  const handleOnTouchEndScrollFrameThumb = (event: React.TouchEvent<HTMLDivElement>) => {
    isTouchMove.current = false;
  };

  const handlePrevPage = () => {
    playSoundTouch(false);
    setTimeout(() => {
      navigate('/select-frame-type');
    }, 300);
  };

  const handleNextPage = () => {
    playSoundTouch(false);
    const newRelPath = `/assets/frames/${store.orderInfo.frameMode}/${store.orderInfo.frameType}/${store.orderInfo.frameStyle}/${frame.name}`;
    const newQuantitySelectedPhotos = getQuantitySelectedImages(store.orderInfo.frameMode, store.orderInfo.frameType);
    const newQuantityShootingPhotos = newQuantitySelectedPhotos + 2;
    setStore((prevStore) => ({
      ...prevStore,
      orderInfo: {
        ...prevStore.orderInfo,
        frameRelPath: newRelPath,
        quantityShootingPhotos: newQuantityShootingPhotos,
        quantitySelectedPhotos: newQuantitySelectedPhotos,
      },
    }));
    setTimeout(() => {
      navigate('/select-print-quantity');
    }, 300);
  };

  const handleTimeout = () => {
    setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, ...INIT_STORE.orderInfo } }));
  };

  useEffect(() => {
    loadImage(store.assetsFolderPath + frame?.relPath).then((image) =>
      setStore((prevStore) => ({
        ...prevStore,
        orderInfo: {
          ...prevStore.orderInfo,
          width: image.width,
          height: image.height,
        },
      })),
    );
  }, [store.orderInfo.frameNumber]);

  return (
    <div className='relative h-screen'>
      <BackgroundImage url={store.clientSetting.backgroundImageSecondary} />

      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <div className='absolute right-36 top-[72px] mt-2 h-[58px] w-[100px]'>
          <Countdown
            url={store.assetsFolderPath + store.resources.icons[10]?.relPath}
            time={300}
            routeGoToBack='/select-print-quantity'
            handleTimeout={handleTimeout}
          />
        </div>

        <div className='relative h-[100px] w-[668px] -translate-y-32 translate-x-48'>
          <div className='h-full w-full'>
            <DisplayImage src={store.assetsFolderPath + store.resources.icons[39]?.relPath} />
          </div>

          <div className='absolute left-40 top-1/2 min-w-max -translate-y-1/2 font-rokkitt text-[32px] font-bold tracking-wider'>
            <span>{translate('translation:selectFrameDesign.title1')}</span>
            <span className='text-custom-style-2-1'>{translate('translation:selectFrameDesign.title2')}</span>
          </div>
        </div>

        <div className='flex h-[600px] w-full items-center justify-around gap-x-5'>
          <div
            className='flex w-14 -translate-y-10 translate-x-3 items-center justify-center'
            onTouchStart={handlePrevPage}
          >
            <div className='h-[79.8px] w-[79.8px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[42]?.relPath} />
            </div>
          </div>

          <div className='flex min-w-max -translate-y-16 flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
              <div className='relative h-24 w-40'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[37]?.relPath} />
                </div>

                {i18n.language === 'en' && (
                  <div className='absolute left-10 top-6 text-xl tracking-wider text-custom-style-1'>
                    <span>{translate('translation:selectFrameDesign.preview')}</span>
                  </div>
                )}

                {i18n.language === 'vi' && (
                  <div className='absolute left-7 top-6 text-xl tracking-wider text-custom-style-1'>
                    <span>{translate('translation:selectFrameDesign.preview')}</span>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-center'>
                <div className='h-[80px] w-[103px] -rotate-6'>
                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
                </div>

                <div className='h-[80px] w-[103px] rotate-6'>
                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
                </div>
              </div>
            </div>

            <div className='-translate-y-4 p-2'>
              <div
                className='border-2 border-custom-style-3-1 bg-custom-style-3-2'
                style={{ width: `${store.orderInfo.width / 2.8}px`, height: `${store.orderInfo.height / 2.8}px` }}
              >
                <DisplayImage src={store.assetsFolderPath + frame?.relPath} />
              </div>
            </div>
          </div>

          <div className='relative flex'>
            <div className='absolute -top-14 left-10 h-[80px] w-[103px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
            </div>

            <div className='relative h-[750.4px] w-[1041.6px] rounded-xl bg-custom-style-3-1'>
              <div className='flex h-full w-full flex-col items-center justify-center px-4'>
                <div className='my-4 h-[22px] w-[140px] rounded-full bg-custom-style-1'></div>

                <div className='h-full w-full flex-1 overflow-hidden bg-custom-style-1'>
                  <div className='relative flex h-12 items-center justify-start bg-custom-style-1 text-center font-rokkitt text-[16px]'>
                    <div
                      className={`polygon-tab flex h-full min-w-[210px] -translate-x-[16px] justify-center gap-x-2 p-0.5 ${tab === CONST_DATA_TYPES[0] ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                      onTouchStart={(event) => handleChangeTab(CONST_DATA_TYPES[0])}
                    >
                      <span>{translate('translation:selectFrameDesign.normal')}</span>
                    </div>

                    <div
                      className={`polygon-tab h-full min-w-[210px] -translate-x-[44px] p-0.5 ${tab === CONST_DATA_TYPES[1] ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                      onTouchStart={(event) => handleChangeTab(CONST_DATA_TYPES[1])}
                    >
                      <span>{translate('translation:selectFrameDesign.season')}</span>
                    </div>

                    <div
                      className={`polygon-tab h-full min-w-[210px] -translate-x-[72px] p-0.5 ${tab === CONST_DATA_TYPES[2] ? 'z-10 bg-custom-style-2-2' : 'bg-custom-style-2-1'}`}
                      onTouchStart={(event) => handleChangeTab(CONST_DATA_TYPES[2])}
                    >
                      <span>{translate('translation:selectFrameDesign.special')}</span>
                    </div>

                    <div className='absolute bottom-0 left-0 right-0 h-[12px] bg-custom-style-2-2'></div>
                  </div>

                  <div
                    className='custom-scroll-bar visible-scroll-bar custom-scroll-bar-thumb custom-scroll-bar-hidden-button h-full w-full overflow-x-hidden overflow-y-scroll rounded-xl bg-custom-style-1'
                    onTouchEnd={(event) => handleOnTouchEndScrollFrameThumb(event)}
                    onTouchMove={(event) => handleOnTouchMoveScrollFrameThumb(event)}
                    onTouchStart={(event) => handleOnTouchStartScrollFrameThumb(event)}
                  >
                    <div className='grid min-h-max grid-cols-4 place-items-start gap-y-12 px-2 pb-28 pl-10 pt-16'>
                      {frames[tab as keyof typeof frames].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`relative rounded-3xl p-2 ${store.orderInfo.frameStyle === tab && store.orderInfo.frameNumber === item.order ? 'border-3 border-dashed border-custom-style-2-1' : 'border-3 border-transparent'}`}
                          >
                            <div
                              key={index}
                              className='h-[160px] w-[160px] overflow-hidden rounded-3xl border border-custom-style-3-1'
                              onTouchEnd={(event) => handleChooseThumbFrame(event, item.order)}
                            >
                              <DisplayImage src={item.thumb} />
                            </div>

                            {store.orderInfo.frameStyle === tab && store.orderInfo.frameNumber === item.order && (
                              <div className='absolute -top-11 left-1/2 h-10 w-10 -translate-x-1/2'>
                                <DisplayImage src={store.assetsFolderPath + store.resources.icons[43]?.relPath} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className='my-4 min-h-[45px] min-w-[45px] rounded-full bg-custom-style-1 p-1.5'>
                  <div className='h-full w-full rounded-full bg-custom-style-3-1'></div>
                </div>
              </div>

              <div className='absolute -bottom-10 left-0 right-0 text-center font-rokkitt text-[24px] text-custom-style-3-1'>
                <div className='h-[30px] min-w-max'>
                  <span>※ {translate('translation:selectFrameDesign.note')}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className='flex w-14 -translate-x-3 -translate-y-10 items-center justify-center'
            onTouchStart={handleNextPage}
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
