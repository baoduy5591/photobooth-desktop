import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { useEffect, useState } from 'react';
import { useSound } from '../context/sound';
import { Countdown } from '../components/countdown';
import { allowWithQuantityTouches } from '../libs/common';
import { CONST_MODE_CUTTING, CONST_MODE_REGULAR, CONST_MODE_WIDE } from '../libs/constants';
import { useNavigate } from 'react-router-dom';

export default function SelectFrameType() {
  const { store, setStore } = useStore()!;
  const { playSoundTouch } = useSound()!;
  const { t: translate } = useTranslation('translation');
  const navigate = useNavigate();

  const [typeOfCutting, setTypeOfCutting] = useState<string>(Object.keys(store.resources.frames.cutting)[0]);
  const [typeOfRegular, setTypeOfRegular] = useState<string>(Object.keys(store.resources.frames.regular)[0]);
  const [typeOfWide, setTypeOfWide] = useState<string>(Object.keys(store.resources.frames.wide)[0]);

  const handleChooseFrameMode = (event: React.TouchEvent<HTMLDivElement>, frameMode: string) => {
    const touches = Array.from(event.touches);
    if (!allowWithQuantityTouches(touches, 1)) return;

    playSoundTouch(false);
    setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, frameMode: frameMode } }));
  };

  const handleChooseFrameType = (event: React.TouchEvent<HTMLDivElement>, frameMode: string, frameType: string) => {
    const touches = Array.from(event.touches);
    if (!allowWithQuantityTouches(touches, 1)) return;

    playSoundTouch(false);
    setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, frameType: frameType } }));
    if (frameMode === CONST_MODE_CUTTING) {
      setTypeOfCutting(frameType);
    } else if (frameMode === CONST_MODE_REGULAR) {
      setTypeOfRegular(frameType);
    } else if (frameMode === CONST_MODE_WIDE) {
      setTypeOfWide(frameType);
    }
  };

  const handleNextPage = (event: React.TouchEvent<HTMLDivElement>) => {
    const touches = Array.from(event.touches);
    if (!allowWithQuantityTouches(touches, 1)) return;

    setTimeout(() => {
      navigate('/select-frame-design');
    }, 300);
  };

  return (
    <div className='relative h-screen w-screen'>
      <BackgroundImage url={store.assetsFolderPath + store.clientSetting.backgroundImageSecondary} />

      <div
        className='absolute right-2 top-1/2 z-10 flex h-[79.8px] w-[79.8px] -translate-y-1/2 items-center justify-center'
        onTouchStart={handleNextPage}
      >
        <div className='h-[50px] w-[50px]'>
          <DisplayImage src={store.resources.icons[38]?.relPath} />
        </div>
      </div>

      <div className='absolute inset-0 py-6'>
        <div className='absolute right-36 top-20 flex items-center justify-center gap-x-4'>
          <div className='h-[58px] w-[100px]'>
            <Countdown url={store.resources.icons[10]?.relPath} time={300} routeGoToBack='/select-frame-design' />
          </div>
        </div>

        <div className='flex h-full flex-col items-center'>
          <div className='relative mt-20 h-[142px] w-[565px]'>
            <DisplayImage src={store.assetsFolderPath + store.resources.icons[9]?.relPath} />

            <div className='absolute left-1/2 top-1/2 min-w-max -translate-x-1/2 -translate-y-1/2 gap-x-10 text-4xl tracking-wider text-custom-style-1'>
              <span>{translate('translation:selectFrameType.title')}</span>
            </div>
          </div>

          <div className='mt-12 flex select-none gap-16 font-rokkitt text-[28px] font-bold'>
            <div className='flex flex-col items-center justify-center'>
              <div className='h-[102px] w-[132px]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
              </div>

              <div
                className={`border-custom-style-5-4 flex h-[90px] w-[250px] -translate-y-7 items-center justify-center rounded-l-full rounded-r-full border-4 border-dashed ${store.orderInfo.frameMode === CONST_MODE_CUTTING ? 'bg-custom-style-5-2' : 'bg-custom-style-1'}`}
                onTouchStart={(event) => handleChooseFrameMode(event, CONST_MODE_CUTTING)}
              >
                <span>{translate('translation:selectFrameType.cutting')}</span>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <div className='h-[102px] w-[132px]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
              </div>

              <div
                className={`border-custom-style-5-4 flex h-[90px] w-[250px] -translate-y-7 items-center justify-center rounded-l-full rounded-r-full border-4 border-dashed ${store.orderInfo.frameMode === CONST_MODE_REGULAR ? 'bg-custom-style-5-2' : 'bg-custom-style-1'}`}
                onTouchStart={(event) => handleChooseFrameMode(event, CONST_MODE_REGULAR)}
              >
                <span>{translate('translation:selectFrameType.regular')}</span>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <div className='h-[102px] w-[132px]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
              </div>

              <div
                className={`border-custom-style-5-4 flex h-[90px] w-[250px] -translate-y-7 items-center justify-center rounded-l-full rounded-r-full border-4 border-dashed ${store.orderInfo.frameMode === CONST_MODE_WIDE ? 'bg-custom-style-5-2' : 'bg-custom-style-1'}`}
                onTouchStart={(event) => handleChooseFrameMode(event, CONST_MODE_WIDE)}
              >
                <span>{translate('translation:selectFrameType.wide')}</span>
              </div>
            </div>
          </div>

          <div className='mt-12'>
            {store.orderInfo.frameMode === CONST_MODE_CUTTING && (
              <div className='flex flex-col items-center justify-center gap-y-4'>
                <div className='rounded-7xl flex h-[420px] items-center justify-between gap-x-28 border-4 border-dashed border-custom-style-2-1 px-24'>
                  {Object.keys(store.resources.frames.cutting).map((_type, index) => {
                    return (
                      <div
                        key={index}
                        className='relative h-[320px] w-[213px]'
                        onTouchStart={(event) => handleChooseFrameType(event, CONST_MODE_CUTTING, _type)}
                      >
                        <DisplayImage
                          src={
                            store.assetsFolderPath +
                            store.resources.frames.cutting[_type as keyof typeof store.resources.frames.cutting]
                              .normal[0]?.relPath
                          }
                        />

                        {typeOfCutting === _type && (
                          <div className='absolute -top-[80px] left-1/2 h-[60px] w-[60px] -translate-x-1/2'>
                            <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className='flex w-full items-center justify-center justify-between gap-x-28 px-28 font-rokkitt text-2xl'>
                  <div className='flex flex-col items-center justify-center'>
                    <span>{translate('translation:selectFrameType.4PhotosLayout')}</span>
                  </div>

                  <div className='flex flex-col items-center justify-center'>
                    <span>{translate('translation:selectFrameType.3PhotosLayout')}</span>
                  </div>

                  <div className='flex flex-col items-center justify-center'>
                    <span>{translate('translation:selectFrameType.2PhotosLayout')}</span>
                  </div>
                </div>
              </div>
            )}

            {store.orderInfo.frameMode === CONST_MODE_REGULAR && (
              <div className='flex flex-col items-center justify-center gap-y-4'>
                <div className='rounded-7xl flex h-[420px] items-center justify-between gap-x-10 border-4 border-dashed border-custom-style-2-1 px-5'>
                  {Object.keys(store.resources.frames.regular).map((_type, index) => {
                    return (
                      <div
                        key={index}
                        className={`relative ${_type === 'typeA' || _type === 'typeB' || _type === 'typeD' ? 'h-[320px] w-[213px]' : 'h-[213px] w-[320px]'}`}
                        onTouchStart={(event) => handleChooseFrameType(event, CONST_MODE_REGULAR, _type)}
                      >
                        <DisplayImage
                          src={
                            store.resources.frames.regular[_type as keyof typeof store.resources.frames.regular]
                              .normal[0]?.relPath
                          }
                        />

                        {typeOfRegular === _type && (
                          <div className='absolute -top-[80px] left-1/2 h-[60px] w-[60px] -translate-x-1/2'>
                            <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className='flex w-full items-center justify-center justify-between gap-x-10 px-5 font-rokkitt text-2xl'>
                  <div className='flex flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.4PhotosLayout')}</span>
                  </div>

                  <div className='flex -translate-x-11 flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.6PhotosLayout')}</span>
                  </div>

                  <div className='flex -translate-x-16 flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.3PhotosLayout')}</span>
                  </div>

                  <div className='flex -translate-x-20 flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.4PhotosLayout')}</span>
                  </div>

                  <div className='flex -translate-x-24 flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.6PhotosLayout')}</span>
                  </div>

                  <div className='flex -translate-x-20 flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.8PhotosLayout')}</span>
                  </div>
                </div>
              </div>
            )}

            {store.orderInfo.frameMode === CONST_MODE_WIDE && (
              <div className='flex flex-col items-center justify-center gap-y-4'>
                <div className='rounded-7xl flex h-[420px] items-center justify-between gap-x-24 border-4 border-dashed border-custom-style-2-1 px-24'>
                  {Object.keys(store.resources.frames.wide).map((_type, index) => {
                    return (
                      <div
                        key={index}
                        className='relative h-[320px] w-[213px]'
                        onTouchStart={(event) => handleChooseFrameType(event, CONST_MODE_WIDE, _type)}
                      >
                        <DisplayImage
                          src={
                            store.resources.frames.wide[_type as keyof typeof store.resources.frames.wide].normal[0]
                              ?.relPath
                          }
                        />

                        {typeOfWide === _type && (
                          <div className='absolute -top-[80px] left-1/2 h-[60px] w-[60px] -translate-x-1/2'>
                            <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className='flex w-full items-center justify-center justify-between gap-x-24 px-28 font-rokkitt text-2xl'>
                  <div className='flex flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.4PhotosLayout')}</span>
                  </div>

                  <div className='flex flex-col items-center justify-center'>
                    <span className='min-w-max'>{translate('translation:selectFrameType.3PhotosLayout')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
