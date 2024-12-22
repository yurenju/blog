import { Feed } from "feed";
import {
  getSingletonPostMetadata,
  getPostData,
  type PostData,
  type Category as PostCategory,
} from "./posts";
import { siteConfig } from "./siteConfig";

type Category = PostCategory | "all";

const getCategoryTitle = (category: Category): string => {
  switch (category) {
    case "shorts":
      return "短文";
    case "life":
      return "生活";
    case "tech":
      return "技術";
    default:
      return "全部文章";
  }
};

const generateFeed = (category: Category) => {
  const feed = new Feed({
    ...siteConfig,
    title: `${siteConfig.title} - ${getCategoryTitle(category)}`,
    feedLinks: {
      rss:
        category === "all"
          ? `${siteConfig.link}/rss.xml`
          : `${siteConfig.link}/rss/${category}.xml`,
    },
  });
  return feed;
};

const filterPostsByCategory = (posts: PostData[], category: Category) => {
  if (category === "all") return posts;
  return posts.filter(
    (post) =>
      Array.isArray(post.categories) &&
      post.categories.includes(category as PostCategory)
  );
};

export const generateRSSFeed = async (category: Category = "all") => {
  const feed = generateFeed(category);
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  // Sort posts by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter posts by category and take only the latest 20 posts
  const filteredPosts = filterPostsByCategory(posts, category).slice(0, 20);

  filteredPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.id}/posts/${encodeURIComponent(post.slug)}`,
      link: `${siteConfig.link}/posts/${encodeURIComponent(post.slug)}`,
      description: post.content,
      date: new Date(post.date),
      category: post.categories.map((cat) => ({
        name: getCategoryTitle(cat),
      })),
    });
  });

  return feed.rss2();
};
