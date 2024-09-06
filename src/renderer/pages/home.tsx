import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_FONTS } from '../libs/constants';
import { changeFontByName, checkIsTouch } from '../libs/common';
import { BackgroundImage } from '../components/backgroundImage';
import { SelectLanguage } from '../components/selectLanguage';
import { useTranslation } from 'react-i18next';
import { VideoModal } from '../components/videoModal';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { store } = useStore();
  const { t: translate, i18n } = useTranslation();
  const [userLanguage, setUserLanguage] = useState<string>(store.systemConfigs.defaultLanguage);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(true);

  const navigate = useNavigate();

  const isTouchLanguage = useRef<boolean>(false);
  const isTouchCloseModal = useRef<boolean>(false);
  const isTouchShooting = useRef<boolean>(false);

  const handleChangeLanguage = (event: TouchEventAndMouseEventType, lang: string) => {
    if (!checkIsTouch(event, isTouchLanguage)) return;

    setUserLanguage(lang);
  };

  const handleOnTouchStart = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchShooting)) return;

    navigate('/enter-code');
  };

  const handleOnTouchCloseModal = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchCloseModal)) return;

    setIsOpenModal(false);
  };

  useEffect(() => {
    const fontName = CONST_CONFIG_FONTS[userLanguage as keyof typeof CONST_CONFIG_FONTS];
    changeFontByName(fontName);
    i18n.changeLanguage(userLanguage);
  }, [userLanguage]);

  return (
    <div className='h-screen w-screen'>
      <BackgroundImage
        backgroundPrimary={store.pathFolderAssets + store.systemConfigs.backgroundImageTypeA}
        backgroundSecondary={store.pathFolderAssets + store.systemConfigs.backgroundImageTypeB}
      >
        {isOpenModal && (
          <div
            onTouchStart={(event) => handleOnTouchCloseModal(event)}
            onMouseDown={(event) => handleOnTouchCloseModal(event)}
            className='border-custom-pink absolute left-1/2 top-1/2 z-10 mt-3 h-[538px] w-[838px] -translate-x-1/2 -translate-y-1/2 rounded-md border-4 border-dashed bg-white p-2'
          >
            <VideoModal videoUrl={store.pathFolderAssets + store.systemConfigs.videoIntro} />

            <div className='absolute -bottom-20 left-0 right-0 text-center font-rokkitt text-4xl tracking-wider'>
              <span>{translate('translation:home.closeVideo')}</span>
            </div>

            <div className='absolute -right-[42px] -top-[42px] h-20 w-20 p-4'>
              <img src={store.pathFolderAssets + store.resources.icons[7]?.relPath} alt='' />
            </div>
          </div>
        )}

        <div className='flex h-full w-full items-center justify-center px-36'>
          <div className='relative h-full grow'>
            <div className='text-4xl tracking-wider'>
              <div className='relative my-24 flex h-40 items-center justify-center'>
                <div className='flex h-[14xpx] w-[536px] items-center justify-center'>
                  <img src={store.pathFolderAssets + store.resources.icons[0]?.relPath} alt='' />
                </div>

                <div className='absolute left-1/2 top-1/2 mt-2 min-w-max -translate-x-1/2 -translate-y-1/2 font-moreSugar text-skin-base'>
                  {translate('translation:home.companyName')}
                </div>
              </div>

              <div className='flex flex-col items-center justify-center gap-y-24 font-rokkitt text-4xl'>
                <div
                  className='h-80 w-80'
                  onTouchStart={(event) => handleOnTouchStart(event)}
                  onMouseDown={(event) => handleOnTouchStart(event)}
                >
                  <img src={store.pathFolderAssets + store.resources.icons[6]?.relPath} alt='' />
                </div>

                <div>
                  <span>{translate('translation:home.noteTouchAbove')}</span>
                </div>
              </div>
            </div>

            <div className='absolute bottom-16 left-14'>
              <SelectLanguage language={userLanguage} handleOnTouchStart={handleChangeLanguage} />
            </div>

            <div className='absolute bottom-1/2 left-36 h-36 w-36 -rotate-12'>
              <img src={store.pathFolderAssets + store.resources.icons[4]?.relPath} alt='' />
            </div>

            <div className='absolute right-32 top-48 h-36 w-36'>
              <img src={store.pathFolderAssets + store.resources.icons[3]?.relPath} alt='' />
            </div>

            <div className='absolute bottom-24 right-52 h-36 w-36 rotate-12'>
              <img src={store.pathFolderAssets + store.resources.icons[2]?.relPath} alt='' />
            </div>
          </div>
        </div>
      </BackgroundImage>
    </div>
  );
}
