import React from 'react';

interface VideoModalProps {
  videoUrl: string;
}

export const VideoModal = React.memo(
  function VideoModal({ videoUrl }: VideoModalProps) {
    return (
      <div className='h-full w-full'>
        <video src={videoUrl} autoPlay loop className='h-full w-full'></video>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.videoUrl === nextProps.videoUrl;
  },
);
