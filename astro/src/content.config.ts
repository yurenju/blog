import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    // Match all primary post markdown files: either `index.md` or a Chinese-titled `<title>.md`.
    // Exclude `index.en.md` / `index.ja.md` translation siblings (POC is zh-only).
    pattern: ['**/*.md', '!**/index.en.md', '!**/index.ja.md'],
    base: '../public/posts',
  }),
  schema: z
    .object({
      // Some posts omit title/date/slug in frontmatter and rely on directory/file naming.
      // Defaults are derived in lib/posts.ts toMeta() following Next.js conventions.
      slug: z.string().optional(),
      title: z.string().optional(),
      date: z.coerce.date().optional(),
      // Posts use "categories" (array) rather than "category" (string).
      // We accept both formats and normalize in lib/posts.ts.
      categories: z
        .union([z.array(z.string()), z.string()])
        .optional(),
      category: z.enum(['tech', 'life']).default('tech'),
      description: z.string().optional(),
      cover: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { posts };
