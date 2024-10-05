import React, { useRef, useState } from 'react';
import { DisplayImage } from './displayImage';
import { checkIsTouch } from '../libs/common';
import { useSound } from '../context/sound';

interface KeyboardNumberProps {
  handleOnTouchGetValue: (value: string) => void;
  iconTrash: string;
  iconBack: string;
  iconBling: string;
}

export const KeyboardNumber = React.memo(
  function KeyboardNumber({ handleOnTouchGetValue, iconTrash, iconBack, iconBling }: KeyboardNumberProps) {
    const [value, setValue] = useState<string>('');

    const isTouchGetValue = useRef<boolean>(false);
    const isTouchEnd = useRef<boolean>(false);

    const { playSoundTouch } = useSound();

    const _handleOnTouchGetValue = (event: React.TouchEvent<HTMLDivElement>, value: string) => {
      if (!checkIsTouch(event, isTouchGetValue)) return;

      playSoundTouch(false);
      setValue(value);
      handleOnTouchGetValue(value);
    };

    const handleOnTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
      if (!checkIsTouch(event, isTouchEnd)) return;

      setValue('');
    };

    return (
      <div className='gird grid h-full w-full grid-cols-3 place-items-center font-baloo text-7xl font-light text-custom-style-1'>
        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '1')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '1')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '1' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-2-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-2-2'>
              <span className={`${value === '1' ? 'scale-75' : ''}`}>1</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '2')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '2')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '2' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-4-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-4-2'>
              <span className={`${value === '2' ? 'scale-75' : ''}`}>2</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '3')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '3')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '3' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-5-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-5-2'>
              <span className={`${value === '3' ? 'scale-75' : ''}`}>3</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '4')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '4')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '4' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-2-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-2-2'>
              <span className={`${value === '4' ? 'scale-75' : ''}`}>4</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '5')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '5')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '5' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-4-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-4-2'>
              <span className={`${value === '5' ? 'scale-75' : ''}`}>5</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '6')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '6')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '6' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-5-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-5-2'>
              <span className={`${value === '6' ? 'scale-75' : ''}`}>6</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '7')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '7')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '7' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-2-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-2-2'>
              <span className={`${value === '7' ? 'scale-75' : ''}`}>7</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '8')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '8')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '8' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-4-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-4-2'>
              <span className={`${value === '8' ? 'scale-75' : ''}`}>8</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '9')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '9')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '9' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-5-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-5-2'>
              <span className={`${value === '9' ? 'scale-75' : ''}`}>9</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, 'trash')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, 'trash')}
          className='relative h-[80px] w-[80px]'
        >
          {value === 'trash' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-5-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-5-2'>
              <div className={`w-35px h-[35px] ${value === 'trash' ? 'scale-75' : ''}`}>
                <DisplayImage src={iconTrash} />
              </div>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, '0')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, '0')}
          className='relative h-[110px] w-[110px]'
        >
          {value === '0' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-4-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-4-2'>
              <span className={`${value === '0' ? 'scale-75' : ''}`}>0</span>
            </div>
          </div>
        </div>

        <div
          // onMouseUp={(event) => handleOnTouchEnd(event)}
          // onMouseDown={(event) => _handleOnTouchGetValue(event, 'back')}
          onTouchEnd={(event) => handleOnTouchEnd(event)}
          onTouchStart={(event) => _handleOnTouchGetValue(event, 'back')}
          className='relative h-[80px] w-[80px]'
        >
          {value === 'back' && (
            <div className='absolute -left-10 -top-5 h-[47.5px] w-[57px] -rotate-90'>
              <DisplayImage src={iconBling} />
            </div>
          )}

          <div className='absolute left-1.5 top-[2px] h-full w-full rounded-full bg-custom-style-3-1 opacity-15'></div>

          <div className='absolute inset-0 rounded-full bg-custom-style-2-1 p-1.5'>
            <div className='flex h-full w-full select-none items-center justify-center rounded-full border-4 border-dashed border-custom-style-2-2'>
              <div className={`w-35px h-[35px] ${value === 'back' ? 'scale-75' : ''}`}>
                <DisplayImage src={iconBack} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.iconBack === nextProps.iconBack &&
      prevProps.iconTrash === nextProps.iconTrash &&
      prevProps.handleOnTouchGetValue === nextProps.handleOnTouchGetValue
    );
  },
);
