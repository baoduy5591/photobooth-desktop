import React from 'react';
import { DisplayImage } from './displayImage';
import { useStore } from '../context/store';

interface StickersProps {
  itemsSticker: PathResourceType[];
  handleOnTouchEndChooseSticker: (event: React.TouchEvent<HTMLDivElement>, sticker: PathResourceType) => void;
}

export const Stickers = React.memo(
  function Stickers({ itemsSticker, handleOnTouchEndChooseSticker }: StickersProps) {
    const { store } = useStore();

    return (
      <div className='mb-14 mt-4 grid min-h-max w-full grid-cols-5 justify-items-center'>
        {itemsSticker.map((sticker, index) => {
          return (
            <div
              key={index}
              className='my-6 h-[90px] w-[90px] rounded-full bg-custom-style-3-3 p-4'
              onTouchEnd={(event) => handleOnTouchEndChooseSticker(event, sticker)}
            >
              <div className='h-full w-full'>
                <DisplayImage src={store.assetsFolderPath + sticker.relPath} />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.itemsSticker === nextProps.itemsSticker &&
      prevProps.handleOnTouchEndChooseSticker === nextProps.handleOnTouchEndChooseSticker
    );
  },
);
