import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { Countdown } from '../components/countdown';
import { DisplayImage } from '../components/displayImage';
import { useStore } from '../context/store';
import { CONST_MODE_REGULAR, CONST_TYPE_FRAMES_FOR_DOUBLE } from '../libs/constants';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIsTouch } from '../libs/common';

export default function ConfirmFrame() {
  const { store, setStore } = useStore();
  const { t: translate } = useTranslation();

  const navigate = useNavigate();

  const checkIsDoubleFrames = () => {
    const { frameMode, frameType } = store.orderInfo;
    // use mock data frameRelPath
    // const { frameMode, frameType } = CONST_MOCK_DATA_FRAME;
    let isDouble = false;
    if (frameMode === CONST_MODE_REGULAR && CONST_TYPE_FRAMES_FOR_DOUBLE.includes(frameType)) {
      isDouble = true;
    }

    return isDouble;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDouble, setIsDouble] = useState<boolean>(checkIsDoubleFrames());

  const isTouchReady = useRef<boolean>(false);
  const isTouchChooseAgain = useRef<boolean>(false);

  const handleOnTouchStartReady = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchReady)) return;

    setTimeout(() => {
      navigate('/shooting-method');
    }, 300);
  };

  const handleOnTouchStartChooseAgain = (event: TouchEventAndMouseEventType) => {
    if (!checkIsTouch(event, isTouchChooseAgain)) return;

    // navigate('/select-frameRelPath');
  };

  return (
    <div className='relative h-screen w-screen'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute left-0 top-0 h-[243px] w-[224px]'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute bottom-0 right-0 h-[210px] w-[194px] rotate-180'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute inset-0 p-40'>
        <div className='absolute right-40 top-28'>
          <Countdown
            url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
            time={90}
            routeGoToBack='/enter-code'
          />
        </div>

        <div className='flex h-full w-full items-center justify-center gap-x-24'>
          <div
            onTouchStart={(event) => handleOnTouchStartReady(event)}
            onMouseDown={(event) => handleOnTouchStartReady(event)}
            className='flex flex-col items-center justify-center'
          >
            <div className='flex items-center justify-center'>
              <div className='z-10 h-[109px] w-[140px] translate-x-3 -rotate-12'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>

              <div className='h-[109px] w-[140px] -translate-x-3'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
              </div>
            </div>

            <div className='z-20 flex -translate-y-7 flex-col items-center justify-center gap-y-2'>
              <div className='relative h-[136px] w-[547px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[9]?.relPath} />
                </div>

                <div className='absolute inset-0 flex min-w-max items-center justify-center text-4xl text-custom-style-1'>
                  <span>{translate('translation:confirmFrame.confirm')}</span>
                </div>
              </div>

              <div className='relative h-[48px] w-[64px]'>
                <div className='absolute right-1.5 top-0 h-full w-[61px] rotate-180'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[29]?.relPath} />
                </div>

                <div className='absolute h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[1]?.relPath} />
                </div>
              </div>

              <div className='relative h-[432px] w-[704px]'>
                <div className='absolute top-3 h-full w-full rounded-[50px] bg-custom-style-3-1 opacity-50'></div>

                <div className='absolute h-full w-full rounded-[50px] border-[20px] border-custom-style-2-1 bg-custom-style-1 p-3'>
                  <div className='h-full w-full rounded-2xl border-[6px] border-dashed border-custom-style-2-1 p-8'>
                    <div className='flex h-full w-full items-center justify-center'>
                      <div className='flex h-full w-1/2 items-center justify-center'>
                        {isDouble ? (
                          <div className='flex h-full w-full flex-col items-center justify-center'>
                            <div className={`h-[146px] w-[219px]`}>
                              <DisplayImage src={store.pathFolderAssets + store.orderInfo.frameRelPath} />
                            </div>

                            <div className={`h-[146px] w-[219px]`}>
                              <DisplayImage src={store.pathFolderAssets + store.orderInfo.frameRelPath} />
                            </div>
                          </div>
                        ) : (
                          <div className='flex items-center justify-center'>
                            <div className={`h-[292px] w-[195px]`}>
                              <DisplayImage src={store.pathFolderAssets + store.orderInfo.frameRelPath} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='flex grow flex-col items-center justify-center gap-y-10'>
                        <div className='text-center font-rokkitt text-[26px] tracking-wider'>
                          <div className='min-w-max'>
                            <span>{translate('translation:confirmFrame.isReadyText1')}</span>
                          </div>

                          <div className='min-w-max'>
                            <span>{translate('translation:confirmFrame.isReadyText2')}</span>
                          </div>
                        </div>

                        <div className='h-[102px] w-[121px]'>
                          <DisplayImage src={store.pathFolderAssets + store.resources.icons[20]?.relPath} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            onTouchStart={(event) => handleOnTouchStartChooseAgain(event)}
            onMouseDown={(event) => handleOnTouchStartChooseAgain(event)}
            className='flex flex-col items-center justify-center'
          >
            <div className='flex items-center justify-center gap-x-7'>
              <div className='h-[109px] w-[140px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='flex -translate-y-7 flex-col items-center justify-center gap-y-2'>
              <div className='relative h-[136px] w-[547px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[17]?.relPath} />
                </div>

                <div className='absolute inset-0 flex min-w-max items-center justify-center text-4xl text-custom-style-1'>
                  <span>{translate('translation:confirmFrame.chooseAgain')}</span>
                </div>
              </div>

              <div className='relative h-[48px] w-[64px]'>
                <div className='absolute right-1.5 top-0 h-full w-[61px] rotate-180'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[29]?.relPath} />
                </div>

                <div className='absolute h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[18]?.relPath} />
                </div>
              </div>

              <div className='relative h-[432px] w-[704px]'>
                <div className='absolute top-3 h-full w-full rounded-[50px] bg-custom-style-3-1 opacity-50'></div>

                <div className='absolute h-full w-full rounded-[50px] border-[20px] border-custom-style-4-1 bg-custom-style-1 p-3'>
                  <div className='h-full w-full rounded-2xl border-[6px] border-dashed border-custom-style-4-1 p-8'>
                    <div className='flex h-full w-full items-center justify-center'>
                      <div className='flex h-full w-1/2 items-center justify-center'>
                        <div className={`h-[292px] w-[100px]`}>
                          <DisplayImage src={store.pathFolderAssets + store.resources.icons[19]?.relPath} />
                        </div>
                      </div>

                      <div className='flex grow flex-col items-center justify-center gap-y-10'>
                        <div className='text-center font-rokkitt text-[26px] tracking-wider'>
                          <div className='min-w-max'>
                            <span>{translate('translation:confirmFrame.isChooseAgainText1')}</span>
                          </div>

                          <div className='min-w-max'>
                            <span>{translate('translation:confirmFrame.isChooseAgainText2')}</span>
                          </div>
                        </div>

                        <div className='h-[102px] w-[121px]'>
                          <DisplayImage src={store.pathFolderAssets + store.resources.icons[21]?.relPath} />
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
    </div>
  );
}
