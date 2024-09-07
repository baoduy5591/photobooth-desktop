import React from 'react';
import { useTranslation } from 'react-i18next';
import { CONST_CONFIG_LANGUAGE } from '../libs/constants';
import { useStore } from '../context/store';
import { DisplayImage } from './displayImage';

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
      <div className='text-custom-style-1 flex select-none items-center justify-center gap-x-4 text-center font-rokkitt font-medium tracking-widest'>
        {Object.keys(CONST_CONFIG_LANGUAGE).map((lang: string, index: number) => {
          return (
            <div key={index} className='flex flex-col items-center'>
              <div className='h-[26px] w-[34px]'>
                {language === lang && <DisplayImage src={store.pathFolderAssets + store.resources.icons[1]?.relPath} />}
              </div>

              <div
                className={`flex h-[63px] w-[100px] items-center justify-center rounded-[22px] p-2 ${language === lang ? 'bg-custom-style-2-1' : 'bg-custom-style-3-2'}`}
                onTouchStart={(event) => handleOnTouchStart(event, lang)}
                onMouseDown={(event) => handleOnTouchStart(event, lang)}
              >
                <div className='border-custom-style-1 flex h-full w-full items-center justify-center rounded-md border border-dashed text-[21px]'>
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
