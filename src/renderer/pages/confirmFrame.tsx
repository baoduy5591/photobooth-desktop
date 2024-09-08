import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { CountDown } from '../components/countDown';
import { DisplayImage } from '../components/displayImage';
import { useStore } from '../context/store';

export default function ConfirmFrame() {
  const { store } = useStore();
  const { t: translate } = useTranslation();

  return (
    <div className='relative h-screen w-screen'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute left-0 top-0 h-[243px] w-[224px]'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute bottom-0 right-0 h-[210px] w-[194px] rotate-180'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[8]?.relPath} />
      </div>

      <div className='absolute inset-0 flex flex-col items-center p-40'>
        <div className='absolute right-40 top-28'>
          <CountDown
            url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
            time={90}
            routeGoToBack='/enter-code'
          />
        </div>

        <div className='flex h-full w-full items-center justify-center gap-x-24'>
          <div className='flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center gap-x-7'>
              <div className='h-[109px] w-[140px] translate-x-40 rotate-12'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
              </div>

              <div className='h-[109px] w-[140px] -translate-x-32 -rotate-[8deg]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>
            </div>

            <div className='flex -translate-y-7 flex-col items-center justify-center gap-y-2'>
              <div className='relative h-[136px] w-[547px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[9]?.relPath} />
                </div>

                <div className='text-custom-style-1 absolute inset-0 flex min-w-max items-center justify-center text-4xl'>
                  <span>{translate('translation:confirmFrame.confirm')}</span>
                </div>
              </div>

              <div className='h-[48px] w-[64px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[1]?.relPath} />
              </div>

              <div className='relative h-[432px] w-[704px]'>
                <div className='bg-custom-style-3-1 absolute top-3 h-full w-full rounded-[50px] opacity-50'></div>

                <div className='border-custom-style-2-1 bg-custom-style-1 absolute h-full w-full rounded-[50px] border-[20px] p-3'>
                  <div className='border-custom-style-2-1 h-full w-full rounded-2xl border-[6px] border-dashed'></div>
                </div>
              </div>
            </div>
          </div>

          {/*  */}

          <div className='flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center gap-x-7'>
              <div className='h-[108px] w-[140px] translate-y-2'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='flex -translate-y-7 flex-col items-center justify-center gap-y-2'>
              <div className='relative h-[136px] w-[547px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[19]?.relPath} />
                </div>

                <div className='text-custom-style-1 absolute inset-0 flex min-w-max items-center justify-center text-4xl'>
                  <span>{translate('translation:confirmFrame.chooseAgain')}</span>
                </div>
              </div>

              <div className='h-[48px] w-[64px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[20]?.relPath} />
              </div>

              <div className='relative h-[450px] w-[720px]'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[18]?.relPath} />
                </div>

                <div className='absolute inset-0'>
                  <div className='flex h-full w-full items-center justify-center'>
                    <div className='h-[242px] w-[96px]'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[21]?.relPath} />
                    </div>

                    <div className='grow'></div>
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
