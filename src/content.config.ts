import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    // Phase 2: include translations (index.ja.md, index.en.md).
    pattern: ['**/*.md'],
    base: './src/content/posts',
  }),
  schema: z
    .object({
      slug: z.string().optional(),
      title: z.string().optional(),
      date: z.coerce.date().optional(),
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
