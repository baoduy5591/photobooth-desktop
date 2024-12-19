import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_FONTS } from '../libs/constants';
import { changeFontByName, checkIsTouch, getPositionByAngle } from '../libs/common';
import { BackgroundImage } from '../components/backgroundImage';
import { SelectLanguage } from '../components/selectLanguage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DisplayImage } from '../components/displayImage';
import { DisplayVideo } from '../components/displayVideo';
import { useSound } from '../context/sound';

export default function Home() {
  const { store } = useStore();
  const { playSoundTouch } = useSound();
  const { t: translate, i18n } = useTranslation();
  const [userLanguage, setUserLanguage] = useState<string>(store.systemConfigs.defaultLanguage);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(true);
  const [isStart, setIsStart] = useState<boolean>(false);

  const navigate = useNavigate();

  const isTouchLanguage = useRef<boolean>(false);
  const isTouchCloseModal = useRef<boolean>(false);
  const isTouchShooting = useRef<boolean>(false);

  const handleChangeLanguage = (event: TouchEventAndMouseEventType, lang: string) => {
    if (!checkIsTouch(event, isTouchLanguage)) return;

    playSoundTouch(false);
    setUserLanguage(lang);
  };

  const handleOnTouchStart = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchShooting)) return;

    playSoundTouch(false);
    setIsStart(true);
    setTimeout(() => {
      navigate('/enter-code');
    }, 800);
  };

  const handleOnTouchCloseModal = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchCloseModal)) return;

    playSoundTouch(false);
    setIsOpenModal(false);
  };

  const deleteFiles = async () => {
    const _deleteFiles = await window.api.deleteFiles();
    if (!_deleteFiles) {
      alert('Something error, please check again !!!');
    }
  };

  useEffect(() => {
    const fontName = CONST_CONFIG_FONTS[userLanguage as keyof typeof CONST_CONFIG_FONTS];
    changeFontByName(fontName);
    i18n.changeLanguage(userLanguage);
  }, [userLanguage]);

  useEffect(() => {
    deleteFiles();
  }, []);

  return (
    <div className='relative h-screen w-screen'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[0]?.relPath} />

      {isOpenModal && (
        <div className='absolute left-1/2 top-1/2 z-10 mt-3 h-[540px] w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-md border-4 border-dashed border-custom-style-2-1 bg-custom-style-1 p-1'>
          <DisplayVideo src={store.pathFolderAssets + store.systemConfigs.videoIntro} />

          <div className='absolute -bottom-20 left-0 right-0 text-center font-rokkitt text-[27px] tracking-wider text-custom-style-3-1'>
            <span>{translate('translation:home.closeVideo')}</span>
          </div>

          <div
            onTouchStart={(event) => handleOnTouchCloseModal(event)}
            onMouseDown={(event) => handleOnTouchCloseModal(event)}
            className='absolute -right-[42px] -top-[42px] h-20 w-20 p-4'
          >
            <div className='h-[46px] w-[46px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[7]?.relPath} />
            </div>
          </div>
        </div>
      )}

      <div className='flex h-full w-full items-center justify-center px-36'>
        <div className='relative h-full grow'>
          <div className='tracking-wider'>
            <div className='relative my-24 flex h-40 items-center justify-center'>
              <div className='flex h-[142px] w-[565px] items-center justify-center'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[0]?.relPath} />
              </div>

              <div className='absolute left-1/2 top-1/2 mt-2 min-w-max -translate-x-1/2 -translate-y-1/2 font-moreSugar text-[46px] text-custom-style-1'>
                {translate('translation:home.companyName')}
              </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-y-20 font-rokkitt'>
              <div
                className='h-[350px] w-[350px]'
                onTouchStart={(event) => handleOnTouchStart(event)}
                onMouseDown={(event) => handleOnTouchStart(event)}
              >
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[6]?.relPath} />
              </div>

              <div className='text-[27px] text-custom-style-3-1'>
                <span>{translate('translation:home.noteTouchAbove')}</span>
              </div>
            </div>
          </div>

          <div className='absolute bottom-16 left-14'>
            <SelectLanguage language={userLanguage} handleOnTouchStart={handleChangeLanguage} />
          </div>

          <Mochi
            src={store.pathFolderAssets + store.resources.icons[4]?.relPath}
            x0={100}
            y0={300}
            wrapperPosition={{ left: 15, top: 5, bottom: 800, right: 250 }}
            isStart={isStart}
            customClassName={''}
          />

          <Mochi
            src={store.pathFolderAssets + store.resources.icons[3]?.relPath}
            x0={1400}
            y0={250}
            wrapperPosition={{ left: 1200, top: 5, bottom: 350, right: 1500 }}
            isStart={isStart}
            customClassName={''}
          />

          <Mochi
            src={store.pathFolderAssets + store.resources.icons[2]?.relPath}
            x0={1300}
            y0={850}
            wrapperPosition={{ left: 1300, top: 600, bottom: 1000, right: 1500 }}
            isStart={isStart}
            customClassName={''}
          />
        </div>
      </div>
    </div>
  );
}

interface MochiProps {
  src: string;
  x0: number;
  y0: number;
  wrapperPosition: { left: number; top: number; right: number; bottom: number };
  customClassName: string;
  isStart: boolean;
}

export function Mochi({ src, x0, y0, wrapperPosition, isStart, customClassName = '' }: MochiProps) {
  let duration = 5;
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: x0, y: y0 });
  const [isMove, setIsMove] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { left, top, right, bottom } = wrapperPosition;
    const x1 = Math.floor(Math.random() * (right - left + 1)) + left;
    const y1 = Math.floor(Math.random() * (bottom - top + 1)) + top;
    setPosition((prev) => ({ ...prev, x: x1, y: y1 }));
  }, [isMove]);

  useEffect(() => {
    const id = setTimeout(() => {
      const _getPositionByAngle = getPositionByAngle(x0, y0, position.x, position.y);
      const x2 = _getPositionByAngle.x;
      const y2 = _getPositionByAngle.y;
      setPosition((prev) => ({ ...prev, x: x2, y: y2 }));
      x0 = x2;
      y0 = y2;
      setIsMove(!isMove);
    }, duration * 1000);

    return () => clearTimeout(id);
  }, [position]);
  return (
    <div
      ref={elementRef}
      className={`z-50 h-[102px] w-[132px] ${customClassName}`}
      style={{
        position: 'absolute',
        top: isStart ? `${y0}px` : `${position.y}px`,
        left: isStart ? `${x0}px` : `${position.x}px`,
        transform: isStart ? 'scale(2000%)' : '',
        transition: isStart ? 'transform 0.8s' : `top ${duration}s, left ${duration}s`,
      }}
    >
      <DisplayImage src={src} />
    </div>
  );
}
