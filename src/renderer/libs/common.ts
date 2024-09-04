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