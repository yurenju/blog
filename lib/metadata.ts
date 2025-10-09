import type { Metadata } from "next";
import { locales, type Locale } from "./i18n/locales";
import { siteConfig } from "./siteConfig";
import { getTranslation } from "./i18n/translations";

const localeToHreflang: Record<Locale, string> = {
  zh: 'zh-Hant',
  ja: 'ja',
  en: 'en',
};

/**
 * Generate hreflang alternates for a given path
 */
export function generateHreflangAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[localeToHreflang[locale]] = `${siteConfig.link}/${locale}${path}`;
  }
  languages['x-default'] = `${siteConfig.link}/zh${path}`;

  return languages;
}

/**
 * Generate metadata for a page with multilingual support
 */
export function generatePageMetadata(
  locale: Locale,
  path: string,
  titleSuffix?: string
): Metadata {
  const t = getTranslation(locale);
  const title = titleSuffix ? `${siteConfig.title} - ${titleSuffix}` : siteConfig.title;

  return {
    title,
    description: t.site.description,
    alternates: {
      languages: generateHreflangAlternates(path),
    },
  };
}
