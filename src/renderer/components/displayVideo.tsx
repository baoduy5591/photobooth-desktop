import React, { useRef, useState } from 'react';

interface DisplayVideo {
  src: string;
}

export const DisplayVideo = React.memo(
  function DisplayVideo({ src }: DisplayVideo) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const videoRef = useRef<HTMLVideoElement>(null);

    const handleOnLoadVideo = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return false;

      if (videoElement.readyState === 4) {
        setIsLoading(false);
      }
    };

    return (
      <div className='relative h-full w-full'>
        <video ref={videoRef} src={src} autoPlay loop onCanPlay={handleOnLoadVideo} className='h-full w-full'></video>

        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white font-rokkitt text-2xl text-custom-style-3-1'>
            <span>Loading . . .</span>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.src === nextProps.src;
  },
);
