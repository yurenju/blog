import type { APIRoute, GetStaticPaths } from 'astro';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { LOCALES, type Locale } from '../../lib/i18n';
import { getActivePosts } from '../../lib/posts';
import { buildFeedItems, channelMeta } from '../../lib/rss-feed';

export const getStaticPaths: GetStaticPaths = () =>
  LOCALES.map((locale) => ({ params: { locale } }));

export const GET: APIRoute = async ({ params, site }) => {
  const locale = params.locale as Locale;
  const meta = channelMeta(locale, 'all');
  const posts = await getActivePosts(locale);

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
