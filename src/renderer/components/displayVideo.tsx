import React from 'react';

interface DisplayVideo {
  src: string;
}

export const DisplayVideo = React.memo(
  function DisplayVideo({ src }: DisplayVideo) {
    return (
      <div className='h-full w-full'>
        <video src={src} autoPlay loop className='h-full w-full'></video>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.src === nextProps.src;
  },
);
