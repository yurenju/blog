import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { resolveCover } from './images/cover';
import { LOCALES, type Locale } from './i18n';

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
  cover: ImageMetadata | null;
  locale: Locale;
  availableLocales: Locale[];
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

/**
 * Infer post locale from the source filename (without extension).
 * `index.ja` -> ja, `index.en` -> en, anything else -> zh.
 */
export function inferLocaleFromFilename(filename: string): Locale {
  if (filename === 'index.ja') return 'ja';
  if (filename === 'index.en') return 'en';
  return 'zh';
}

/**
 * Group rows by `${group}::${dirname}` and produce the sorted locale list per group.
 * Locales are sorted to follow LOCALES order (zh, ja, en) so the output is stable.
 */
export function computeAvailableLocales(
  rows: { group: string; dirname: string; locale: Locale }[],
): Map<string, Locale[]> {
  const sets = new Map<string, Set<Locale>>();
  for (const row of rows) {
    const key = `${row.group}::${row.dirname}`;
    let set = sets.get(key);
    if (!set) {
      set = new Set();
      sets.set(key, set);
    }
    set.add(row.locale);
  }
  const result = new Map<string, Locale[]>();
  for (const [key, set] of sets) {
    result.set(key, LOCALES.filter((l) => set.has(l)));
  }
  return result;
}

/**
 * Derive PostMeta from a Content Collection entry.
 *
 * Posts use one of two conventions:
 *   - Old (2024 and earlier): `<group>/<dirname>/index.md` with full frontmatter (title, date, slug).
 *   - New (2025+, Bear/Obsidian export): `<group>/<dirname>/<title>.md` with minimal frontmatter
 *     (slug, categories) — title is the filename, date is the YYYY-MM-DD prefix of dirname.
 *
 * URL slug follows the Next.js prod conventions: prefer frontmatter slug (English-friendly)
 * over directory name; lowercase and strip spaces.
 */
/**
 * Parse `<group>/<dirname>/<filename>` segments from the post's source file path.
 *
 * Astro's glob loader on Windows occasionally falls back to using `entry.id` as the
 * frontmatter slug (single segment) for paths containing special chars like `[` or `?`.
 * `entry.filePath` is the project-relative source path and remains accurate, so we prefer it.
 */
function parsePathSegments(entry: PostEntry):
  | { group: string; dirname: string; filename: string }
  | null {
  // Posix-normalize the project-relative filePath then locate the loader base prefix.
  const fp = entry.filePath?.replaceAll('\\', '/');
  if (fp) {
    const marker = 'src/content/posts/';
    const i = fp.lastIndexOf(marker);
    if (i >= 0) {
      const rel = fp.slice(i + marker.length).replace(/\.md$/, '');
      const segs = rel.split('/');
      if (segs.length >= 3) {
        return {
          group: segs[0]!,
          dirname: segs[1]!,
          filename: segs[segs.length - 1]!,
        };
      }
    }
  }
  // Fallback to entry.id (used when filePath is unavailable or non-conforming).
  const segs = entry.id.split('/');
  if (segs.length >= 3) {
    return {
      group: segs[0]!,
      dirname: segs[1]!,
      filename: segs[segs.length - 1]!,
    };
  }
  return null;
}

/**
 * Re-derive dirname from an entry, used for grouping translations of the same post.
 */
function dirnameFromEntry(entry: PostEntry): string {
  return parsePathSegments(entry)?.dirname ?? '';
}

async function toMeta(entry: PostEntry): Promise<PostMeta | null> {
  const parsed = parsePathSegments(entry);
  if (!parsed) {
    console.warn(`[posts] Skipping entry with unparseable path: ${entry.id}`);
    return null;
  }
  const { group, dirname, filename } = parsed;
  const locale = inferLocaleFromFilename(filename);

  const rawSlug = entry.data.slug ?? dirname;
  const slug = rawSlug.replaceAll(' ', '').toLowerCase();

  const title = entry.data.title ?? filename;

  let date: Date;
  if (entry.data.date) {
    date = entry.data.date;
  } else {
    const dateMatch = dirname.match(/^(\d{4}-\d{2}-\d{2})_/);
    if (!dateMatch) {
      console.warn(`[posts] Skipping entry with no derivable date: ${entry.id}`);
      return null;
    }
    date = new Date(dateMatch[1]!);
  }

  const cover = await resolveCover(entry);

  return {
    entry,
    slug,
    group,
    archived: group === 'archives',
    category: resolveCategory(entry.data),
    title,
    date,
    description: entry.data.description,
    cover,
    locale,
    availableLocales: [locale],
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const entries = await getCollection('posts');
  const resolved = await Promise.all(entries.map(toMeta));
  const sorted = resolved
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Compute availableLocales by (group, dirname).
  const rows = sorted.map((p) => ({
    group: p.group,
    dirname: dirnameFromEntry(p.entry),
    locale: p.locale,
  }));
  const localeMap = computeAvailableLocales(rows);
  for (const p of sorted) {
    const key = `${p.group}::${dirnameFromEntry(p.entry)}`;
    p.availableLocales = localeMap.get(key) ?? [p.locale];
  }

  // Slug uniqueness assertion: (locale, slug) pairs must be unique.
  const seen = new Map<string, string>();
  for (const post of sorted) {
    const key = `${post.locale}::${post.slug}`;
    const prev = seen.get(key);
    if (prev) {
      throw new Error(
        `[posts] Duplicate (locale=${post.locale}, slug="${post.slug}") in entries: ${prev} and ${post.entry.id}`,
      );
    }
    seen.set(key, post.entry.id);
  }

  return sorted;
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
