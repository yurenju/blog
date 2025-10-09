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

interface PostMetadata {
  slug: string;
  filePath: string;
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
  const entries = await fs.promises.readdir(postsDirectory, {
    withFileTypes: true,
  });
  const directories = entries.filter((entry) => entry.isDirectory());

  const posts: Record<string, PostMetadata> = {};

  await Promise.all(
    directories.map(async (directory) => {
      const dirPath = path.join(postsDirectory, directory.name);
      const files = await fs.promises.readdir(dirPath);
      const mdFiles = files.filter((file) => file.endsWith(".md"));

      if (mdFiles.length === 0) {
        throw new Error(`No markdown file found in directory: ${dirPath}`);
      }

      // Process all language versions in this directory
      for (const mdFile of mdFiles) {
        const fullPath = path.join(dirPath, mdFile);
        const fileContents = await fs.promises.readFile(fullPath, "utf8");
        const matterResult = matter(fileContents);

        const slug = encodeSlug(matterResult.data.slug || directory.name);
        const locale = extractLocaleFromFilename(mdFile);

        // Create a unique key for each language version
        const postKey = locale === 'zh' ? slug : `${slug}-${locale}`;

        posts[postKey] = {
          slug,
          filePath: fullPath,
        };
      }
    })
  );

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
};

export type Category = "shorts" | "life" | "tech";

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

export const fetchCategoryPosts = async (category: Category, locale: Locale = 'zh') => {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  return posts.filter((post) => post.categories.includes(category) && post.locale === locale);
};

/**
 * Get all posts for a specific locale
 */
export async function getPostsByLocale(locale: Locale): Promise<PostData[]> {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  return posts.filter((post) => post.locale === locale);
}

/**
 * Get the count of posts for a specific locale
 */
export async function getPostCountByLocale(locale: Locale): Promise<number> {
  const posts = await getPostsByLocale(locale);
  return posts.length;
}
