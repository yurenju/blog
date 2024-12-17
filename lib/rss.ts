import { Feed } from "feed";
import { getSingletonPostMetadata, getPostData } from "./posts";
import { siteConfig } from "./siteConfig";

export const generateRSSFeed = async () => {
  const feed = new Feed({
    ...siteConfig,
    feedLinks: {
      rss: `${siteConfig.link}/rss.xml`,
    },
  });

  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  // Sort posts by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Take only the latest 20 posts
  const latestPosts = posts.slice(0, 20);

  latestPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.id}/posts/${encodeURIComponent(post.slug)}`,
      link: `${siteConfig.link}/posts/${encodeURIComponent(post.slug)}`,
      description: post.content,
      date: new Date(post.date),
    });
  });

  return feed.rss2();
};
