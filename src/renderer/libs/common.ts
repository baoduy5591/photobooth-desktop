import { CONST_FRAME_POSITIONS, CONST_MODE_CUTTING, CONST_MODE_REGULAR, CONST_MODE_WIDE } from './constants';

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

export const getCurrentDateToString = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let date = `${currentDate.getDate()}`;
  let month = `${currentDate.getMonth() + 1}`;
  if (date.length < 2) {
    date = `0${date}`;
  }

  if (month.length < 2) {
    month = `0${month}`;
  }

  return `${date}-${month}-${year}`;
};

export const getDetailForQrCodeByFrameModeAndFrameType = (frameMode: string, frameType: string) => {
  switch (frameMode) {
    case CONST_MODE_CUTTING:
      return [
        {
          x: 1065,
          y: 1670,
          w: 100,
          h: 100,
          xDate: 1120,
          yDate: 1715,
          fontDate: '14px Arial',
          fillStyleDate: '#a7a9ac',
          xOrderNumber: 5,
          yOrderNumber: 10,
          fontOrderNumber: '10px Arial',
          fillStyleOrderNumber: '#a7a9ac',
        },
        // {
        //   x: 400,
        //   y: 1640,
        //   w: 100,
        //   h: 100,
        //   xDate: 500,
        //   yDate: 1715,
        //   fontDate: '14px Arial',
        //   fillStyleDate: '#a7a9ac',
        //   xOrderNumber: 605,
        //   yOrderNumber: 10,
        //   fontOrderNumber: '10px Arial',
        //   fillStyleOrderNumber: '#a7a9ac',
        // },
      ];

    case CONST_MODE_REGULAR:
      if (frameType === 'typeA') {
        return [
          {
            x: 1120,
            y: 1720,
            w: 70,
            h: 70,
            xDate: 1120,
            yDate: 1715,
            fontDate: '14px Arial',
            fillStyleDate: '#a7a9ac',
            xOrderNumber: 5,
            yOrderNumber: 10,
            fontOrderNumber: '10px Arial',
            fillStyleOrderNumber: '#a7a9ac',
          },
        ];
      }

      if (frameType === 'typeB') {
        return [
          {
            x: 1120,
            y: 10,
            w: 70,
            h: 70,
            xDate: 1120,
            yDate: 95,
            fontDate: '14px Arial',
            fillStyleDate: '#a7a9ac',
            xOrderNumber: 5,
            yOrderNumber: 1790,
            fontOrderNumber: '10px Arial',
            fillStyleOrderNumber: '#a7a9ac',
          },
        ];
      }

      if (frameType === 'typeC' || frameType === 'typeE' || frameType === 'typeF') {
        return [
          {
            x: 1720,
            y: 1120,
            w: 70,
            h: 70,
            xDate: 1720,
            yDate: 1115,
            fontDate: '14px Arial',
            fillStyleDate: '#a7a9ac',
            xOrderNumber: 5,
            yOrderNumber: 10,
            fontOrderNumber: '10px Arial',
            fillStyleOrderNumber: '#a7a9ac',
          },
        ];
      }

      if (frameType === 'typeD') {
        return [
          {
            x: 10,
            y: 1720,
            w: 70,
            h: 70,
            xDate: 10,
            yDate: 1715,
            fontDate: '14px Arial',
            fillStyleDate: '#a7a9ac',
            xOrderNumber: 1180,
            yOrderNumber: 10,
            fontOrderNumber: '10px Arial',
            fillStyleOrderNumber: '#a7a9ac',
          },
        ];
      }
    case CONST_MODE_WIDE:
      if (frameType === 'typeA') {
        return [
          {
            x: 1120,
            y: 1720,
            w: 70,
            h: 70,
            xDate: 1120,
            yDate: 1715,
            fontDate: '14px Arial',
            fillStyleDate: '#a7a9ac',
            xOrderNumber: 5,
            yOrderNumber: 10,
            fontOrderNumber: '10px Arial',
            fillStyleOrderNumber: '#a7a9ac',
          },
        ];
      }

      if (frameType === 'typeB') {
        return [
          {
            x: 1120,
            y: 1720,
            w: 70,
            h: 70,
            xDate: 1120,
            yDate: 1715,
            fontDate: '14px Arial',
            fillStyleDate: '#a7a9ac',
            xOrderNumber: 5,
            yOrderNumber: 10,
            fontOrderNumber: '10px Arial',
            fillStyleOrderNumber: '#a7a9ac',
          },
        ];
      }
  }
};

export const getQuantitySelectedImages = (frameMode: string, frameType: string) => {
  let quantity = 4;
  if (frameMode === CONST_MODE_CUTTING) {
    if (frameType === 'typeB') {
      quantity = 3;
    } else if (frameType === 'typeC') {
      quantity = 2;
    }
  } else if (frameMode === CONST_MODE_REGULAR) {
    if (frameType === 'typeB' || frameType === 'typeE') {
      quantity = 6;
    } else if (frameType === 'typeC') {
      quantity = 3;
    } else if (frameType === 'typeF') {
      quantity = 8;
    }
  } else if (frameMode === CONST_MODE_WIDE) {
    if (frameType === 'typeA') {
      quantity = 4;
    } else if (frameType === 'typeB') {
      quantity = 3;
    }
  }

  return quantity;
};
