import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "public/posts");

interface PostInfo {
  slug: string;
  title: string;
  date: string;
  category: string;
  path: string;
}

function getAllLifePosts(): PostInfo[] {
  const slugs = fs.readdirSync(POSTS_DIR);
  const lifePosts: PostInfo[] = [];

  for (const slug of slugs) {
    const postDir = path.join(POSTS_DIR, slug);

    if (!fs.statSync(postDir).isDirectory()) {
      continue;
    }

    // Find the main .md file in the directory
    // Priority: index.md > non-index files that don't start with "index." > any .md file
    const files = fs.readdirSync(postDir);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    // Find the main content file (not translation files like index.en.md, index.ja.md)
    let mdFile: string | undefined = mdFiles.find((f) => f === "index.md");
    if (!mdFile) {
      // Look for non-index .md files (e.g., "集點卡與歸屬感.md")
      mdFile = mdFiles.find((f) => !f.startsWith("index."));
    }
    if (!mdFile) {
      // Fallback to any .md file
      mdFile = mdFiles[0];
    }

    if (!mdFile) {
      continue;
    }

    const filePath = path.join(postDir, mdFile);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    // Check both "category" (string) and "categories" (array)
    let isLife = false;
    if (data.categories && Array.isArray(data.categories)) {
      isLife = data.categories.includes("life");
    } else if (data.category) {
      isLife = data.category === "life";
    }

    if (isLife) {
      // Extract title from filename (without .md) or frontmatter
      const title = data.title || mdFile.replace(".md", "");
      // Ensure date is a string
      let date = slug.substring(0, 10);
      if (data.date) {
        date =
          typeof data.date === "string"
            ? data.date
            : data.date.toISOString().substring(0, 10);
      }
      lifePosts.push({
        slug,
        title,
        date,
        category: "life",
        path: `public/posts/${slug}/${mdFile}`,
      });
    }
  }

  // Sort by date descending
  lifePosts.sort((a, b) => b.date.localeCompare(a.date));

  return lifePosts;
}

const lifePosts = getAllLifePosts();

console.log(`\n=== Life 類文章統計 ===\n`);
console.log(`總數: ${lifePosts.length} 篇\n`);

// Group by year
const byYear = new Map<string, PostInfo[]>();
for (const post of lifePosts) {
  const year = post.date.substring(0, 4);
  if (!byYear.has(year)) {
    byYear.set(year, []);
  }
  byYear.get(year)!.push(post);
}

// Print by year
const years = Array.from(byYear.keys()).sort((a, b) => b.localeCompare(a));
for (const year of years) {
  const posts = byYear.get(year)!;
  console.log(`\n### ${year} 年 (${posts.length} 篇)`);
  for (const post of posts) {
    console.log(`- ${post.date}: ${post.title} (${post.path})`);
  }
}
