/**
 * IP-based language detection using multiple free APIs
 * With improved timeout handling and caching
 */

interface IPLocationData {
  country_code?: string;
  country?: string;
  countryCode?: string;
}

const countryLanguageMap: Record<string, string> = {
  // Persian
  IR: 'fa', AF: 'fa',
  
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

const CACHE_KEY = 'detected_language';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedLanguage {
  language: string;
  timestamp: number;
}

function getCachedLanguage(): string | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { language, timestamp }: CachedLanguage = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return language;
      }
    }
  } catch {
    // Ignore cache errors
  }
  return null;
}

function setCachedLanguage(language: string): void {
  try {
    const data: CachedLanguage = { language, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore cache errors
  }
}

/**
 * Fast timeout wrapper for fetch
 */
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Detect language based on IP geolocation
 * Falls back to browser language if IP detection fails
 */
export async function detectLanguageFromIP(): Promise<string> {
  // Check cache first
  const cached = getCachedLanguage();
  if (cached) {
    console.log(`Using cached language: ${cached}`);
    return cached;
  }

  // Try browser language first (fast path)
  const browserLang = detectBrowserLanguage();
  
  // Try IP detection in background, but don't block
  try {
    const apis = [
      { url: 'https://ipapi.co/json/', timeout: 1500 },
    ];

    for (const { url, timeout } of apis) {
      try {
        const response = await fetchWithTimeout(url, timeout);
        
        if (!response.ok) continue;
        
        const data: IPLocationData = await response.json();
        const countryCode = data.country_code || data.countryCode || data.country;
        
        if (countryCode) {
          const language = countryLanguageMap[countryCode.toUpperCase()];
          if (language) {
            console.log(`Detected language ${language} from country ${countryCode}`);
            setCachedLanguage(language);
            return language;
          }
        }
      } catch {
        // Continue to next API or fallback
        continue;
      }
    }
  } catch {
    // Fall through to browser language
  }
  
  // Cache and return browser language
  setCachedLanguage(browserLang);
  return browserLang;
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
  
  // Use browser language immediately (non-blocking)
  const browserLang = detectBrowserLanguage();
  if (i18n.language !== browserLang) {
    await i18n.changeLanguage(browserLang);
  }
  
  // Then try IP detection in background
  detectLanguageFromIP().then((detectedLanguage) => {
    if (detectedLanguage !== browserLang && i18n.language !== detectedLanguage) {
      // Only change if IP detection gives different result
      i18n.changeLanguage(detectedLanguage);
      console.log(`Updated language to: ${detectedLanguage}`);
    }
  }).catch(() => {
    // Keep browser language
  });
}
