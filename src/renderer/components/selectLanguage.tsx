import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONST_CONFIG_LANGUAGE } from '../libs/constants';
import { useStore } from '../context/store';

interface SelectLanguageProps {
  language: string;
  handleOnTouchStart: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    lang: string,
  ) => void;
}

export const SelectLanguage = React.memo(
  function SelectLanguage({ language, handleOnTouchStart }: SelectLanguageProps) {
    const { t: translate } = useTranslation();
    const { store } = useStore();

    return (
      <div className='flex select-none items-center justify-center gap-x-4 text-center font-rokkitt text-2xl font-medium tracking-widest text-skin-base'>
        {Object.keys(CONST_CONFIG_LANGUAGE).map((lang: string, index: number) => {
          return (
            <div key={index} className='flex flex-col items-center'>
              <div className='h-9 w-9'>
                {language === lang && <img src={store.pathFolderAssets + store.resources.icons[1]?.relPath} alt='' />}
              </div>

              <div
                className={`flex h-20 w-32 items-center justify-center rounded-[32px] bg-skin-fill-button p-3 ${language === lang ? 'bg-skin-fill-button' : 'bg-skin-fill-button-muted'}`}
                onTouchStart={(event) => handleOnTouchStart(event, lang)}
                onMouseDown={(event) => handleOnTouchStart(event, lang)}
              >
                <div className='flex h-full w-full items-center justify-center rounded-xl border border-dashed border-white'>
                  <span>{translate(`translation:languages.${lang as keyof typeof CONST_CONFIG_LANGUAGE}`)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.language === nextProps.language;
  },
);
