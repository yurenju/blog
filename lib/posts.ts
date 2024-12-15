import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

  const date = matterResult.data.date
    ? new Date(matterResult.data.date).toISOString()
    : "未知日期";

  return {
    slug,
    title: matterResult.data.title || "無標題",
    date,
    contentHtml: matterResult.content,
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
