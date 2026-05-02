import type { RSSFeedItem } from '@astrojs/rss';
import { t, type Locale } from './i18n';
import type { PostMeta } from './posts';

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

const ITEM_LIMIT = 20;

/**
 * Build feed items for a feed.
 *
 * @param posts caller is responsible for filtering (locale, category, archived) and sorting (date-desc).
 * @param renderHtml endpoint-supplied function returning the full-content HTML for a post.
 * @param locale used to localize the per-item category label.
 */
export async function buildFeedItems(
  posts: PostMeta[],
  renderHtml: (post: PostMeta) => Promise<string>,
  locale: Locale,
): Promise<RSSFeedItem[]> {
  const sliced = posts.slice(0, ITEM_LIMIT);
  const text = t(locale);
  const items = await Promise.all(
    sliced.map(async (p) => {
      const html = await renderHtml(p);
      return {
        title: p.title,
        pubDate: p.date,
        link: `/${p.locale}/posts/${p.slug}`,
        content: html,
        categories: [text.rss[p.category]],
      } satisfies RSSFeedItem;
    }),
  );
  return items;
}
