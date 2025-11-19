import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectLocale } from '@/lib/locale-detector';

export const LocaleDetectionBanner = () => {
  const { t, i18n } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [suggestedLanguage, setSuggestedLanguage] = useState('');

  useEffect(() => {
    const locale = detectLocale();
    const currentLang = i18n.language.split('-')[0];
    const suggested = locale.suggestedLanguage.split('-')[0];

    // Show banner if detected language differs from current
    if (suggested !== currentLang && suggested !== 'en') {
      setSuggestedLanguage(suggested);
      
      // Check if user has already dismissed this suggestion
      const dismissed = localStorage.getItem(`locale-suggestion-dismissed-${suggested}`);
      if (!dismissed) {
        setShowBanner(true);
      }
    }
  }, [i18n.language]);

  const handleAccept = () => {
    i18n.changeLanguage(suggestedLanguage);
    setShowBanner(false);
    localStorage.removeItem(`locale-suggestion-dismissed-${suggestedLanguage}`);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(`locale-suggestion-dismissed-${suggestedLanguage}`, 'true');
  };

  if (!showBanner) return null;

  const languageNames: Record<string, string> = {
    fa: 'فارسی (Persian)',
    ar: 'العربية (Arabic)',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    ru: 'Русский',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    hi: 'हिन्दी',
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-sm">
          {t('locale.detectSuggestion', {
            language: languageNames[suggestedLanguage] || suggestedLanguage
          })}
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAccept}
          >
            {t('common.yes')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
