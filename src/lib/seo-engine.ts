import { supabase } from '@/integrations/supabase/client';

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: object[];
  hreflang?: { lang: string; url: string }[];
}

export interface SEOIssue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  element?: string;
  recommendation?: string;
}

export interface SEOAuditResult {
  url: string;
  score: number;
  metadata: SEOMetadata;
  issues: SEOIssue[];
  recommendations: string[];
  extractedData: {
    headings: { h1: string[]; h2: string[]; h3: string[] };
    images: { src: string; alt?: string; missing_alt?: boolean }[];
    links: { internal: number; external: number; broken?: string[] };
    wordCount: number;
    readabilityScore?: number;
  };
}

const SUPPORTED_LANGUAGES = [
  'en', 'fa', 'ar', 'fr', 'de', 'es', 'pt-BR', 'ru', 'zh-CN', 'zh-TW',
  'ja', 'ko', 'hi', 'tr', 'it', 'nl', 'sv', 'no', 'da', 'fi',
  'pl', 'cs', 'he', 'th', 'id'
];

export class SEOEngine {
  async scanPage(url: string, tenantId: string): Promise<SEOAuditResult> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      const metadata = this.extractMetadata(html);
      const structure = this.analyzeStructure(html);
      const issues = this.detectIssues(metadata, structure);
      const score = this.calculateScore(metadata, structure, issues);
      const recommendations = this.generateRecommendations(issues, metadata);

      const auditResult: SEOAuditResult = {
        url,
        score,
        metadata,
        issues,
        recommendations,
        extractedData: structure,
      };

      await this.saveAudit(tenantId, auditResult);

