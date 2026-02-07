import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  processMarkdownContent,
  stripMarkdownToText,
  extractFirstImage,
} from "./markdown";
import { Locale } from "./i18n/locales";

const postsDirectory = path.join(process.cwd(), "public/posts");

const CONCURRENCY_LIMIT = 50;

async function processInBatches<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  batchSize: number = CONCURRENCY_LIMIT
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

interface PostMetadata {
  slug: string;
  filePath: string;
  group: string;
}

let cachedPostMetadata: Record<string, PostMetadata> | null = null;

export const getSingletonPostMetadata = async (): Promise<
  Record<string, PostMetadata>
> => {
  if (cachedPostMetadata) {
    return cachedPostMetadata;
  }

  cachedPostMetadata = await getAllPostMetadata();
  return cachedPostMetadata;
};

async function getAllPostMetadata(): Promise<Record<string, PostMetadata>> {
  const groupEntries = await fs.promises.readdir(postsDirectory, {
    withFileTypes: true,
  });
  const groupDirs = groupEntries.filter((entry) => entry.isDirectory());

  const posts: Record<string, PostMetadata> = {};

  // Collect all post directories with their group info
  const allPostDirs: { groupName: string; dirPath: string; postDirName: string }[] = [];

  for (const groupDir of groupDirs) {
    const groupPath = path.join(postsDirectory, groupDir.name);
    const postEntries = await fs.promises.readdir(groupPath, {
      withFileTypes: true,
    });
    const postDirs = postEntries.filter((entry) => entry.isDirectory());

    for (const postDir of postDirs) {
      allPostDirs.push({
        groupName: groupDir.name,
        dirPath: path.join(groupPath, postDir.name),
        postDirName: postDir.name,
      });
    }
  }

  // Process post directories in batches to avoid EMFILE
  await processInBatches(allPostDirs, async ({ groupName, dirPath, postDirName }) => {
    const files = await fs.promises.readdir(dirPath);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // Skip directories without markdown files (e.g., assets/)
    if (mdFiles.length === 0) {
      return;
    }

    // First, find the primary (zh) version to get the canonical slug
    const zhFile = mdFiles.find(file => extractLocaleFromFilename(file) === 'zh');
    let primarySlug: string | null = null;

    if (zhFile) {
      const zhPath = path.join(dirPath, zhFile);
      const zhContents = await fs.promises.readFile(zhPath, "utf8");
      const zhMatter = matter(zhContents);
      primarySlug = zhMatter.data.slug || postDirName;
    }

    // Process all language versions in this directory
    for (const mdFile of mdFiles) {
      const fullPath = path.join(dirPath, mdFile);
      const fileContents = await fs.promises.readFile(fullPath, "utf8");
      const matterResult = matter(fileContents);
      const locale = extractLocaleFromFilename(mdFile);

      // Get slug: prefer current file's slug, then primary slug, then directory name
      const slug = encodeSlug(
        matterResult.data.slug ||
        primarySlug ||
        postDirName
      );

      // Create a unique key for each language version
      const postKey = locale === 'zh' ? slug : `${slug}-${locale}`;

      posts[postKey] = {
        slug,
        filePath: fullPath,
        group: groupName,
      };
    }
  });

  return posts;
}

interface ImageInfo {
  path: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export type PostData = {
  slug: string;
  title: string;
  date: string;
  content: string;
  categories: Category[];
  filePath: string;
  description: string;
  coverImage: ImageInfo | null;
  locale: Locale;
  availableLocales: Locale[];
  archived: boolean;
};

export type Category = "life" | "tech";

/**
 * Extract locale from filename
 * Examples:
 * - "index.md" -> "zh"
 * - "index.ja.md" -> "ja"
 * - "index.en.md" -> "en"
 */
export function extractLocaleFromFilename(filename: string): Locale {
  const match = filename.match(/\.(ja|en)\.md$/);
  return match ? (match[1] as Locale) : 'zh';
}

/**
 * Find all language versions of a post in the same directory
 * Returns a record of locale to filename
 */
async function findTranslations(dirPath: string): Promise<Record<Locale, string>> {
  const files = await fs.promises.readdir(dirPath);
  const mdFiles = files.filter((file) => file.endsWith('.md'));

  const translations: Partial<Record<Locale, string>> = {};

  for (const file of mdFiles) {
    const locale = extractLocaleFromFilename(file);
    translations[locale] = file;
  }

  return translations as Record<Locale, string>;
}

/**
 * Derive the group directory name from a post file path.
 * Path structure: .../public/posts/{group}/{postDir}/{file}.md
 */
function getGroupFromFilePath(filePath: string): string {
  const postDir = path.dirname(filePath);
  const groupDir = path.dirname(postDir);
  return path.basename(groupDir);
}

export async function getPostData(filePath: string): Promise<PostData> {
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  const matterResult = matter(fileContents);

  // Extract locale from filename
  const filename = path.basename(filePath);
  const locale = extractLocaleFromFilename(filename);

  // Find all available language versions
  const dirPath = path.dirname(filePath);
  const translations = await findTranslations(dirPath);
  const availableLocales = Object.keys(translations) as Locale[];

  // For translated posts (non-zh), load primary (zh) version for metadata inheritance
  let primaryMatterResult = null;
  if (locale !== 'zh' && translations['zh']) {
    const primaryFilePath = path.join(dirPath, translations['zh']);
    const primaryFileContents = await fs.promises.readFile(primaryFilePath, "utf8");
    primaryMatterResult = matter(primaryFileContents);
  }

  // Get slug from current file's frontmatter, or primary file, or directory name
  const slug = encodeSlug(
    matterResult.data.slug ||
    primaryMatterResult?.data.slug ||
    path.basename(path.dirname(filePath))
  );

  // Get date from current file's frontmatter, or primary file, or infer from slug
  let date = matterResult.data.date || primaryMatterResult?.data.date;
  if (date) {
    date = new Date(date).toISOString();
  } else {
    date = "未知日期";
    const slugParts = slug.split("_");
    const potentialDate = slugParts[0];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateRegex.test(potentialDate)) {
      date = new Date(potentialDate).toISOString();
    }
  }

