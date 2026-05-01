import { HREFLANG, type Locale } from './i18n';
import type { PostMeta } from './posts';

/**
 * Default OG image when a page has no specific cover.
 * Site logo lives at root /logo.jpg (Phase 0+).
 */
export const SITE_LOGO = {
  url: 'https://yurenju.blog/logo.jpg',
  width: 100,
  height: 100,
};

/**
 * Resolve a path or URL to an absolute URL using the configured site origin.
 * Pass-through if already absolute (http/https).
 */
export function absoluteUrl(pathOrUrl: string, site: URL): string {
  if (/^https?:/.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, site).href;
}

/**
 * Build the JSON-LD `Article` schema object for a post.
 * Caller is responsible for serializing via JSON.stringify (and escaping `</`).
 */
export function buildArticleSchema(
  post: PostMeta,
  locale: Locale,
  ogImageUrl: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    inLanguage: HREFLANG[locale],
    datePublished: post.date.toISOString(),
    image: ogImageUrl,
    author: {
      '@type': 'Person',
      name: 'Yuren Ju',
      url: 'https://yurenju.blog',
    },
  };
}
