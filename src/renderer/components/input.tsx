import React, { useRef, useState } from 'react';
import { DisplayImage } from './displayImage';
import { checkIsTouch } from '../libs/common';
import { CONST_ERROR, CONST_PICTURE_TIME } from '../libs/constants';

interface InputStyle1Props {
  handleOnTouchStartSubmit: (value: string) => void;
  value: string;
  iconCamera: string;
  iconBling: string;
  iconFail: string;
}

export const InputStyle1 = React.memo(
  function InputStyle1({ value, iconCamera, iconBling, iconFail, handleOnTouchStartSubmit }: InputStyle1Props) {
    const [isPressed, setIsPressed] = useState<boolean>(false);

    const isTouchSubmit = useRef<boolean>(false);
    const isTouchEnd = useRef<boolean>(false);

    const _handleOnTouchStartSubmit = (event: TouchEventAndMouseEventType) => {
      if (!checkIsTouch(event, isTouchSubmit)) return;

      if (value.length < 3 || value === CONST_PICTURE_TIME || value === CONST_ERROR) return;

      setIsPressed(true);
      handleOnTouchStartSubmit(value);
    };

    const handleOnTouchEnd = (event: TouchEventAndMouseEventType) => {
      if (!checkIsTouch(event, isTouchEnd)) return;

      setIsPressed(false);
    };

    return (
      <div className='relative m-0 h-full w-full'>
        <div className='absolute -right-8 -top-6 h-[47.5px] w-[57px] rotate-[15deg]'>
          <DisplayImage src={iconBling} />
        </div>

        <div className='bg-custom-style-3-1 absolute mt-4 h-full w-full rounded-full opacity-15'></div>

        <div className='absolute inset-0 flex items-center justify-center'>
          <input
            type='text'
            value={value}
            readOnly
            className={`border-custom-style-2-1 pointer-events-none h-full w-full select-none rounded-s-full border-4 border-r-0 px-6 text-end font-moreSugar text-6xl tracking-wide outline-none ${value === CONST_PICTURE_TIME ? 'text-custom-style-5-3' : 'text-custom-style-2-1'}`}
          />
          <div
            onTouchStart={(event) => _handleOnTouchStartSubmit(event)}
            onTouchEnd={(event) => handleOnTouchEnd(event)}
            onMouseDown={(event) => _handleOnTouchStartSubmit(event)}
            onMouseUp={(event) => handleOnTouchEnd(event)}
            className='border-custom-style-2-1 bg-custom-style-2-1 flex h-full w-40 items-center justify-center rounded-r-full border-4'
          >
            <div className={`h-[61px] w-[73px] ${isPressed ? 'scale-75' : ''}`}>
              {value === CONST_ERROR ? <DisplayImage src={iconFail} /> : <DisplayImage src={iconCamera} />}
            </div>
          </div>

          <div className='bg-custom-style-2-2 absolute bottom-5 right-[155px] h-1.5 w-[75px]'></div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.iconCamera === nextProps.iconCamera &&
      prevProps.iconBling === nextProps.iconBling
    );
  },
);