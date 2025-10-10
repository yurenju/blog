import { Feed } from "feed";
import {
  getSingletonPostMetadata,
  getPostData,
  type PostData,
  type Category as PostCategory,
} from "./posts";
import { siteConfig } from "./siteConfig";
import { type Locale } from "./i18n/locales";
import { getTranslation } from "./i18n/translations";

type Category = PostCategory | "all";

const getCategoryTitle = (category: Category, locale: Locale = 'zh'): string => {
  const t = getTranslation(locale);

  switch (category) {
    case "life":
      return t.categories.life;
    case "tech":
      return t.categories.tech;
    default:
      return t.nav.allPosts;
  }
};

const generateFeed = (category: Category, locale?: Locale) => {
  const categoryTitle = getCategoryTitle(category, locale || 'zh');
  const t = getTranslation(locale || 'zh');

  // Determine RSS link based on locale and category
  let rssLink: string;
  if (!locale) {
    // Legacy all-languages feed
    rssLink = category === "all"
      ? `${siteConfig.link}/rss.xml`
      : `${siteConfig.link}/rss/${category}.xml`;
  } else {
    // Locale-specific feed
    rssLink = category === "all"
      ? `${siteConfig.link}/rss/${locale}.xml`
      : `${siteConfig.link}/rss/${locale}/${category}.xml`;
  }

  const feed = new Feed({
    ...siteConfig,
    title: `${siteConfig.title} - ${categoryTitle}`,
    description: t.site.description,
    feedLinks: {
      rss: rssLink,
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

export const generateRSSFeed = async (category: Category = "all", locale?: Locale) => {
  const feed = generateFeed(category, locale);
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  // Sort posts by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter posts by locale if specified
  let postsToProcess = posts;
  if (locale) {
    postsToProcess = posts.filter((post) => post.locale === locale);
  }

  // Filter posts by category and take only the latest 20 posts
  const filteredPosts = filterPostsByCategory(postsToProcess, category).slice(0, 20);

  filteredPosts.forEach((post) => {
    const postLocale = post.locale;
    const localePrefix = postLocale === 'zh' ? '' : `/${postLocale}`;

    feed.addItem({
      title: post.title,
      id: `${siteConfig.id}${localePrefix}/posts/${encodeURIComponent(post.slug)}`,
      link: `${siteConfig.link}${localePrefix}/posts/${encodeURIComponent(post.slug)}`,
      description: post.content,
      date: new Date(post.date),
      category: post.categories.map((cat) => ({
        name: getCategoryTitle(cat, locale || postLocale),
      })),
    });
  });

  return feed.rss2();
};
