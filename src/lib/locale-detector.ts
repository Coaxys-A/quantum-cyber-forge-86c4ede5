/**
 * JavaScript-based locale and location detection utilities
 * Uses browser APIs to detect user's language preference and approximate location
 */

export interface LocaleInfo {
  language: string;
  timezone: string;
  country?: string;
  suggestedLanguage: string;
}

/**
 * Detect user's locale from browser
 */
export const detectLocale = (): LocaleInfo => {
  // Get browser language
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
  const primaryLang = browserLang.split('-')[0];

  // Get timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Map common timezones to countries/languages
  const timezoneLanguageMap: Record<string, string> = {
    'Asia/Tehran': 'fa',
    'Europe/Paris': 'fr',
    'Europe/Berlin': 'de',
    'Europe/Madrid': 'es',
    'America/Sao_Paulo': 'pt-BR',
    'Europe/Moscow': 'ru',
    'Asia/Shanghai': 'zh-CN',
    'Asia/Tokyo': 'ja',
    'Asia/Seoul': 'ko',
    'Asia/Kolkata': 'hi',
    'Europe/Istanbul': 'tr',
    'Europe/Rome': 'it',
    'Europe/Amsterdam': 'nl',
    'Europe/Stockholm': 'sv',
    'Europe/Oslo': 'no',
    'Europe/Copenhagen': 'da',
    'Europe/Helsinki': 'fi',
    'Europe/Warsaw': 'pl',
    'Europe/Prague': 'cs',
    'Asia/Jerusalem': 'he',
    'Asia/Bangkok': 'th',
    'Asia/Jakarta': 'id',
  };

  const suggestedByTimezone = timezoneLanguageMap[timezone];

  return {
    language: browserLang,
    timezone,
    suggestedLanguage: suggestedByTimezone || primaryLang,
  };
};

/**
 * Request geolocation from user (requires permission)
 */
export const requestGeolocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  });
};

/**
 * Determine if language is RTL
 */
export const isRTL = (language: string): boolean => {
  const rtlLanguages = ['ar', 'fa', 'he', 'ur'];
  return rtlLanguages.includes(language.split('-')[0]);
};

/**
 * Get formatted locale string for Intl APIs
 */
export const getIntlLocale = (language: string): string => {
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'fa': 'fa-IR',
    'ar': 'ar-SA',
    'zh-CN': 'zh-Hans-CN',
    'zh-TW': 'zh-Hant-TW',
    'pt-BR': 'pt-BR',
  };

  return localeMap[language] || language;
};

/**
 * Format date according to user's locale
 */
export const formatLocaleDate = (date: Date, language: string): string => {
  const locale = getIntlLocale(language);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format number according to user's locale
 */
export const formatLocaleNumber = (num: number, language: string): string => {
  const locale = getIntlLocale(language);
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format currency according to user's locale
 */
export const formatLocaleCurrency = (
  amount: number,
  currency: string,
  language: string
): string => {
  const locale = getIntlLocale(language);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};
