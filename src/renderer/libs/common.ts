import { CONST_FRAME_POSITIONS } from './constants';

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
  const _frameMode = CONST_FRAME_POSITIONS[frameMode as keyof typeof CONST_FRAME_POSITIONS];
  const _frameType = _frameMode[frameType as keyof typeof _frameMode];
  const { w, h } = _frameType[0][0];
  return Math.round((w / h) * 10) / 10;
};

export const allowWithQuantityTouches = (touches: React.Touch[], quantityTouches: number) => {
  if (touches.length > quantityTouches) return false;

  return true;
};

export const getPhotoOnCanvas = (frameMode: string, frameType: string, _x: number, _y: number) => {
  const _frameMode = CONST_FRAME_POSITIONS[frameMode as keyof typeof CONST_FRAME_POSITIONS];
  const _frameType = _frameMode[frameType as keyof typeof _frameMode];
  for (let index = 0; index < _frameType.length; index++) {
    for (let _index = 0; _index < _frameType[index].length; _index++) {
      const { x, y, w, h } = _frameType[index][_index];
      const minX = x;
      const maxX = x + w;
      const minY = y;
      const maxY = y + h;
      if (_x >= minX && _x <= maxX && _y >= minY && _y <= maxY) {
        return index;
      }
    }
  }
  return null;
};

export const randomRangeValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getPositionByFrameModeAndFrameType = (
  framePositions: FramePositionType,
  frameMode: string,
  frameType: string,
) => {
  const object = framePositions[frameMode as keyof typeof framePositions];
  const position = object[frameType as keyof typeof object];
  return position;
};

export const getPositionByAngle = (x0: number, y0: number, x1: number, y1: number) => {
  const distance = 400;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const angle = Math.atan2(dy, dx);
  const angleInDegrees = angle * (180 / Math.PI);
  const angleInRadian = (360 - angleInDegrees) * (Math.PI / 180);
  const x2 = x1 + distance * Math.cos(angleInRadian);
  const y2 = y1 + distance * Math.sin(angleInRadian);

  return { x: x2, y: y2, angle: angleInDegrees };
};

export const getRectForQrCodeByFrameModeAndFrameType = (frameMode: string, frameType: string) => {};
