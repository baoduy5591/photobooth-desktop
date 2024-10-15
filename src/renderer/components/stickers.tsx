import React from 'react';
import { DisplayImage } from './displayImage';
import { useStore } from '../context/store';

interface StickersProps {
  itemsSticker: PathResourceType[][];
  currentIndex: number;
  handleOnTouchEndChooseSticker: (event: React.TouchEvent<HTMLDivElement>, sticker: PathResourceType) => void;
}

export const Stickers = React.memo(
  function Stickers({ itemsSticker, currentIndex, handleOnTouchEndChooseSticker }: StickersProps) {
    const { store } = useStore();

    return (
      <div className='flex h-full w-full items-center overflow-x-hidden py-16'>
        {itemsSticker.map((stickers, index) => {
          return (
            <div
              key={index}
              className='grid h-full min-w-full grid-cols-6 content-start justify-items-center gap-y-8 transition-transform duration-500'
              style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
            >
              {stickers.map((sticker, index) => {
                return (
                  <div
                    key={index}
                    className='h-[90px] w-[90px] rounded-full bg-custom-style-3-3 p-4'
                    onTouchEnd={(event) => handleOnTouchEndChooseSticker(event, sticker)}
                  >
                    <div className='h-full w-full'>
                      <DisplayImage src={store.pathFolderAssets + sticker.relPath} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.itemsSticker === nextProps.itemsSticker &&
      prevProps.currentIndex === nextProps.currentIndex &&
      prevProps.handleOnTouchEndChooseSticker === nextProps.handleOnTouchEndChooseSticker
    );
  },
);
