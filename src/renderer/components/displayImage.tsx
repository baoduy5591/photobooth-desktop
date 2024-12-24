import React, { useEffect, useState } from 'react';
import { loadImage } from '../libs/common';

interface DisplayImageProps {
  src: string;
}

export const DisplayImage = React.memo(
  function DisplayImage({ src }: DisplayImageProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      loadImage(src).then((image) => setIsLoading(false));
    }, []);

    return (
      <div className='relative h-full w-full'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-custom-style-1'>
            <div
              className='animate-spin'
              style={{
                width: '12px',
                height: '12px',
                border: '4px solid #ff909d',
                borderRadius: '100%',
                borderTop: '4px solid #ffc5c9',
              }}
            ></div>
          </div>
        )}

        <img src={src} alt='image' className='h-full w-full' />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.src === nextProps.src;
  },
);
