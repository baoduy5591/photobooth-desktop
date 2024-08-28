import { createContext, useContext, useState } from 'react';
import { INIT_STORE } from '../libs/initials';

interface StoreContextType {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreContextProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreType>(INIT_STORE);
  return <StoreContext.Provider value={{ store, setStore }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) return;

  return context;
}
