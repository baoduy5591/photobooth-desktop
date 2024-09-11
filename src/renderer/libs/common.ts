export const changeFontByName = (fontName: string) => {
  document.body.style.fontFamily = fontName;
}

export const checkIsTouch = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, isTouch: React.MutableRefObject<boolean>) => {
  if (event.type === 'touchstart' || event.type === 'touchend') {
    isTouch.current = true;
  } else {
    if (isTouch.current) {
      isTouch.current = false;
      return false;
    }
  }

  return true
}

export const chunkItems = (items: string[], size: number) => {
  const chunkList = [];
  const _length = items.length;
  for (let i = 0; i < _length; i += size) {
    chunkList.push(items.slice(i, i + size));
  }

  return chunkList;
}