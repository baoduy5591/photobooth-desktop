import React from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';
import App from './app';
import { StoreContextProvider } from './context/store';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </React.StrictMode>,
);
