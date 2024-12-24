import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { InputStyle1 } from '../components/input';
import { useEffect, useState } from 'react';
import { KeyboardNumber } from '../components/keyboardNumber';
import { useNavigate } from 'react-router-dom';
import { CONST_ERROR, CONST_PICTURE_TIME } from '../libs/constants';
import { Countdown } from '../components/countdown';
import { useSound } from '../context/sound';
import { getRatioByFrameModeAndFrameType } from '../libs/common';

export default function EnterCode() {
  const { store, setStore } = useStore();
  const { t: translate } = useTranslation();
  const { playSoundBackground, playSoundTouch } = useSound();

  const navigate = useNavigate();

  const [values, setValues] = useState<string>('');

  const handleOnTouchGetValue = (value: string) => {
    if (values === CONST_PICTURE_TIME) return;

    let newValues = values;
    if (values === CONST_ERROR) {
      newValues = '';
    }

    if (value === 'trash') {
      newValues = '';
    } else if (value === 'back') {
      newValues = newValues.slice(0, newValues.length - 1);
    } else {
      newValues += value;
    }

    setValues(newValues);
  };

  const handleOnTouchStart = () => {
    playSoundTouch(false);
    navigate('/home');
  };

  const handleOnTouchStartSubmit = async (value: string) => {
    const _getOrderInfoById = await window.api.getOrderInfoById(value);
    if (_getOrderInfoById) {
      const { frameMode, frameType } = _getOrderInfoById;
      const ratio = getRatioByFrameModeAndFrameType(frameMode, frameType);
      setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, ..._getOrderInfoById, ratio: ratio } }));
      setValues(CONST_PICTURE_TIME);
      setTimeout(() => {
        navigate('/shooting');
      }, 1000);
    } else {
      setValues(CONST_ERROR);
    }
  };

  useEffect(() => {
    playSoundBackground(true);
  }, []);

  return (
    <div className='relative h-screen w-screen'>
      <BackgroundImage url={store.assetsFolderPath + store.clientSetting.backgroundImageSecondary} />

      <div className='absolute left-0 top-0 h-[381px] w-[351px]'>
        <DisplayImage src={store.assetsFolderPath + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute bottom-0 right-0 h-[440px] w-[406px] rotate-180'>
        <DisplayImage src={store.assetsFolderPath + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute inset-0 flex flex-col items-center'>
        <div className='absolute right-40 top-28 flex items-center justify-center gap-x-4'>
          <div onTouchStart={handleOnTouchStart} className='mt-3 h-[85px] w-[85px]'>
            <DisplayImage src={store.assetsFolderPath + store.resources.icons[11]?.relPath} />
          </div>

          <Countdown
            url={store.assetsFolderPath + store.resources.icons[10]?.relPath}
            time={90}
            routeGoToBack='/home'
          />
        </div>

        <div className='relative mt-24 h-[136px] w-[547px]'>
          <DisplayImage src={store.assetsFolderPath + store.resources.icons[9]?.relPath} />

          <div className='absolute left-1/2 top-1/2 min-w-max -translate-x-1/2 -translate-y-1/2 gap-x-10 text-6xl tracking-wider text-custom-style-1'>
            {values === CONST_PICTURE_TIME ? (
              <span>{translate('translation:enterCode.welcome')}</span>
            ) : values === CONST_ERROR ? (
              <span>{translate('translation:enterCode.enterAgain')}</span>
            ) : (
              <span>{translate('translation:enterCode.enterHere')}</span>
            )}
            <span className='ml-5 text-[60px]'>!</span>
          </div>
        </div>

        <div className='mt-10'>
          <div className='flex items-center justify-center gap-x-2'>
            <div className='h-[74px] w-[95px] -rotate-6'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
            </div>

            <div
              className={`h-[74px] w-[95px] delay-300 duration-700 ${values === CONST_PICTURE_TIME ? 'z-50 scale-[30]' : ''}`}
            >
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
            </div>

            <div className='h-[74px] w-[95px] rotate-6'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
            </div>
          </div>

          <div className='h-[115px] w-[768px] -translate-y-5'>
            <InputStyle1
              iconCamera={store.assetsFolderPath + store.resources.icons[12]?.relPath}
              iconBling={store.assetsFolderPath + store.resources.icons[13]?.relPath}
              iconFail={store.assetsFolderPath + store.resources.icons[16]?.relPath}
              handleOnTouchStartSubmit={handleOnTouchStartSubmit}
              value={values}
            />
          </div>
        </div>

        <div className='mt-8 h-[480px] w-[450px]'>
          <KeyboardNumber
            handleOnTouchGetValue={handleOnTouchGetValue}
            iconTrash={store.assetsFolderPath + store.resources.icons[14]?.relPath}
            iconBack={store.assetsFolderPath + store.resources.icons[15]?.relPath}
            iconBling={store.assetsFolderPath + store.resources.icons[13]?.relPath}
          />
        </div>
      </div>
    </div>
  );
}
