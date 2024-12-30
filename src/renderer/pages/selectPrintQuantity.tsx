import { useRef, useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { Countdown } from '../components/countdown';
import { DisplayImage } from '../components/displayImage';
import { useStore } from '../context/store';
import { useSound } from '../context/sound';
import { useNavigate } from 'react-router-dom';
import { INIT_STORE } from '../libs/initials';
import { useTranslation } from 'react-i18next';
import { CONST_MODE_CUTTING } from '../libs/constants';

export default function SelectPrintQuantity() {
  const { store, setStore } = useStore()!;
  const { playSoundTouch } = useSound()!;
  const { t: translate, i18n } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [value, setValue] = useState<number>(3);

  const navigate = useNavigate();

  const isTouch = useRef<boolean>(false);
  const isTouchChild = useRef<boolean>(false);

  const handleChoosePrintQuantity = (index: number) => {
    playSoundTouch(false);
    if (index === 0) {
      isTouch.current = false;
      isTouchChild.current = false;
      setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, printCount: 1 } }));
      setCurrentIndex(0);
    } else if (index === 1) {
      isTouch.current = false;
      isTouchChild.current = false;
      setCurrentIndex(1);
      setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, printCount: 2 } }));
    } else if (index === 2) {
      if (isTouchChild.current) return;

      setCurrentIndex(2);
      isTouch.current = true;
      if (value > 3) {
        setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, printCount: value } }));
      } else {
        setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, printCount: 3 } }));
      }
    }
  };

  const handlePrevValue = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouch.current) return;

    playSoundTouch(false);
    isTouchChild.current = true;
    const newValue = value - 1 <= 3 ? 3 : value - 1;
    setValue(newValue);
    setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, printCount: newValue } }));
  };

  const handleNextValue = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouch.current) return;

    playSoundTouch(false);
    isTouchChild.current = true;
    const newValue = value + 1 >= 99 ? 99 : value + 1;
    setValue(newValue);
    setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, printCount: newValue } }));
  };

  const handlePrevPage = () => {
    playSoundTouch(false);
    setTimeout(() => {
      navigate('/select-frame-design');
    }, 300);
  };

  const handleNextPage = async () => {
    playSoundTouch(false);
    setTimeout(() => {
      navigate('/shooting');
    }, 300);
  };

  const handleTimeout = () => {
    setStore((prevStore) => ({ ...prevStore, orderInfo: { ...prevStore.orderInfo, ...INIT_STORE.orderInfo } }));
  };

  return (
    <div className='relative h-screen'>
      <BackgroundImage url={store.clientSetting.backgroundImageSecondary} />

      <div className='absolute inset-0 flex flex-col items-center justify-center gap-y-12'>
        <div className='absolute right-36 top-20 mt-2 h-[58px] w-[100px]'>
          <Countdown
            url={store.assetsFolderPath + store.resources.icons[10]?.relPath}
            time={300}
            routeGoToBack='/home'
            handleTimeout={handleTimeout}
          />
        </div>

        <div>
          <div className='flex items-center justify-center'>
            <div className='z-20 h-[80px] w-[132px] translate-x-7'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
            </div>

            <div className='z-10 h-[80px] w-[132px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
            </div>

            <div className='h-[80px] w-[132px] -translate-x-7'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
            </div>
          </div>

          <div className='relative z-30 h-[100px] w-[669px] -translate-y-6'>
            <div className='h-full w-full'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[39]?.relPath} />
            </div>

            <div className='absolute left-44 top-1/2 min-w-max -translate-y-1/2 font-rokkitt text-[32px] font-bold tracking-wider'>
              {i18n.language === 'en' && (
                <div>
                  <span>{translate('translation:selectPrintQuantity.title1')} </span>
                  <span className='text-custom-style-2-1'>{translate('translation:selectPrintQuantity.title2')} </span>
                  <span>{translate('translation:selectPrintQuantity.title3')}</span>
                </div>
              )}

              {i18n.language === 'vi' && (
                <div>
                  <span>{translate('translation:selectPrintQuantity.title1')} </span>
                  <span>{translate('translation:selectPrintQuantity.title2')} </span>
                  <span className='text-custom-style-2-1'>{translate('translation:selectPrintQuantity.title3')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='bg-custom-style-2-3 flex h-[90px] w-[650px] -translate-y-8 items-center justify-center gap-x-2 rounded-l-full rounded-r-full border-3 border-dashed border-custom-style-2-1 font-rokkitt text-2xl font-bold tracking-wide text-custom-style-2-1'>
          <div className='h-12 w-12'>
            <DisplayImage src={store.assetsFolderPath + store.resources.icons[58]?.relPath} />
          </div>
          {store.orderInfo.frameMode === CONST_MODE_CUTTING ? (
            <span>
              {translate('translation:selectPrintQuantity.note1')} {store.orderInfo.printCount * 2}{' '}
              {translate('translation:selectPrintQuantity.note2')}
            </span>
          ) : (
            <span>
              {translate('translation:selectPrintQuantity.note1')} {store.orderInfo.printCount}{' '}
              {translate('translation:selectPrintQuantity.note2')}
            </span>
          )}
        </div>

        <div className='flex items-center justify-center gap-x-10 font-rokkitt text-4xl font-bold'>
          <div
            className='relative h-52 w-80 rounded-2xl bg-custom-style-2-1 p-2'
            onTouchStart={() => handleChoosePrintQuantity(0)}
          >
            <div className='h-full w-full rounded-xl bg-custom-style-1 p-2'>
              <div className='flex h-full w-full items-center justify-center rounded-xl border-3 border-dashed border-custom-style-2-1'>
                <span>1 pcs</span>
              </div>
            </div>

            {currentIndex === 0 && (
              <div className='absolute -top-12 left-1/2 h-12 w-12 -translate-x-1/2'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
              </div>
            )}
          </div>

          <div
            className='relative h-52 w-80 rounded-2xl bg-custom-style-2-1 p-2'
            onTouchStart={() => handleChoosePrintQuantity(1)}
          >
            <div className='h-full w-full rounded-xl bg-custom-style-1 p-2'>
              <div className='flex h-full w-full items-center justify-center rounded-xl border-3 border-dashed border-custom-style-2-1'>
                <span>2 pcs</span>
              </div>
            </div>

            {currentIndex === 1 && (
              <div className='absolute -top-12 left-1/2 h-12 w-12 -translate-x-1/2'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
              </div>
            )}
          </div>

          <div
            className='relative h-52 w-80 rounded-2xl bg-custom-style-2-1 p-2'
            onTouchStart={() => handleChoosePrintQuantity(2)}
          >
            <div className='h-full w-full rounded-xl bg-custom-style-1 p-2'>
              <div className='relative flex h-full w-full items-center justify-center rounded-xl border-3 border-dashed border-custom-style-2-1'>
                <div className='-translate-x-8'>{value}</div>
                <div className='absolute right-24 top-1/2 -translate-y-1/2'>pcs</div>
              </div>
            </div>

            <div
              className='absolute left-6 top-1/2 h-12 w-12 -translate-y-1/2 rotate-90 p-2'
              onTouchStart={(event) => handlePrevValue(event)}
            >
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
              </div>
            </div>

            <div
              className='absolute right-6 top-1/2 h-12 w-12 -translate-y-1/2 -rotate-90 p-2'
              onTouchStart={(event) => handleNextValue(event)}
            >
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
              </div>
            </div>

            {currentIndex === 2 && (
              <div className='absolute -top-12 left-1/2 h-12 w-12 -translate-x-1/2'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[1]?.relPath} />
              </div>
            )}
          </div>
        </div>

        <div
          className='absolute left-8 top-1/2 flex h-[80px] w-[80px] -translate-y-1/2 items-center justify-center'
          onTouchStart={handlePrevPage}
        >
          <div className='h-[50px] w-[50px]'>
            <DisplayImage src={store.assetsFolderPath + store.resources.icons[42]?.relPath} />
          </div>
        </div>

        <div
          className='absolute right-8 top-1/2 flex h-[80px] w-[80px] -translate-y-1/2 items-center justify-center'
          onTouchStart={handleNextPage}
        >
          <div className='h-[50px] w-[50px]'>
            <DisplayImage src={store.assetsFolderPath + store.resources.icons[38]?.relPath} />
          </div>
        </div>
      </div>
    </div>
  );
}
