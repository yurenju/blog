import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { processMarkdownContent } from "./markdown";

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
      const mdFile = files.find((file) => file.endsWith(".md"));

      if (!mdFile) {
        throw new Error(`No markdown file found in directory: ${dirPath}`);
      }

      const fullPath = path.join(dirPath, mdFile);
      const fileContents = await fs.promises.readFile(fullPath, "utf8");
      const matterResult = matter(fileContents);

      const slug = encodeSlug(matterResult.data.slug || directory.name);

      posts[slug] = {
        slug,
        filePath: fullPath,
      };
    })
  );

  return posts;
}

export async function getPostData(filePath: string) {
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  const matterResult = matter(fileContents);

  const slug = encodeSlug(
    matterResult.data.slug || path.basename(path.dirname(filePath))
  );

  let date = matterResult.data.date
    ? new Date(matterResult.data.date).toISOString()
    : "未知日期";

  if (date === "未知日期") {
    const slugParts = slug.split("_");
    const potentialDate = slugParts[0];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateRegex.test(potentialDate)) {
      date = new Date(potentialDate).toISOString();
    }
  }

  const categories = matterResult.data.categories || [];

  const title =
    matterResult.data.title || path.basename(filePath, path.extname(filePath));

  const content = await processMarkdownContent(filePath, matterResult.content);

  return {
    slug,
    title,
    date,
    content,
    categories,
    filePath,
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

export const fetchCategoryPosts = async (category: string) => {
  const allPostMetadata = await getSingletonPostMetadata();
  const posts = await Promise.all(
    Object.values(allPostMetadata).map((post) => getPostData(post.filePath))
  );

  return posts.filter((post) => post.categories.includes(category));
};
