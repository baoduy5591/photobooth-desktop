import React from 'react';

interface BackgroundImageProps {
  children: React.ReactNode;
  url: string;
}

export const BackgroundImage = React.memo(function BackgroundImage({ children, url }: BackgroundImageProps) {
  return (
    <div
      className='h-screen w-screen'
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </div>
  );
});
