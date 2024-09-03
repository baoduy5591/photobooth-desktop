import React from 'react';

interface BackgroundImageProps {
  children: React.ReactNode;
  url: string;
  width: number;
  height: number;
}

export const BackgroundImage = React.memo(function BackgroundImage({
  children,
  url,
  width,
  height,
}: BackgroundImageProps) {
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
});
