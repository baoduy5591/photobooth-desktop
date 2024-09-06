import React from 'react';

interface DisplayImageProps {
  src: string;
}

export const DisplayImage = React.memo(
  function DisplayImage({ src }: DisplayImageProps) {
    return <img src={src} alt='image' className='h-full w-full' />;
  },
  (prevProps, nextProps) => {
    return prevProps.src === nextProps.src;
  },
);
