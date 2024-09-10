import { useState } from 'react';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { CONST_MOCK_DATA_FRAME, CONST_MODE_REGULAR, CONST_TYPE_FRAMES_FOR_DOUBLE } from '../libs/constants';
import { Countdown } from '../components/countdown';

export default function SelectPhotos() {
  const { store } = useStore();

  const checkIsDoubleFrames = () => {
    // const { modeFrame, typeFrame } = store.orderInfo;
    // use mock data frame
    const { modeFrame, typeFrame } = CONST_MOCK_DATA_FRAME;
    let isDouble = false;
    if (modeFrame === CONST_MODE_REGULAR && CONST_TYPE_FRAMES_FOR_DOUBLE.includes(typeFrame)) {
      isDouble = true;
    }

    return isDouble;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDouble, setIsDouble] = useState<boolean>(checkIsDoubleFrames());

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute inset-0 p-6'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[550px] flex-col items-center justify-center'>
            <div className='relative h-[143.2px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[37]?.relPath} />
              </div>

              <div className='absolute left-[110px] top-[30px] text-[32px] text-custom-style-1'>
                <span className='text-custom-style-2-1'>1</span>
                <span>/</span>
                <span>{CONST_MOCK_DATA_FRAME.quantityImages}</span>
              </div>
            </div>

            <div className='flex items-center justify-center gap-x-8'>
              <div className='h-[78.6px] w-[101.3px] -rotate-6'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>

              <div className='h-[78.6px] w-[101.3px] rotate-6'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='flex min-h-[640px] w-full -translate-y-4 items-center justify-center'>
              {isDouble ? (
                <div className='flex h-full w-full flex-col items-center justify-center gap-y-2'>
                  <div className={`h-[320px] w-[426.7px]`}>
                    <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                  </div>

                  <div className={`h-[320px] w-[426.7px]`}>
                    <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                  </div>
                </div>
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <div className={`h-[640px] w-[426.7px]`}>
                    <DisplayImage src={store.pathFolderAssets + CONST_MOCK_DATA_FRAME.frame} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='relative flex h-full grow flex-col items-center justify-center gap-y-8'>
            <div className='absolute left-[80px] top-[155px] h-[80.1px] w-[103.2px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
            </div>

            <div className='flex w-full translate-x-0 translate-y-0 items-center justify-end gap-x-6 px-10'>
              <div className='relative h-[99.5px] w-[668.7px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[39]?.relPath} />
                </div>

                <div className='absolute left-[170px] top-[29px] font-rokkitt text-[32px] font-bold tracking-wider'>
                  <span>Select </span>
                  <span className='text-custom-style-2-1'>{CONST_MOCK_DATA_FRAME.quantityImages} </span>
                  <span>Photos To Print</span>
                </div>
              </div>

              <div className='mb-3'>
                <Countdown
                  url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
                  time={90}
                  routeGoToBack='/home'
                />
              </div>
            </div>

            <div className='z-10 h-[730.4px] w-[1041.6px] rounded-xl bg-custom-style-3-1'>
              <div className='flex h-full w-full flex-col items-center justify-center'>
                <div className='my-4 h-[28px] w-[150px] rounded-full bg-custom-style-1'></div>
                <div className='h-full w-full px-10'>
                  <div className='h-full w-full bg-custom-style-1'></div>
                </div>
                <div className='my-4 min-h-[50px] min-w-[50px] rounded-full bg-custom-style-1 p-1.5'>
                  <div className='h-full w-full rounded-full bg-custom-style-3-1'></div>
                </div>
              </div>
            </div>

            <div className='absolute bottom-0 left-0 right-0 text-center font-rokkitt text-[24px] text-custom-style-3-1'>
              <div className='min-w-max'>
                <span>※ Slide to see more photos</span>
              </div>
              <div className='min-w-max'>
                <span>※ To deselect, touch the picture you want to cancel</span>
              </div>
            </div>
          </div>

          <div className='flex h-full w-[200px] items-center justify-center'>
            <div className='h-[79.8px] w-[79.8px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[38]?.relPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
