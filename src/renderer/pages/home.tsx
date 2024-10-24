import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_FONTS } from '../libs/constants';
import { changeFontByName, checkIsTouch } from '../libs/common';
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
    setTimeout(() => {
      navigate('/enter-code');
    }, 300);
  };

  const handleOnTouchCloseModal = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchCloseModal)) return;

    playSoundTouch(false);
    setIsOpenModal(false);
  };

  useEffect(() => {
    const fontName = CONST_CONFIG_FONTS[userLanguage as keyof typeof CONST_CONFIG_FONTS];
    changeFontByName(fontName);
    i18n.changeLanguage(userLanguage);
  }, [userLanguage]);

  useEffect(() => {
    const deleteFiles = async () => {
      const _deleteFiles = await window.api.deleteFiles();
      if (!_deleteFiles) {
        alert('Something error !!!');
      }
    };

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

          {/* <div className='absolute bottom-16 left-14'>
            <SelectLanguage language={userLanguage} handleOnTouchStart={handleChangeLanguage} />
          </div> */}

          <div className='absolute bottom-1/2 left-28 h-[102px] w-[132px] -rotate-12'>
            <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
          </div>

          <div className='absolute right-28 top-56 h-[102px] w-[132px]'>
            <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
          </div>

          <div className='absolute bottom-32 right-48 h-[102px] w-[132px] rotate-12'>
            <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
          </div>
        </div>
      </div>
    </div>
  );
}
