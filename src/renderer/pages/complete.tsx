import { useTranslation } from 'react-i18next';
import { BackgroundImage } from '../components/backgroundImage';
import { useStore } from '../context/store';
import { DisplayImage } from '../components/displayImage';
import { InputStyle1 } from '../components/input';
import { useState } from 'react';
import { KeyboardNumber } from '../components/keyboardNumber';
import { useNavigate } from 'react-router-dom';
import { CONST_ERROR, CONST_PICTURE_TIME } from '../libs/constants';
import { Countdown } from '../components/countdown';

export default function Complete() {
  const { store, setStore } = useStore();
  const { t: translate } = useTranslation();

  const navigate = useNavigate();

  const [values, setValues] = useState<string>('');

  const handleOnTouchGetValue = (value: string) => {
    if (values === CONST_PICTURE_TIME) return;

    let newValues = values;
    if (values === CONST_ERROR) {
      newValues = '';
    }

    if (value === 'trash') {
      newValues = '';
    } else if (value === 'back') {
      newValues = newValues.slice(0, newValues.length - 1);
    } else {
      newValues += value;
    }

    setValues(newValues);
  };

  const handleOnTouchStart = () => {
    navigate('/home');
  };

  const handleOnTouchStartSubmit = async (value: string) => {
    const data = await window.api.getOrderInfoById(value);
    if (value === '2222') {
      setStore((store) => ({ ...store, orderInfo: { ...store.orderInfo, ...data } }));
      setValues(CONST_PICTURE_TIME);
      setTimeout(() => {
        navigate('/confirm-frame');
      }, 1000);
    } else {
      setValues(CONST_ERROR);
    }
  };

  return (
    <div className='relative h-screen w-screen'>
      <BackgroundImage url={store.pathFolderAssets + store.resources.backgroundImages[1]?.relPath} />

      <div className='absolute bottom-[25px] right-[10px] h-[164px] w-[438px]'>
        <DisplayImage src={store.pathFolderAssets + store.resources.icons[53]?.relPath} />
      </div>

      <div className='absolute inset-0 flex flex-col items-center'>
        <div className='absolute right-24 top-28 flex items-center justify-center gap-x-4'>
          <div onTouchStart={handleOnTouchStart} onMouseDown={handleOnTouchStart} className='mt-3 h-[85px] w-[85px]'>
            <DisplayImage src={store.pathFolderAssets + store.resources.icons[11]?.relPath} />
          </div>

          <Countdown
            url={store.pathFolderAssets + store.resources.icons[10]?.relPath}
            time={90}
            routeGoToBack='/home'
          />
        </div>

        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-full w-[700px] flex-col items-center justify-between'>
            <div className='h-[114px] w-[316px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[45]?.relPath} />
            </div>

            <div className='h-[617px] w-[492px]'>
              <DisplayImage src={store.pathFolderAssets + store.resources.icons[46]?.relPath} />
            </div>

            <div className='flex w-full -translate-y-20 items-center justify-start gap-x-4'>
              <div className='h-[118px] w-[186px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[51]?.relPath} />
              </div>

              <div className='h-[84px] w-[84px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[50]?.relPath} />
              </div>

              <div className='h-[102px] w-[186px]'>
                <DisplayImage src={store.pathFolderAssets + store.resources.icons[52]?.relPath} />
              </div>
            </div>
          </div>

          <div className='flex h-full grow items-start justify-start py-44'>
            <div className='flex flex-col items-center justify-start gap-y-20 px-10'>
              <div className='flex w-full items-center justify-center'>
                <div className='relative flex h-[136px] w-[547px]'>
                  <DisplayImage src={store.pathFolderAssets + store.resources.icons[0]?.relPath} />

                  <div className='absolute left-[136px] top-[42px] text-[40px] tracking-wider text-custom-style-1'>
                    <span>THANK YOU</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-center justify-center gap-y-20 font-rokkitt text-[30px]'>
                <div className='relative h-[105px] w-[911px]'>
                  <div className='absolute left-4 top-4 h-full w-full rounded-l-full rounded-r-full bg-custom-style-3-1 opacity-20'></div>

                  <div className='bg-custom-style-7-1 absolute left-0 top-0 flex h-full w-full items-center justify-start rounded-l-full rounded-r-full'>
                    <div className='absolute -left-5 top-0 h-[100px] w-[100px]'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[47]?.relPath} />
                    </div>

                    <div className='ml-24'>
                      <span>Receive your photos at the counter</span>
                    </div>
                  </div>
                </div>

                <div className='relative h-[105px] w-[911px]'>
                  <div className='absolute left-4 top-4 h-full w-full rounded-l-full rounded-r-full bg-custom-style-3-1 opacity-20'></div>

                  <div className='bg-custom-style-8-1 absolute left-0 top-0 flex h-full w-full items-center justify-start rounded-l-full rounded-r-full'>
                    <div className='absolute -left-5 top-0 h-[103px] w-[103px]'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[48]?.relPath} />
                    </div>

                    <div className='ml-24'>
                      <span>Sologan/ Câu quảng cáo theo dịp</span>
                    </div>
                  </div>
                </div>

                <div className='relative h-[105px] w-[911px]'>
                  <div className='absolute left-4 top-4 h-full w-full rounded-l-full rounded-r-full bg-custom-style-3-1 opacity-20'></div>

                  <div className='bg-custom-style-9-1 absolute left-0 top-0 flex h-full w-full items-center justify-start rounded-l-full rounded-r-full'>
                    <div className='absolute -left-5 top-0 h-[100px] w-[100px]'>
                      <DisplayImage src={store.pathFolderAssets + store.resources.icons[49]?.relPath} />
                    </div>

                    <div className='ml-24'>
                      <span>Hotline: 0xx xxxx xxx</span>
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