      return auditResult;
    } catch (error) {
      console.error('SEO scan error:', error);
      throw new Error('Failed to scan page');
    }
  }

  extractMetadata(html: string): SEOMetadata {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const getMetaContent = (name: string) => 
      doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.getAttribute('content');

    const metadata: SEOMetadata = {
      title: doc.title,
      description: getMetaContent('description') || undefined,
      keywords: getMetaContent('keywords')?.split(',').map(k => k.trim()),
      canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || undefined,
      ogTitle: getMetaContent('og:title') || undefined,
      ogDescription: getMetaContent('og:description') || undefined,
      ogImage: getMetaContent('og:image') || undefined,
      ogType: getMetaContent('og:type') || undefined,
      twitterCard: getMetaContent('twitter:card') || undefined,
      twitterTitle: getMetaContent('twitter:title') || undefined,
      twitterDescription: getMetaContent('twitter:description') || undefined,
      twitterImage: getMetaContent('twitter:image') || undefined,
    };

    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLdScripts.length > 0) {
      metadata.jsonLd = Array.from(jsonLdScripts).map(script => {
        try {
          return JSON.parse(script.textContent || '{}');
        } catch {
          return {};
        }
      });
    }

    const hreflangLinks = doc.querySelectorAll('link[rel="alternate"][hreflang]');
    if (hreflangLinks.length > 0) {
      metadata.hreflang = Array.from(hreflangLinks).map(link => ({
        lang: link.getAttribute('hreflang') || '',
        url: link.getAttribute('href') || '',
      }));
    }

    return metadata;
  }

  analyzeStructure(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const h1Elements = Array.from(doc.querySelectorAll('h1')).map(h => h.textContent?.trim() || '');
    const h2Elements = Array.from(doc.querySelectorAll('h2')).map(h => h.textContent?.trim() || '');
    const h3Elements = Array.from(doc.querySelectorAll('h3')).map(h => h.textContent?.trim() || '');

    const images = Array.from(doc.querySelectorAll('img')).map(img => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || undefined,
      missing_alt: !img.hasAttribute('alt'),
    }));

    const links = doc.querySelectorAll('a[href]');
    const internalLinks = Array.from(links).filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('/') || href.includes(window.location.hostname);
    });
    const externalLinks = Array.from(links).filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('http') && !href.includes(window.location.hostname);
    });

    const bodyText = doc.body?.textContent || '';
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

    return {
      headings: {
        h1: h1Elements,
        h2: h2Elements,
        h3: h3Elements,
      },
      images,
      links: {
        internal: internalLinks.length,
        external: externalLinks.length,
      },
      wordCount,
    };
  }

  detectIssues(metadata: SEOMetadata, structure: any): SEOIssue[] {
    const issues: SEOIssue[] = [];

    if (!metadata.title) {
      issues.push({
        type: 'missing_title',
        severity: 'critical',
        message: 'Missing page title',
        recommendation: 'Add a descriptive title tag (50-60 characters)',
      });
    } else if (metadata.title.length < 30) {
      issues.push({
        type: 'short_title',
        severity: 'medium',
        message: 'Title is too short',
        recommendation: 'Extend title to 50-60 characters for better SEO',
      });
    } else if (metadata.title.length > 60) {
      issues.push({
        type: 'long_title',
        severity: 'medium',
        message: 'Title is too long',
        recommendation: 'Shorten title to 50-60 characters',
      });
    }

    if (!metadata.description) {
      issues.push({
        type: 'missing_description',
        severity: 'critical',
        message: 'Missing meta description',
        recommendation: 'Add a meta description (150-160 characters)',
      });
    } else if (metadata.description.length < 120) {
      issues.push({
        type: 'short_description',
        severity: 'medium',
        message: 'Meta description is too short',
        recommendation: 'Extend description to 150-160 characters',
      });
    }

    if (!metadata.canonical) {
      issues.push({
        type: 'missing_canonical',
        severity: 'high',
        message: 'Missing canonical URL',
        recommendation: 'Add canonical link to prevent duplicate content issues',
      });
    }

    if (structure.headings.h1.length === 0) {
      issues.push({
        type: 'missing_h1',
        severity: 'critical',
        message: 'Missing H1 heading',
        recommendation: 'Add exactly one H1 heading with target keyword',
      });
    } else if (structure.headings.h1.length > 1) {
      issues.push({
        type: 'multiple_h1',
        severity: 'high',
        message: 'Multiple H1 headings found',
        recommendation: 'Use only one H1 heading per page',
      });
    }

    const imagesWithoutAlt = structure.images.filter((img: any) => img.missing_alt);
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'missing_alt_text',
        severity: 'medium',
        message: `${imagesWithoutAlt.length} images missing alt text`,
        recommendation: 'Add descriptive alt text to all images',
      });
    }

    if (structure.wordCount < 300) {
      issues.push({
        type: 'thin_content',
        severity: 'high',
        message: 'Content is too thin',
        recommendation: 'Add more quality content (aim for 600+ words)',
      });
    }

    if (!metadata.ogTitle || !metadata.ogDescription || !metadata.ogImage) {
      issues.push({
        type: 'incomplete_og_tags',
        severity: 'medium',
        message: 'Incomplete OpenGraph tags',
        recommendation: 'Add og:title, og:description, and og:image for social sharing',
      });
    }

    if (!metadata.jsonLd || metadata.jsonLd.length === 0) {
      issues.push({
        type: 'missing_schema',
        severity: 'low',
        message: 'Missing structured data',
        recommendation: 'Add JSON-LD schema markup for rich snippets',
      });
    }

    return issues;
  }

  calculateScore(metadata: SEOMetadata, structure: any, issues: SEOIssue[]): number {
    let score = 100;

    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    if (metadata.title && metadata.title.length >= 30 && metadata.title.length <= 60) score += 5;
    if (metadata.description && metadata.description.length >= 120 && metadata.description.length <= 160) score += 5;
    if (structure.headings.h1.length === 1) score += 5;
    if (structure.wordCount >= 600) score += 10;
    if (metadata.jsonLd && metadata.jsonLd.length > 0) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  generateRecommendations(issues: SEOIssue[], metadata: SEOMetadata): string[] {
    const recommendations = issues.map(issue => issue.recommendation || issue.message);

    if (!metadata.keywords || metadata.keywords.length === 0) {
      recommendations.push('Add relevant keywords to target your audience');
    }

    if (!metadata.hreflang || metadata.hreflang.length === 0) {
      recommendations.push('Add hreflang tags for international SEO');
    }

    return recommendations;
  }

  async saveAudit(tenantId: string, result: SEOAuditResult): Promise<void> {
    const { data, error } = await supabase.from('seo_audits').insert({
      tenant_id: tenantId as any,
      url: result.url,
      seo_score: result.score,
      metadata: result.metadata as any,
      issues: result.issues as any,
      recommendations: result.recommendations as any,
      extracted_data: result.extractedData as any,
      status: 'completed',
      scanned_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  async generateMetadataForLanguage(language: string, pageType: string, content: any): Promise<SEOMetadata> {
    const metadata: SEOMetadata = {
      title: this.generateTitle(language, pageType, content),
      description: this.generateDescription(language, pageType, content),
      keywords: this.generateKeywords(language, pageType, content),
      ogTitle: this.generateTitle(language, pageType, content),
      ogDescription: this.generateDescription(language, pageType, content),
      ogType: 'website',
      twitterCard: 'summary_large_image',
      jsonLd: this.generateSchema(language, pageType, content),
    };

    return metadata;
  }

  private generateTitle(language: string, pageType: string, content: any): string {
    const titles: Record<string, Record<string, string>> = {
      en: {
        home: 'Hyperion-Flux - Enterprise Cyber Operations Platform',
        dashboard: 'Dashboard - Hyperion-Flux',
        pricing: 'Pricing Plans - Hyperion-Flux',
      },
      fa: {
        home: 'هایپریون-فلاکس - پلتفرم عملیات سایبری سازمانی',
        dashboard: 'داشبورد - هایپریون-فلاکس',
        pricing: 'پلن‌های قیمت‌گذاری - هایپریون-فلاکس',
      },
    };

    return titles[language]?.[pageType] || titles.en[pageType] || 'Hyperion-Flux';
  }

  private generateDescription(language: string, pageType: string, content: any): string {
    const descriptions: Record<string, Record<string, string>> = {
      en: {
        home: 'Advanced enterprise cyber operations platform with AI-powered security analysis, APT simulation, and real-time threat intelligence.',
        dashboard: 'Monitor your security posture, risks, and compliance status in real-time.',
        pricing: 'Choose the perfect plan for your organization. From startups to enterprises.',
      },
      fa: {
        home: 'پلتفرم پیشرفته عملیات سایبری سازمانی با تحلیل امنیتی مبتنی بر هوش مصنوعی، شبیه‌سازی APT و اطلاعات تهدید در زمان واقعی.',
        dashboard: 'وضعیت امنیتی، ریسک‌ها و انطباق خود را در زمان واقعی نظارت کنید.',
        pricing: 'برنامه مناسب سازمان خود را انتخاب کنید. از استارتاپ تا سازمان‌های بزرگ.',
      },
    };

    return descriptions[language]?.[pageType] || descriptions.en[pageType] || '';
  }

  private generateKeywords(language: string, pageType: string, content: any): string[] {
    return [
      'cyber security',
      'threat intelligence',
      'APT simulation',
      'security operations',
      'compliance',
      'risk management',
    ];
  }

  private generateSchema(language: string, pageType: string, content: any): object[] {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Hyperion-Flux',
        applicationCategory: 'SecurityApplication',
        offers: {
          '@type': 'Offer',
          category: 'Enterprise Security Platform',
        },
      },
    ];
  }
}

export const seoEngine = new SEOEngine();
