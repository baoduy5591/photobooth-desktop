import React, { useEffect, useRef } from 'react';
import { CONST_FRAME_POSITIONS } from '../libs/constants';

interface CanvasProps {
  width: number;
  height: number;
  selectedPhotos: { photo: string; index: number }[];
  pathUserPhotos: string;
  frameMode: string;
  frameType: string;
  indexForClean: number;
}

export const Canvas = React.memo(
  function Canvas({ width, height, selectedPhotos, pathUserPhotos, frameMode, frameType, indexForClean }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getPositionList = () => {
      const object = CONST_FRAME_POSITIONS[frameMode as keyof typeof CONST_FRAME_POSITIONS];
      const positionList = object[frameType as keyof typeof object];
      return positionList;
    };

    const positionListRef = useRef(getPositionList());

    const configCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = width;
      canvas.height = height;
    };

    const drawImageUserPhoto = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const positionList = positionListRef.current;

      selectedPhotos.forEach((item) => {
        const image = new Image();
        image.src = pathUserPhotos + item.photo;
        image.onload = () => {
          const position = positionList[item.index];
          position.forEach((p) => {
            context.drawImage(image, p.x, p.y, p.w, p.h);
          });
        };
      });
    };

    const cleanPhotoByIndex = (indexForClean: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const positionList = positionListRef.current;
      const position = positionList[indexForClean];
      position.forEach((p) => {
        context.clearRect(p.x, p.y, p.w, p.h);
      });
    };

    useEffect(() => {
      if (indexForClean !== -1) {
        cleanPhotoByIndex(indexForClean);
        return;
      }

      drawImageUserPhoto();
    }, [selectedPhotos]);

    useEffect(() => {
      configCanvas();
    }, []);

    return (
      <div className='h-full w-full'>
        <canvas ref={canvasRef} className='h-full w-full'></canvas>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectedPhotos === nextProps.selectedPhotos &&
      prevProps.width === nextProps.height &&
      prevProps.height === nextProps.height
    );
  },
);
