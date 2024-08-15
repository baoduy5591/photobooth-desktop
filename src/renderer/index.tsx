import React from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';
import App from './app';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);  