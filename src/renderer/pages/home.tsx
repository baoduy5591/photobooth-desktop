import { useEffect, useRef, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_FONTS } from '../libs/constants';
import { changeFontByName, checkIsTouch } from '../libs/common';
import { BackgroundImage } from '../components/backgroundImage';
import { SelectLanguage } from '../components/selectLanguage';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { store } = useStore();
  const { t: translate, i18n } = useTranslation();
  const [userLanguage, setUserLanguage] = useState<string>(store.systemConfigs.defaultLanguage);

  const isTouch = useRef<boolean>(false);

  const handleChangeLanguage = (event: TouchEventAndMouseEventType, lang: string) => {
    const _isTouch = checkIsTouch(event, isTouch);
    if (!_isTouch) return;

    setUserLanguage(lang);
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
        <div className='flex h-full w-full items-center justify-center px-36'>
          <div className='relative flex h-full grow flex-col items-center justify-center'>
            <div className='text-align relative flex justify-center text-4xl tracking-wider text-skin-base'>
              <img src={store.pathFolderAssets + store.resources.icons[0]?.relPath} alt='' />
              <div className='absolute left-1/2 top-1/2 min-w-max -translate-x-1/2 -translate-y-1/2 font-moreSugar'>
                {translate('translation:companyName')}
              </div>
            </div>

            <div className='absolute bottom-16 left-14'>
              <SelectLanguage language={userLanguage} handleOnTouchStart={handleChangeLanguage} />
            </div>

            <div className='absolute bottom-1/2 left-40 h-32 w-32 -rotate-12'>
              <img src={store.pathFolderAssets + store.resources.icons[4]?.relPath} alt='' />
            </div>

            <div className='absolute right-36 top-1/4 h-32 w-32'>
              <img src={store.pathFolderAssets + store.resources.icons[3]?.relPath} alt='' />
            </div>

            <div className='absolute right-56 top-3/4 h-32 w-32 rotate-12'>
              <img src={store.pathFolderAssets + store.resources.icons[2]?.relPath} alt='' />
            </div>
          </div>
        </div>
      </BackgroundImage>
    </div>
  );
}
