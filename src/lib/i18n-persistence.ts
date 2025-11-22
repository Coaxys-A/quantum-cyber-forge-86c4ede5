import i18n from './i18n';

// Persist language to localStorage
export function persistLanguage(language: string) {
  localStorage.setItem('preferred_language', language);
  i18n.changeLanguage(language);
}

// Load persisted language
export function loadPersistedLanguage() {
  const stored = localStorage.getItem('preferred_language');
  const supportedLngs = i18n.options.supportedLngs;
  if (stored && supportedLngs && Array.isArray(supportedLngs) && supportedLngs.includes(stored)) {
    i18n.changeLanguage(stored);
    return stored;
  }
  return i18n.language;
}

// Initialize on app start
loadPersistedLanguage();
