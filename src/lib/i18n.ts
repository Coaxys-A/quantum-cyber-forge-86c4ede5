import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '@/locales/en/translation.json';
import faTranslations from '@/locales/fa/translation.json';

const resources = {
  en: {
    translation: enTranslations
  },
  fa: {
    translation: faTranslations
  },
  // Add more languages as needed
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: [
      'en', 'fa', 'ar', 'fr', 'de', 'es', 'pt-BR', 'ru', 'zh-CN', 'zh-TW',
      'ja', 'ko', 'hi', 'tr', 'it', 'nl', 'sv', 'no', 'da', 'fi',
      'pl', 'cs', 'he', 'th', 'id'
    ],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferred_language',
    }
  });

export default i18n;
