import { CONST_POSITION_FRAMES } from './constants';

export const changeFontByName = (fontName: string) => {
  document.body.style.fontFamily = fontName;
};

export const checkIsTouch = (
  event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  isTouch: React.MutableRefObject<boolean>,
) => {
  if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
    isTouch.current = true;
  } else {
    if (isTouch.current) {
      isTouch.current = false;
      return false;
    }
  }

  return true;
};

export const chunkItems = (items: string[], size: number) => {
  const chunkList = [];
  const _length = items.length;
  for (let i = 0; i < _length; i += size) {
    chunkList.push(items.slice(i, i + size));
  }

  return chunkList;
};

export const loadImage = (pathImage: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = pathImage;
    image.onload = () => {
      resolve(image);
    };
  });
};

export const getRatioByFrameModeAndFrameType = (frameMode: string, frameType: string) => {
  const _frameMode = CONST_POSITION_FRAMES[frameMode as keyof typeof CONST_POSITION_FRAMES];
  const _frameType = _frameMode[frameType as keyof typeof _frameMode];
  const { w, h } = _frameType[0][0];
  return Math.round((w / h) * 10) / 10;
};
