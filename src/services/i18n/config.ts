import 'intl-pluralrules';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import translationEnglish from '../../assets/locales/en.json';
import translationHindi from '../../assets/locales/hi.json';

i18n.use(initReactI18next).init({
  debug: false,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources: {
    en: {
      translation: translationEnglish,
    },
    hi: {
      translation: translationHindi,
    },
  },
});

export default i18n;