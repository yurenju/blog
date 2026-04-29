import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    // Match only the primary Chinese index.md files (exclude *.en.md, *.ja.md, etc.)
    pattern: '*/*/index.md',
    base: '../public/posts',
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
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