  // Get categories from current file's frontmatter, or primary file
  const categories = matterResult.data.categories || primaryMatterResult?.data.categories || [];

  // Get title: prefer current file's frontmatter, then use current filename (without locale suffix)
  let title = matterResult.data.title;
  if (!title) {
    // Remove locale suffix from filename to get base name
    // e.g., "index.ja.md" -> "index", "叫 AI 幫我寫程式,結果他聽不懂人話?.md" -> "叫 AI 幫我寫程式,結果他聽不懂人話?"
    const baseFilename = filename.replace(/\.(ja|en)\.md$/, '.md');
    title = path.basename(baseFilename, '.md');
  }

  // Content and description come from the current file (translated content)
  const content = await processMarkdownContent(filePath, matterResult.content);
  const description = await stripMarkdownToText(
    filePath,
    matterResult.content,
    200
  );
  const coverImage = await extractFirstImage(matterResult.content, filePath);

  const group = getGroupFromFilePath(filePath);
  const archived = group === "archives";

  return {
    slug,
    title,
    date,
    content,
    categories,
    filePath,
    description,
    coverImage,
    locale,
    availableLocales,
    archived,
  };
}

export function decodeSlug(slug: string) {
  return process.env.NODE_ENV === "development"
    ? slug
    : decodeURIComponent(slug);
}

export function encodeSlug(slug: string) {
  const updatedSlug = slug.replaceAll(" ", "").toLowerCase();

  return process.env.NODE_ENV === "development"
    ? encodeURIComponent(updatedSlug)
    : updatedSlug;
}

export const fetchCategoryPosts = async (category: Category, locale: Locale = 'zh', includeArchived: boolean = false) => {
  const allPostMetadata = await getSingletonPostMetadata();

  // Filter by locale and archived status before loading full post data
  const filteredMetadata = Object.values(allPostMetadata).filter((post) => {
    const filename = path.basename(post.filePath);
    const postLocale = extractLocaleFromFilename(filename);
    if (postLocale !== locale) return false;
    if (!includeArchived && post.group === "archives") return false;
    return true;
  });

  // Load full post data in batches to avoid EMFILE
  const posts = await processInBatches(
    filteredMetadata,
    (post) => getPostData(post.filePath)
  );

  // Finally filter by category
  return posts.filter((post) => post.categories.includes(category));
};

/**
 * Get archived posts for a specific category and locale
 */
export const fetchArchivedCategoryPosts = async (category: Category, locale: Locale = 'zh') => {
  return fetchCategoryPosts(category, locale, true).then(
    (posts) => posts.filter((post) => post.archived)
  );
};

/**
 * Get all posts for a specific locale (includes all posts by default)
 */
export async function getPostsByLocale(locale: Locale, includeArchived: boolean = false): Promise<PostData[]> {
  const allPostMetadata = await getSingletonPostMetadata();

  // Filter by locale and archived status before loading full post data
  const filteredMetadata = Object.values(allPostMetadata).filter((post) => {
    const filename = path.basename(post.filePath);
    const postLocale = extractLocaleFromFilename(filename);
    if (postLocale !== locale) return false;
    if (!includeArchived && post.group === "archives") return false;
    return true;
  });

  // Load full post data in batches to avoid EMFILE
  return processInBatches(
    filteredMetadata,
    (post) => getPostData(post.filePath)
  );
}

/**
 * Get only archived posts for a specific locale
 */
export async function getArchivedPostsByLocale(locale: Locale): Promise<PostData[]> {
  const allPostMetadata = await getSingletonPostMetadata();

  // Filter by locale and archived status
  const archivedMetadata = Object.values(allPostMetadata).filter((post) => {
    const filename = path.basename(post.filePath);
    const postLocale = extractLocaleFromFilename(filename);
    return postLocale === locale && post.group === "archives";
  });

  // Load full post data in batches to avoid EMFILE
  return processInBatches(
    archivedMetadata,
    (post) => getPostData(post.filePath)
  );
}

/**
 * Get the count of non-archived posts for a specific locale
 */
export async function getPostCountByLocale(locale: Locale): Promise<number> {
  const posts = await getPostsByLocale(locale);
  return posts.length;
}

/**
 * Get the count of non-archived posts for a specific category and locale
 */
export async function getPostCountByCategoryAndLocale(
  category: Category,
  locale: Locale
): Promise<number> {
  const posts = await fetchCategoryPosts(category, locale);
  return posts.length;
}
