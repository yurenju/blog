import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { resolveCover } from './images/cover';
import type { Locale } from './i18n';
import { inferLocaleFromFilename, computeAvailableLocales } from './locale-helpers';
import { parseWorkPathSegments } from './works-path';

export { parseWorkPathSegments };

export type WorkEntry = CollectionEntry<'works'>;

export interface WorkMeta {
  entry: WorkEntry;
  slug: string;
  title: string;
  date: Date;
  description?: string;
  cover: ImageMetadata | null;
  demoUrl?: string;
  repoUrl?: string;
  tags: string[];
  locale: Locale;
  availableLocales: Locale[];
}

function dirnameFromEntry(entry: WorkEntry): string {
  return parseWorkPathSegments(entry)?.dirname ?? '';
}

async function toMeta(entry: WorkEntry): Promise<WorkMeta | null> {
  const parsed = parseWorkPathSegments(entry);
  if (!parsed) {
    console.warn(`[works] Skipping entry with unparseable path: ${entry.id}`);
    return null;
  }
  const { dirname, filename } = parsed;
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
      console.warn(`[works] Skipping entry with no derivable date: ${entry.id}`);
      return null;
    }
    date = new Date(dateMatch[1]!);
  }

  const cover = await resolveCover(entry);
  const data = entry.data as {
    description?: string;
    demo_url?: string;
    repo_url?: string;
    tags?: string[];
  };

  return {
    entry,
    slug,
    title,
    date,
    description: data.description,
    cover,
    demoUrl: data.demo_url,
    repoUrl: data.repo_url,
    tags: data.tags ?? [],
    locale,
    availableLocales: [locale],
  };
}

export async function getAllWorks(): Promise<WorkMeta[]> {
  const entries = await getCollection('works');
  const resolved = await Promise.all(entries.map(toMeta));
  const sorted = resolved
    .filter((w): w is WorkMeta => w !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // availableLocales: group by dirname (no `group` layer for works).
  const rows = sorted.map((w) => ({
    group: 'works',
    dirname: dirnameFromEntry(w.entry),
    locale: w.locale,
  }));
  const localeMap = computeAvailableLocales(rows);
  for (const w of sorted) {
    const key = `works::${dirnameFromEntry(w.entry)}`;
    w.availableLocales = localeMap.get(key) ?? [w.locale];
  }

  // Translations inherit slug / tags / demo_url / repo_url from zh sibling.
  const zhByDir = new Map<string, WorkMeta>();
  for (const w of sorted) {
    if (w.locale === 'zh') zhByDir.set(dirnameFromEntry(w.entry), w);
  }
  for (const w of sorted) {
    if (w.locale === 'zh') continue;
    const zh = zhByDir.get(dirnameFromEntry(w.entry));
    if (!zh) continue;
    if (!w.entry.data.slug) w.slug = zh.slug;
    if (w.tags.length === 0) w.tags = zh.tags;
    if (!w.demoUrl) w.demoUrl = zh.demoUrl;
    if (!w.repoUrl) w.repoUrl = zh.repoUrl;
    if (!w.cover) w.cover = zh.cover;
  }

  // Slug uniqueness assertion per locale.
  const seen = new Map<string, string>();
  for (const w of sorted) {
    const key = `${w.locale}::${w.slug}`;
    const prev = seen.get(key);
    if (prev) {
      throw new Error(
        `[works] Duplicate (locale=${w.locale}, slug="${w.slug}") in entries: ${prev} and ${w.entry.id}`,
      );
    }
    seen.set(key, w.entry.id);
  }

  return sorted;
}

export async function getWorksByLocale(locale: Locale): Promise<WorkMeta[]> {
  return (await getAllWorks()).filter((w) => w.locale === locale);
}

export async function getWorkBySlug(
  locale: Locale,
  slug: string,
): Promise<WorkMeta | null> {
  const all = await getAllWorks();
  return all.find((w) => w.locale === locale && w.slug === slug) ?? null;
}
