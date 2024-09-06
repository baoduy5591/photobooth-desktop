import React from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';
import App from './app';
import { StoreContextProvider } from './context/store';
import { ThemeContextProvider } from './context/theme';
import { SoundContextProvider } from './context/sound';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <StoreContextProvider>
        <SoundContextProvider>
          <App />
        </SoundContextProvider>
      </StoreContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
);
