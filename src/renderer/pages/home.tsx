import { useEffect, useState } from 'react';
import { useStore } from '../context/store';
import { CONST_CONFIG_FONTS } from '../libs/constants';
import { changeFontByName } from '../libs/common';

export default function Home() {
  const { store } = useStore();
  const [userLanguage, setUserLanguage] = useState<string>(store.systemConfigs.language);

  useEffect(() => {
    const fontName = CONST_CONFIG_FONTS[userLanguage as keyof typeof CONST_CONFIG_FONTS];
    changeFontByName(fontName);
  }, []);

  return <div>Home</div>;
}
