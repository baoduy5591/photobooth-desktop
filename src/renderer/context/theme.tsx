import { createContext, useContext, useEffect, useState } from 'react';
import { INIT_THEME } from '../libs/initials';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(INIT_THEME);

  const changeTheme = (key: string) => {
    setTheme((prev) => ({ ...prev, [key]: key }));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.pink);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme, changeTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) return;

  return context;
}
