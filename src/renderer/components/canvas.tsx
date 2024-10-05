import React, { useEffect, useRef } from 'react';
import { CONST_POSITION_FRAMES } from '../libs/constants';

interface CanvasProps {
  width: number;
  height: number;
  selectedPhotos: string[];
  pathUserPhotos: string;
  frameMode: string;
  frameType: string;
}

export const Canvas = React.memo(
  function Canvas({ width, height, selectedPhotos, pathUserPhotos, frameMode, frameType }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getListPositions = () => {
      const object = CONST_POSITION_FRAMES[frameMode as keyof typeof CONST_POSITION_FRAMES];
      const listPosition = object[frameType as keyof typeof object];
      return listPosition;
    };

    const listPositionRef = useRef(getListPositions());

    const quantityPhotos = useRef<number>(0);

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

      const listPosition = listPositionRef.current;
      if (selectedPhotos.length - quantityPhotos.current > 0) {
        quantityPhotos.current += 1;
      } else {
        const position = listPosition[selectedPhotos.length];
        position.forEach((p) => {
          context.clearRect(p.x, p.y, p.w, p.h);
        });

        quantityPhotos.current -= 1;
      }

      selectedPhotos.forEach((photo, index) => {
        const image = new Image();
        image.src = pathUserPhotos + photo;
        image.onload = () => {
          const position = listPosition[index];
          position.forEach((p) => {
            context.drawImage(image, p.x, p.y, p.w, p.h);
          });
        };
      });
    };

    useEffect(() => {
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
