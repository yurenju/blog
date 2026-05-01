import type { APIRoute, GetStaticPaths } from 'astro';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { getPostsByCategory } from '../../lib/posts';
import { buildFeedItems, channelMeta, type FeedKind } from '../../lib/rss-feed';

const CATEGORIES = ['tech', 'life'] as const;
type Category = (typeof CATEGORIES)[number];

// Legacy alias: /rss/{tech,life}.xml — content matches /rss/zh/{tech,life}.xml.
export const getStaticPaths: GetStaticPaths = () =>
  CATEGORIES.map((category) => ({ params: { category } }));

export const GET: APIRoute = async ({ params, site }) => {
  const category = params.category as Category;
  const meta = channelMeta('zh', category as FeedKind);
  const posts = await getPostsByCategory(category, 'zh');

  const container = await AstroContainer.create();
  const renderHtml = async (post: typeof posts[number]): Promise<string> => {
    const { Content } = await render(post.entry);
    return await container.renderToString(Content);
  };

  const items = await buildFeedItems(posts, renderHtml, 'zh');

  return rss({
    title: meta.title,
    description: meta.description,
    site: site!,
    customData: `<language>${meta.language}</language>`,
    items,
  });
};
