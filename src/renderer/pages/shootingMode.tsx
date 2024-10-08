import { BackgroundImage } from '../components/backgroundImage';
import { Countdown } from '../components/countdown';
import { useStore } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../context/sound';
import { CONST_SHOOTING_MODE } from '../libs/constants';
import { useState } from 'react';
import { DisplayImage } from '../components/displayImage';

export default function SelectShootingMode() {
  const { store, setStore } = useStore();
  const [time, setTime] = useState<number>(3);

  const navigate = useNavigate();

  const { playSoundTouch } = useSound();

  const handleChooseShootingMode = (shootingModeName: string) => {
    playSoundTouch(false);
    let shootingTime = 3;
    if (shootingModeName === CONST_SHOOTING_MODE[0]) {
      shootingTime = 10;
    } else if (shootingModeName === CONST_SHOOTING_MODE[1]) {
      shootingTime = 1;
    }

    if (time > 3) {
      setStore((prevStore) => ({ ...prevStore, shootingMode: shootingModeName, shootingTime: time }));
    } else {
      setStore((prevStore) => ({ ...prevStore, shootingMode: shootingModeName, shootingTime: shootingTime }));
    }
  };

  const handleChoosePrevTime = () => {
    setTime((prevTime) => (prevTime - 1 < 3 ? 3 : prevTime - 1));
  };

  const handleChooseNextTime = () => {
    setTime((prevTime) => (prevTime + 1 > 30 ? 30 : prevTime + 1));
  };

  const handleOnTouchStartNextPage = () => {
    setTimeout(() => {
      navigate('/shooting');
    }, 300);
  };

  return (
    <div className='relative h-screen w-screen overflow-hidden text-2xl'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[0]?.relPath} />

      <div className='absolute inset-0 px-40 py-16'>
        <div className='absolute right-52 top-28'>
          <Countdown
            url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
            time={900}
            routeGoToBack='/home'
          />
        </div>

        <div className='flex h-full items-center justify-center gap-x-10 text-center font-rokkitt'>
          <div
            className='relative h-72 w-96 rounded-2xl bg-custom-style-2-1 p-3'
            onTouchStart={() => handleChooseShootingMode(CONST_SHOOTING_MODE[0])}
          >
            <div className='flex h-full items-center justify-center rounded-xl bg-custom-style-1 p-2'>
              <div className='flex h-full flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-dashed border-custom-style-2-1 p-1'>
                <span className='text-3xl font-bold'>Default</span>
                <span>Automatic shooting at intervals of 10 seconds</span>
              </div>
            </div>

            {store.shootingMode === CONST_SHOOTING_MODE[0] && (
              <div className='absolute -top-10 left-1/2 h-10 w-10 -translate-x-1/2'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[1].relPath} />
              </div>
            )}
          </div>

          <div
            className='relative h-72 w-96 rounded-2xl bg-custom-style-2-1 p-3'
            onTouchStart={() => handleChooseShootingMode(CONST_SHOOTING_MODE[1])}
          >
            <div className='flex h-full items-center justify-center rounded-xl bg-custom-style-1 p-2'>
              <div className='flex h-full flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-dashed border-custom-style-2-1 p-1'>
                <span className='text-3xl font-bold'>Burst</span>
                <span>Continuous shooting every 1 second after a 15-second preparation period</span>
              </div>
            </div>

            {store.shootingMode === CONST_SHOOTING_MODE[1] && (
              <div className='absolute -top-10 left-1/2 h-10 w-10 -translate-x-1/2'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[1].relPath} />
              </div>
            )}
          </div>

          <div
            className='relative h-72 w-96 rounded-2xl bg-custom-style-2-1 p-3'
            onTouchStart={() => handleChooseShootingMode(CONST_SHOOTING_MODE[2])}
          >
            <div className='flex h-full items-center justify-center rounded-xl bg-custom-style-1 p-2'>
              <div className='flex h-full flex-col items-center justify-center gap-y-2 rounded-xl border-2 border-dashed border-custom-style-2-1 p-1'>
                <span className='text-3xl font-bold'>Custom</span>
                <span>Option to set the time interval between each shot</span>

                <div className='flex w-full items-center justify-between px-8'>
                  <div className='h-14 w-14 rotate-90 p-1' onTouchEnd={handleChoosePrevTime}>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[1].relPath} />
                  </div>

                  <span className='text-2xl font-bold'>{time}</span>

                  <div className='h-14 w-14 -rotate-90 p-1' onTouchEnd={handleChooseNextTime}>
                    <DisplayImage src={store.pathFolderAssets + store.resources.icons[1].relPath} />
                  </div>
                </div>
              </div>
            </div>

            {store.shootingMode === CONST_SHOOTING_MODE[2] && (
              <div className='absolute -top-10 left-1/2 h-10 w-10 -translate-x-1/2'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[1].relPath} />
              </div>
            )}
          </div>
        </div>

        <div
          className='absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-center'
          onTouchStart={handleOnTouchStartNextPage}
        >
          <div className='h-[79.8px] w-[79.8px]'>
            <DisplayImage src={store.pathFolderAssets + store.resources.icons[38]?.relPath} />
          </div>
        </div>
      </div>
    </div>
  );
}
