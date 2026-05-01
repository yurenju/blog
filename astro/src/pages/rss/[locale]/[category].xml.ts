import type { APIRoute, GetStaticPaths } from 'astro';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { LOCALES, type Locale } from '../../../lib/i18n';
import { getPostsByCategory } from '../../../lib/posts';
import { buildFeedItems, channelMeta, type FeedKind } from '../../../lib/rss-feed';

const CATEGORIES = ['tech', 'life'] as const;
type Category = (typeof CATEGORIES)[number];

export const getStaticPaths: GetStaticPaths = () =>
  LOCALES.flatMap((locale) =>
    CATEGORIES.map((category) => ({ params: { locale, category } })),
  );

export const GET: APIRoute = async ({ params, site }) => {
  const locale = params.locale as Locale;
  const category = params.category as Category;
  const meta = channelMeta(locale, category as FeedKind);
  const posts = await getPostsByCategory(category, locale);

  const container = await AstroContainer.create();
  const renderHtml = async (post: typeof posts[number]): Promise<string> => {
    const { Content } = await render(post.entry);
    return await container.renderToString(Content);
  };

  const items = await buildFeedItems(posts, renderHtml, locale);

  return rss({
    title: meta.title,
    description: meta.description,
    site: site!,
    customData: `<language>${meta.language}</language>`,
    items,
  });
};
