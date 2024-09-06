import React from 'react';

interface BackgroundImageProps {
  url: string;
  customClassName?: string;
}

export const BackgroundImage = React.memo(
  function BackgroundImage({ url, customClassName = '' }: BackgroundImageProps) {
    return (
      <div className={`absolute inset-0 ${customClassName}`}>
        <img src={url} alt='' className='h-full w-full' />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.url === nextProps.url;
  },
);
