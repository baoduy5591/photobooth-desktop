import { BackgroundImage } from '../components/backgroundImage';
import { Countdown, CountdownForShooting } from '../components/countdown';
import { DisplayImage } from '../components/displayImage';
import { useStore } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  CONST_COMPLIMENT_MESSAGE,
  CONST_COUNTDOWN_METHOD,
  CONST_MODE_WIDE,
  CONST_REMOTE_METHOD,
} from '../libs/constants';
import { useTranslation } from 'react-i18next';

export default function Shooting() {
  const { store } = useStore();
  const [isStartLiveView, setIsStartLiveView] = useState<boolean>(false);
  const [isStartRecord, setIsStartRecord] = useState<boolean>(false);
  const [shootingPhotos, setShootingPhotos] = useState<string[]>([]);
  const [isShootingCountdown, setIsShootingCountdown] = useState<boolean>(false);
  const [isShootingTriggered, setIsShootingTriggered] = useState<boolean>(false);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [isDoneShooting, setIsDoneShooting] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);

  const { t: translate } = useTranslation();

  const navigate = useNavigate();

  const randomCompliment = CONST_COMPLIMENT_MESSAGE[Math.floor(Math.random() * CONST_COMPLIMENT_MESSAGE.length)] as
    | 'nice'
    | 'perfect'
    | 'good'
    | 'great';

  const imgRef = useRef<HTMLImageElement>(null);
  const wsVideo = useRef<WebSocket | null>(null);
  const wsCamera = useRef<WebSocket | null>(null);
  const isDoneRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isStartLiveView || !isStartRecord) return;

    wsVideo.current = new WebSocket('ws://127.0.0.1:8080/video');
    wsVideo.current.binaryType = 'blob';
    wsVideo.current.onmessage = (event) => {
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
      wsVideo.current.close();
    };
  }, [isStartLiveView, isStartRecord]);

  useEffect(() => {
    wsCamera.current = new WebSocket('ws://127.0.0.1:8080/camera');
    wsCamera.current.onopen = () => {
      wsCamera.current.send(`setphoto-img:r=2;w=${store.orderInfo.ratio}`);
      wsCamera.current.send('startlv');
      setTimeout(() => {
        wsCamera.current.send('record');
      }, 500);
    };

    wsCamera.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'startlv' && data.result === 'OK') {
        setIsStartLiveView(true);
      }

      if (data.action === 'record') {
        if (data.result === 'OK') {
          if (!isDoneRef.current) {
            wsCamera.current.send('unlock');
            setIsStartRecord(true);
          }
        } else {
          wsCamera.current.send('record');
        }
      }

      if (data.action === 'shooting-triggered') {
        if (data.result === 'OK') {
          setIsShootingTriggered(true);
          setIsShootingCountdown(false);
          setIsShooting(true);
        }
      }

      if (data.action === 'takephoto') {
        if (data.result === 'OK') {
          setIsStart(true);
          setIsShootingCountdown(false);
          setIsShootingTriggered(false);
          setIsShooting(false);
          setShootingPhotos((prevShootingPhoto) => {
            const newListShootingPhoto = [...prevShootingPhoto, data.message];
            if (newListShootingPhoto.length >= store.orderInfo.quantityShootingPhotos) {
              wsCamera.current.send('stoprecord');
              wsCamera.current.send('stoplv');
              wsCamera.current.send('lock');
              isDoneRef.current = true;
              setIsDoneShooting(true);
              setTimeout(() => {
                navigate('/select-photos');
              }, 3000);
              return newListShootingPhoto;
            }

            return newListShootingPhoto;
          });

          wsCamera.current.send('record');
        }
      }
    };

    return () => {
      wsCamera.current.close();
    };
  }, []);

  const handleActionShootingByMethod = () => {
    setIsShootingCountdown(true);
    setIsShootingTriggered(false);
    setIsShooting(true);
  };

  useEffect(() => {
    if (isShootingCountdown) {
      if (wsCamera.current && wsCamera.current.readyState === WebSocket.OPEN) {
        wsCamera.current.send('takephoto');
      }
    }
  }, [isShootingCountdown]);

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      {isDoneShooting && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/70 font-rokkitt text-4xl tracking-wider text-custom-style-3-1'>
          <span>{translate('translation:loading')}</span>
        </div>
      )}

      <BackgroundImage url={store.assetsFolderPath + store.clientSetting.backgroundImageSecondary} />

      <div className='absolute inset-0'>
        {(isShootingCountdown || isShootingTriggered) && (
          <div className='absolute inset-0 z-50 flex flex-col items-center justify-center gap-y-2 bg-custom-style-1 font-rokkitt text-5xl font-semibold tracking-wider text-custom-style-3-1 opacity-80'>
            <span>{translate('translation:shooting.saving')}</span>
            <span>{translate('translation:shooting.warningMessageMove')}</span>
          </div>
        )}

        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[325px] flex-col items-center justify-end'>
            <div className='relative h-[251px] w-[271px]'>
              <div className='h-full w-full scale-x-[-1]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[25]?.relPath} />
              </div>

              <div className='absolute left-1/2 top-[80px] -translate-x-1/2 text-[36px] text-custom-style-2-1'>
                {!isStart ? (
                  <div className='min-w-max'>
                    <span>{translate('translation:shooting.start')}</span>
                  </div>
                ) : (
                  !isShooting && (
                    <div className='min-w-max'>
                      <span>{translate(`translation:shooting.${randomCompliment}`)}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className='relative h-[200px] w-full'>
              <div className='absolute -top-[35px] left-[55px] h-[98.4px] w-[98.4px]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[30]?.relPath} />
              </div>

              <div className='absolute bottom-[5px] left-[35px] h-[109.4px] w-[141px] -rotate-12'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[3]?.relPath} />
              </div>

              <div className='absolute right-[10px] top-[10px] h-[109.4px] w-[141px] rotate-6'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[2]?.relPath} />
              </div>
            </div>

            <div className='mb-20 mt-4 h-[38.4px] w-[272.5px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[24]?.relPath} />
            </div>
          </div>

          <div className='h-full grow'>
            <div className='relative flex h-full w-full flex-col items-center overflow-hidden rounded-[40px] bg-custom-style-6-1'>
              <div className='mb-6 mt-4 h-[70px] w-[70px]'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[34]?.relPath} />
              </div>

              <div className='relative h-[828px] w-[1242px] bg-custom-style-3-2'>
                <img ref={imgRef} className='h-full w-full' />

                {store.orderInfo.frameMode !== CONST_MODE_WIDE && (
                  <div className='absolute inset-0 flex justify-between'>
                    <div
                      className='h-full bg-custom-style-3-1'
                      style={{ width: `${(1242 - 828 * store.orderInfo.ratio) / 2}px` }}
                    ></div>

                    <div
                      className='h-full bg-custom-style-3-1'
                      style={{ width: `${(1242 - 828 * store.orderInfo.ratio) / 2}px` }}
                    ></div>
                  </div>
                )}

                {store.orderInfo.frameMode === CONST_MODE_WIDE && store.orderInfo.frameType === 'typeA' && (
                  <div className='absolute inset-0 flex flex-col justify-between'>
                    <div
                      className='h-full bg-custom-style-3-1'
                      style={{ height: `${(828 - 1242 / 2.82) / 2}px` }}
                    ></div>

                    <div
                      className='h-full bg-custom-style-3-1'
                      style={{ height: `${(828 - 1242 / 2.82) / 2}px` }}
                    ></div>

                    <div className='absolute left-1/2 h-full w-[27px] -translate-x-1/2 bg-custom-style-3-1'></div>
                  </div>
                )}

                {store.orderInfo.frameMode === CONST_MODE_WIDE && store.orderInfo.frameType === 'typeB' && (
                  <div className='absolute inset-0 flex flex-col justify-between'>
                    <div
                      className='h-full bg-custom-style-3-1'
                      style={{ height: `${(828 - 1242 / 2.05) / 2}px` }}
                    ></div>

                    <div
                      className='h-full bg-custom-style-3-1'
                      style={{ height: `${(828 - 1242 / 2.05) / 2}px` }}
                    ></div>

                    <div className='absolute left-1/2 h-full w-[27px] -translate-x-1/2 bg-custom-style-3-1'></div>
                  </div>
                )}
              </div>

              <div className='w-[570px]] absolute bottom-[23px] left-[28px] h-[90px] font-rokkitt text-[30px] text-custom-style-3-1'>
                <div className='h-full w-full'>
                  <DisplayImage src={store.assetsFolderPath + store.resources.icons[36]?.relPath} />
                </div>

                <div className='absolute left-[90px] top-[20px]'>
                  <span>Tip:</span>
                </div>
              </div>

              {isStartLiveView &&
                isStartRecord &&
                !isDoneShooting &&
                !isShooting &&
                !isShootingCountdown &&
                !isShootingTriggered && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <CountdownForShooting
                      time={store.orderInfo.shootingTime}
                      handleActionShootingByMethod={handleActionShootingByMethod}
                    />
                  </div>
                )}
            </div>
          </div>

          <div className='flex h-full w-[325px] flex-col items-center justify-center'>
            <div className='relative h-[150px] w-[276.8px]'>
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[31]?.relPath} />
              </div>

              <div className='absolute left-[109px] top-[20px] text-[36px] text-custom-style-1'>
                <span className='text-custom-style-2-1'>{shootingPhotos.length}</span>
                <span>/</span>
                <span>{store.orderInfo.quantityShootingPhotos}</span>
              </div>
            </div>

            <div className='w-[141px]] h-[109.4px]'>
              <DisplayImage src={store.assetsFolderPath + store.resources.icons[4]?.relPath} />
            </div>

            <div className='h-[320px] w-[320px] -translate-y-5'>
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + store.resources.icons[32]?.relPath} />
              </div>

              <div className='absolute inset-0 flex justify-center p-3'>
                <div className='relative h-[200px] w-[300px] overflow-hidden rounded-2xl border border-custom-style-6-1'>
                  {shootingPhotos.length > 0 && (
                    <DisplayImage src={store.userPhotosFolderPath + shootingPhotos.slice(-1)[0]} />
                  )}

                  {store.orderInfo.frameMode !== CONST_MODE_WIDE && (
                    <div className='absolute inset-0 flex justify-between'>
                      <div
                        className='h-full bg-custom-style-1'
                        style={{ width: `${(300 - 200 * store.orderInfo.ratio) / 2}px` }}
                      ></div>

                      <div
                        className='h-full bg-custom-style-1'
                        style={{ width: `${(300 - 200 * store.orderInfo.ratio) / 2}px` }}
                      ></div>
                    </div>
                  )}

                  {store.orderInfo.frameMode === CONST_MODE_WIDE && store.orderInfo.frameType === 'typeA' && (
                    <div className='absolute inset-0 flex flex-col justify-between'>
                      <div
                        className='h-full bg-custom-style-3-1'
                        style={{ height: `${(200 - 300 / 2.82) / 2}px` }}
                      ></div>

                      <div
                        className='h-full bg-custom-style-3-1'
                        style={{ height: `${(200 - 300 / 2.82) / 2}px` }}
                      ></div>
                    </div>
                  )}

                  {store.orderInfo.frameMode === CONST_MODE_WIDE && store.orderInfo.frameType === 'typeB' && (
                    <div className='absolute inset-0 flex flex-col justify-between'>
                      <div
                        className='h-full bg-custom-style-3-1'
                        style={{ height: `${(200 - 300 / 2.05) / 2}px` }}
                      ></div>

                      <div
                        className='h-full bg-custom-style-3-1'
                        style={{ height: `${(200 - 300 / 2.05) / 2}px` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
