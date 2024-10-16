import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { Countdown } from '../components/countdown';
import { DisplayImage } from '../components/displayImage';
import { useStore } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { checkIsTouch } from '../libs/common';
import { useRef } from 'react';
import { CONST_COUNTDOWN_METHOD, CONST_REMOTE_METHOD } from '../libs/constants';
import { useSound } from '../context/sound';

export default function ShootingMethod() {
  const { store, setStore } = useStore();
  const { t: translate } = useTranslation();

  const navigate = useNavigate();

  const { playSoundTouch } = useSound();

  const isTouchChooseCountdown = useRef<boolean>(false);

  const handleOnTouchStartChooseShootingMethod = (event: TouchEventAndMouseEventType, method: string) => {
    if (!checkIsTouch(event, isTouchChooseCountdown)) return;

    playSoundTouch(false);
    setStore((store) => ({ ...store, shootingMethod: method }));
    setTimeout(() => {
      navigate('/shooting');
    }, 500);
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute -left-20 top-8 h-[200.6px] w-[535px]'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[22]?.relPath} />
      </div>

      <div className='absolute -bottom-6 right-0 h-[321.7px] w-[300px]'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[28]?.relPath} />
      </div>

      <div className='absolute -bottom-12 -left-10 h-[199px] w-[585px]'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[23]?.relPath} />
      </div>

      <div className='absolute inset-0 px-40 py-16'>
        <div className='absolute right-40 top-28'>
          <Countdown
            url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
            time={300}
            routeGoToBack='/shooting'
          />
        </div>

        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-5/12 flex-col items-center justify-center'>
            <div className='relative h-[432px] w-[466.4px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[25]?.relPath} />
              </div>

              <div className='absolute left-[140px] top-[150px] max-w-min text-[48px] leading-none text-custom-style-2-1'>
                <span>{translate('translation:shootingMethod.shootingMethodTitle')}</span>
              </div>
            </div>

            <div className='mr-10 flex items-center justify-center'>
              <div className='z-20 h-[147.5px] w-[190px] translate-x-8 -rotate-12'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>

              <div className='z-10 h-[147.5px] w-[190px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
              </div>

              <div className='h-[147.5px] w-[190px] -translate-x-2 rotate-12'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='mt-4 h-[65px] w-[442px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[24]?.relPath} />
            </div>
          </div>

          <div className='ml-5 mt-9 flex h-full grow flex-col items-start justify-center gap-y-16'>
            <div
              onTouchStart={(event) => handleOnTouchStartChooseShootingMethod(event, CONST_COUNTDOWN_METHOD)}
              className='flex flex-col items-center justify-center'
            >
              <div className='flex items-center justify-center gap-y-2'>
                <div className='relative h-[60.3px] w-[80px]'>
                  <div className='absolute left-1 top-1.5 h-full w-[75px] rotate-90'>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[29]?.relPath} />
                  </div>

                  <div className='absolute left-0 top-0 h-full w-full -rotate-90'>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[1]?.relPath} />
                  </div>
                </div>

                <div className='relative h-[400.6px] w-[636.5px]'>
                  <div className='absolute top-3 h-full w-full rounded-[50px] bg-custom-style-3-1 opacity-50'></div>

                  <div className='absolute h-full w-full rounded-[50px] border-[20px] border-custom-style-2-1 bg-custom-style-1 p-3'>
                    <div className='flex h-full w-full flex-col items-center justify-center gap-y-8 rounded-2xl border-[6px] border-dashed border-custom-style-2-1 p-8'>
                      <div className='flex flex-col items-center justify-center gap-y-1 text-center font-rokkitt text-[26px] tracking-wider'>
                        <div className='min-w-max text-[29px] font-bold'>
                          <span>{translate('translation:shootingMethod.countdownTitle')}</span>
                        </div>

                        <div className='min-w-max'>
                          <span>{translate('translation:shootingMethod.countdownText1')}</span>
                        </div>

                        <div className='min-w-max'>
                          <span>{translate('translation:shootingMethod.countdownText2')}</span>
                        </div>
                      </div>

                      <div className='h-[101px] w-[101px]'>
                        <DisplayImage src={store.pathFolderAssets + store.resources.icons[26]?.relPath} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              onTouchStart={(event) => handleOnTouchStartChooseShootingMethod(event, CONST_REMOTE_METHOD)}
              className='flex flex-col items-center justify-center'
            >
              <div className='flex items-center justify-center gap-y-2'>
                <div className='relative h-[60.3px] w-[80px]'>
                  <div className='absolute left-1 top-1.5 h-full w-[75px] rotate-90'>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[29]?.relPath} />
                  </div>

                  <div className='absolute left-0 top-0 h-full w-full -rotate-90'>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[18]?.relPath} />
                  </div>
                </div>

                <div className='relative h-[400.6px] w-[636.5px]'>
                  <div className='absolute top-3 h-full w-full rounded-[50px] bg-custom-style-3-1 opacity-50'></div>

                  <div className='absolute h-full w-full rounded-[50px] border-[20px] border-custom-style-5-1 bg-custom-style-1 p-3'>
                    <div className='flex h-full w-full flex-col items-center justify-center gap-y-8 rounded-2xl border-[6px] border-dashed border-custom-style-5-1 p-8'>
                      <div className='flex flex-col items-center justify-center gap-y-1 text-center font-rokkitt text-[26px] tracking-wider'>
                        <div className='min-w-max text-[29px] font-bold'>
                          <span>{translate('translation:shootingMethod.remoteTitle')}</span>
                        </div>

                        <div className='min-w-max'>
                          <span>{translate('translation:shootingMethod.remoteText1')}</span>
                        </div>

                        <div className='min-w-max'>
                          <span>{translate('translation:shootingMethod.remoteText2')}</span>
                        </div>
                      </div>

                      <div className='h-[101px] w-[101px]'>
                        <DisplayImage src={store.pathFolderAssets + store.resources.icons[27]?.relPath} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
