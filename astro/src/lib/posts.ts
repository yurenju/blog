import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export interface PostMeta {
  entry: PostEntry;
  slug: string;
  group: string;
  archived: boolean;
  category: 'tech' | 'life';
  title: string;
  date: Date;
  description?: string;
}

/**
 * Resolve category from frontmatter.
 * Posts may use "categories" (array) or "category" (string).
 * Falls back to 'tech' if neither is present or the value is unrecognised.
 */
function resolveCategory(data: PostEntry['data']): 'tech' | 'life' {
  const raw = data as Record<string, unknown>;

  // Prefer the "categories" array field used by most posts
  if (Array.isArray(raw['categories']) && raw['categories'].length > 0) {
    const first = String(raw['categories'][0]).toLowerCase();
    if (first === 'life') return 'life';
    return 'tech';
  }

  // Fall back to the "category" string field (spec default)
  if (typeof raw['category'] === 'string') {
    const c = raw['category'].toLowerCase();
    if (c === 'life') return 'life';
    return 'tech';
  }

  return 'tech';
}

function toMeta(entry: PostEntry): PostMeta {
  // entry.id looks like "2024/2024-01-01_title/index" or "archives/foo/index"
  const segments = entry.id.split('/');
  const group = segments[0] ?? '';
  const slug = segments[1] ?? entry.id;
  return {
    entry,
    slug,
    group,
    archived: group === 'archives',
    category: resolveCategory(entry.data),
    title: entry.data.title,
    date: entry.data.date,
    description: entry.data.description,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const entries = await getCollection('posts');
  return entries
    .map(toMeta)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getActivePosts(): Promise<PostMeta[]> {
  return (await getAllPosts()).filter((p) => !p.archived);
}

export async function getPostsByCategory(
  category: 'tech' | 'life',
): Promise<PostMeta[]> {
  return (await getActivePosts()).filter((p) => p.category === category);
}

export async function getArchivedPosts(): Promise<PostMeta[]> {
  return (await getAllPosts()).filter((p) => p.archived);
}

export function groupByYear(posts: PostMeta[]): Map<number, PostMeta[]> {
  const map = new Map<number, PostMeta[]>();
  for (const post of posts) {
    const year = post.date.getFullYear();
    const list = map.get(year) ?? [];
    list.push(post);
    map.set(year, list);
  }
  return map;
}

export async function getPostBySlug(slug: string): Promise<PostMeta | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
