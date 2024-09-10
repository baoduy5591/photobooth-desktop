import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { Countdown } from '../components/countdown';
import { DisplayImage } from '../components/displayImage';
import { useStore } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Shooting() {
  const { store, setStore } = useStore();
  const { t: translate } = useTranslation();

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8080/video');
    ws.binaryType = 'blob';
    ws.onmessage = (event) => {
      if (imgRef.current) {
        const blob = event.data;
        const url = URL.createObjectURL(blob);

        imgRef.current.src = url;
        imgRef.current.onload = () => {
          URL.revokeObjectURL(url);
        };
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute inset-0'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[300px] flex-col items-center justify-end'>
            <div className='relative h-[251px] w-[271px]'>
              <div className='h-full w-full scale-x-[-1]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[25]?.relPath} />
              </div>

              <div className='absolute left-[90px] top-[80px] text-[36px] text-custom-style-2-1'>
                <span>Nice</span>
              </div>
            </div>

            <div className='relative h-[200px] w-full'>
              <div className='absolute -top-[35px] left-[55px] h-[98.4px] w-[98.4px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[30]?.relPath} />
              </div>

              <div className='absolute bottom-[5px] left-[35px] h-[109.4px] w-[141px] -rotate-12'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[3]?.relPath} />
              </div>

              <div className='absolute right-[28px] top-[10px] h-[109.4px] w-[141px] rotate-6'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='mb-20 mt-4 h-[38.4px] w-[272.5px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[24]?.relPath} />
            </div>
          </div>

          <div className='h-full grow'>
            <div className='relative flex h-full w-full flex-col items-center overflow-hidden rounded-[40px] bg-custom-style-6-1'>
              <div className='mb-4 mt-2 h-[69.6px] w-[69.6px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[34]?.relPath} />
              </div>

              <div className='relative h-[853.3333px] w-[1280px] bg-custom-style-3-2'>
                <img ref={imgRef} src='' alt='' className='h-full w-full' />

                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                  <div className='h-[539.4px] w-[686px]'>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[35]?.relPath} />
                  </div>
                </div>
              </div>

              <div className='w-[570px]] absolute bottom-[20px] left-[28px] h-[90px] font-rokkitt text-[30px] text-custom-style-3-1'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[36]?.relPath} />
                </div>

                <div className='absolute left-[90px] top-[23px]'>
                  <span>Tip:</span>
                </div>
              </div>

              <div className='absolute bottom-[20px] right-[180px] h-[90px]'>
                <Countdown
                  url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
                  time={90}
                  routeGoToBack='/enter-code'
                />
              </div>
            </div>
          </div>

          <div className='flex h-full w-[300px] flex-col items-center justify-center'>
            <div className='relative h-[150px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[31]?.relPath} />
              </div>

              <div className='absolute left-[109px] top-[20px] text-[36px] text-custom-style-1'>
                <span className='text-custom-style-2-1'>1</span>
                <span>/</span>
                <span>6</span>
              </div>
            </div>

            <div className='w-[141px]] h-[109.4px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[4]?.relPath} />
            </div>

            <div className='w-[276.8px]] h-[286.5px] -translate-y-5'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[32]?.relPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
