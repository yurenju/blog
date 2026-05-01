import { t, type Locale } from './i18n';

export type FeedKind = 'all' | 'tech' | 'life';

export interface ChannelMeta {
  title: string;
  description: string;
  language: 'zh-Hant' | 'ja' | 'en';
}

const LANGUAGE_TAG: Record<Locale, ChannelMeta['language']> = {
  zh: 'zh-Hant',
  ja: 'ja',
  en: 'en',
};

/**
 * Build the channel-level metadata (title / description / language) for a feed.
 *
 * - title: "Yuren's Blog - {category-or-all label}"
 * - description: site description per locale
 * - language: zh-Hant / ja / en (NOT zh-tw)
 */
export function channelMeta(locale: Locale, kind: FeedKind): ChannelMeta {
  const text = t(locale);
  const suffix = kind === 'all' ? text.rss.allPosts : text.rss[kind];
  return {
    title: `Yuren's Blog - ${suffix}`,
    description: text.site.description,
    language: LANGUAGE_TAG[locale],
  };
}
