import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { getActivePosts } from '../lib/posts';
import { buildFeedItems, channelMeta } from '../lib/rss-feed';

// Legacy alias: /rss.xml — content matches /rss/zh.xml.
export const GET: APIRoute = async ({ site }) => {
  const meta = channelMeta('zh', 'all');
  const posts = await getActivePosts('zh');

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
