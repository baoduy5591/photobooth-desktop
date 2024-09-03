import React from 'react';

interface BackgroundImageProps {
  children: React.ReactNode;
  url: string;
  addClassName?: string;
}

export const BackgroundImage = React.memo(function BackgroundImage({
  children,
  url,
  addClassName = '',
}: BackgroundImageProps) {
  return (
    <div
      className={`h-full w-full ${addClassName}`}
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
