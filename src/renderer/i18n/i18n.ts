import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import TRANSLATE_EN from '../locales/en/translate.json';
import TRANSLATE_VI from '../locales/vi/translate.json';

export const resources = {
  en: {
    translation: TRANSLATE_EN
  },
  vi: {
    translation: TRANSLATE_VI
  }
};

const defaultLng = 'vi';
export const defaultNS = 'translation';

use(initReactI18next).init({
  resources,
  lng: defaultLng,
  ns: ['translation'],
  defaultNS,
  fallbackLng: defaultLng,
  interpolation: {
    escapeValue: false,
  }
})