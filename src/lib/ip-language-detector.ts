/**
 * IP-based language detection using multiple free APIs
 */

interface IPLocationData {
  country_code?: string;
  country?: string;
  countryCode?: string;
}

const countryLanguageMap: Record<string, string> = {
  // Persian
  IR: 'fa',
  AF: 'fa',
  
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar',
  LB: 'ar', OM: 'ar', QA: 'ar', SY: 'ar', YE: 'ar', BH: 'ar',
  DZ: 'ar', MA: 'ar', TN: 'ar', LY: 'ar', SD: 'ar', SO: 'ar',
  
  // French
  FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr', LU: 'fr', MC: 'fr',
  
  // German
  DE: 'de', AT: 'de',
  
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  VE: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es', PR: 'es',
  
  // Portuguese
  BR: 'pt-BR', PT: 'pt-BR',
  
  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru', UA: 'ru',
  
  // Chinese
  CN: 'zh-CN', SG: 'zh-CN',
  TW: 'zh-TW', HK: 'zh-TW', MO: 'zh-TW',
  
  // Japanese
  JP: 'ja',
  
  // Korean
  KR: 'ko',
  
  // Hindi
  IN: 'hi',
  
  // Turkish
  TR: 'tr',
  
  // Italian
  IT: 'it',
  
  // Dutch
  NL: 'nl',
  
  // Swedish
  SE: 'sv',
  
  // Norwegian
  NO: 'no',
  
  // Danish
  DK: 'da',
  
  // Finnish
  FI: 'fi',
  
  // Polish
  PL: 'pl',
  
  // Czech
  CZ: 'cs',
  
  // Hebrew
  IL: 'he',
  
  // Thai
  TH: 'th',
  
  // Indonesian
  ID: 'id',
};

/**
 * Detect language based on IP geolocation
 * Falls back to browser language if IP detection fails
 */
export async function detectLanguageFromIP(): Promise<string> {
  try {
    // Try multiple free IP geolocation APIs in sequence
    const apis = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://ipwhois.app/json/',
    ];

    for (const api of apis) {
      try {
        const response = await fetch(api, {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        
        if (!response.ok) continue;
        
        const data: IPLocationData = await response.json();
        const countryCode = data.country_code || data.countryCode || data.country;
        
        if (countryCode) {
          const language = countryLanguageMap[countryCode.toUpperCase()];
          if (language) {
            console.log(`Detected language ${language} from country ${countryCode}`);
            return language;
          }
        }
      } catch (err) {
        console.warn(`IP API ${api} failed:`, err);
        continue;
      }
    }
    
    // If all IP APIs fail, fall back to browser language
    return detectBrowserLanguage();
  } catch (error) {
    console.error('IP detection failed:', error);
    return detectBrowserLanguage();
  }
}

/**
 * Detect language from browser settings
 */
function detectBrowserLanguage(): string {
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
  const primaryLang = browserLang.split('-')[0];
  
  // Map common browser language codes to our supported languages
  const langMap: Record<string, string> = {
    fa: 'fa', ar: 'ar', fr: 'fr', de: 'de', es: 'es',
    pt: 'pt-BR', ru: 'ru', zh: 'zh-CN', ja: 'ja', ko: 'ko',
    hi: 'hi', tr: 'tr', it: 'it', nl: 'nl', sv: 'sv',
    no: 'no', da: 'da', fi: 'fi', pl: 'pl', cs: 'cs',
    he: 'he', th: 'th', id: 'id',
  };
  
  return langMap[primaryLang] || 'en';
}

/**
 * Check if language has already been set by user
 */
export function hasUserSetLanguage(): boolean {
  return localStorage.getItem('i18nextLng') !== null;
}

/**
 * Initialize language detection on app load
 */
export async function initializeLanguage(i18n: any) {
  // Don't override if user has already selected a language
  if (hasUserSetLanguage()) {
    return;
  }
  
  // Detect and set language
  const detectedLanguage = await detectLanguageFromIP();
  
  // Only change if different from current
  if (i18n.language !== detectedLanguage) {
    await i18n.changeLanguage(detectedLanguage);
    console.log(`Auto-detected and set language to: ${detectedLanguage}`);
  }
}
