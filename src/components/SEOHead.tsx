import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object;
  noindex?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/og-default.jpg',
  ogType = 'website',
  jsonLd,
  noindex = false,
}: SEOHeadProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hyperionflux.com';

  useEffect(() => {
    // Set title
    if (title) {
      document.title = `${title} | Hyperion-Flux`;
    }

    // Set meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: `${baseUrl}${ogImage}` },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: canonicalUrl || window.location.href },
      { property: 'og:locale', content: currentLang.replace('-', '_') },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${baseUrl}${ogImage}` },
      { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;
      
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) meta.setAttribute('property', property);
        if (name) meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    });

    // Set canonical
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonicalUrl;
    }

    // Set hreflang
    const languages = ['en', 'fa', 'ar', 'fr', 'de', 'es', 'pt-BR', 'ru', 'zh-CN', 'zh-TW', 'ja', 'ko', 'hi', 'tr', 'it', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'he', 'th', 'id'];
    
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    
    languages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${baseUrl}/${lang}${window.location.pathname}`;
      document.head.appendChild(link);
    });

    // Add x-default
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}${window.location.pathname}`;
    document.head.appendChild(defaultLink);

    // Set JSON-LD
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, jsonLd, currentLang, noindex, baseUrl]);

  return null;
}
