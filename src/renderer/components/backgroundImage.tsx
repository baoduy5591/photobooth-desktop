import React from 'react';

interface BackgroundImageProps {
  children: React.ReactNode;
  backgroundPrimary: string;
  backgroundSecondary?: string;
  addClassContainer?: string;
  addClassBackgroundPrimary?: string;
  addClassBackgroundSecondary?: string;
  addClassChildren?: string;
}

export const BackgroundImage = React.memo(function BackgroundImage({
  children,
  backgroundPrimary,
  backgroundSecondary,
  addClassContainer = '',
  addClassBackgroundPrimary = '',
  addClassBackgroundSecondary = '',
  addClassChildren = '',
}: BackgroundImageProps) {
  return (
    <div className={`relative h-full w-full ${addClassContainer}`}>
      <div className={`absolute inset-0 ${addClassBackgroundPrimary}`}>
        <img src={backgroundPrimary} alt='' />
      </div>

      <div className={`absolute inset-0 ${addClassBackgroundSecondary}`}>
        <img src={backgroundSecondary} alt='' />
      </div>

      <div className={`absolute inset-0 ${addClassChildren}`}>{children}</div>
    </div>
  );
});
