import path from 'node:path';
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { buildIndex } from './find-in-entry-dir';

/**
 * Eager glob of all candidate cover images under content/posts.
 *
 * Keys are project-absolute paths (per Vite import.meta.glob convention).
 * Loaders return the processed ImageMetadata that <Image> expects.
 */
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/posts/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
);

const ALLOWED_EXT = /\.(png|jpe?g|webp)$/i;
const STANDARD_IMG = /!\[[^\]]*\]\(([^)\s]+)\)/g;
const WIKI_IMG = /!\[\[([^\]]+?)\]\]/g;

export type BodyImage =
  | { kind: 'rel'; path: string }
  | { kind: 'wiki'; name: string };

/**
 * Scan markdown body for the first image-like reference whose target ends in
 * an allowed bitmap extension (png/jpg/jpeg/webp). External URLs and
 * gif/svg/mp4 are skipped.
 */
export function findFirstBodyImage(body: string): BodyImage | null {
  const candidates: { idx: number; image: BodyImage }[] = [];

  STANDARD_IMG.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = STANDARD_IMG.exec(body)) !== null) {
    const url = m[1]!;
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('//') ||
      url.startsWith('/')
    ) {
      continue;
    }
    if (!ALLOWED_EXT.test(url)) continue;
    candidates.push({ idx: m.index, image: { kind: 'rel', path: url } });
  }

  WIKI_IMG.lastIndex = 0;
  while ((m = WIKI_IMG.exec(body)) !== null) {
    const name = m[1]!;
    if (!ALLOWED_EXT.test(name)) continue;
    candidates.push({ idx: m.index, image: { kind: 'wiki', name } });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.idx - b.idx);
  return candidates[0]!.image;
}

type PostEntry = CollectionEntry<'posts'>;

/**
 * Resolve a cover image for a post: prefer frontmatter `cover`, else scan body.
 *
 * Returns the processed ImageMetadata (with width/height/format) or null if
 * no candidate exists or the candidate file is not in the indexed glob.
 */
export async function resolveCover(
  entry: PostEntry,
): Promise<ImageMetadata | null> {
  const entryFilePath = entry.filePath;
  if (!entryFilePath) return null;

  // entry.filePath is project-relative, e.g. "src/content/posts/2025/foo/index.md".
  // Vite's import.meta.glob keys begin with "/" (project-absolute).
  const entryAbs = '/' + entryFilePath.replaceAll('\\', '/');
  const entryDir = path.posix.dirname(entryAbs);

  const tryLoad = async (absKey: string): Promise<ImageMetadata | null> => {
    const loader = imageModules[absKey];
    if (!loader) return null;
    const mod = await loader();
    return mod.default;
  };

  // 1. frontmatter cover (string path relative to entry directory)
  const frontCover = (entry.data as { cover?: string }).cover;
  if (frontCover) {
    const absKey = path.posix.join(entryDir, frontCover);
    const meta = await tryLoad(absKey);
    if (meta) return meta;
    console.warn(
      `[cover] frontmatter cover not found: ${frontCover} in ${entryFilePath}`,
    );
    // fall through to body scan
  }

  // 2. body scan
  const candidate = findFirstBodyImage(entry.body ?? '');
  if (!candidate) return null;

  if (candidate.kind === 'rel') {
    const absKey = path.posix.join(entryDir, candidate.path);
    return tryLoad(absKey);
  }

  // wiki: resolve via filesystem index, then map back to glob key
  // entryFilePath is project-relative; we need an OS-absolute path for buildIndex
  const projectRoot = process.cwd();
  const osEntryDir = path.join(projectRoot, path.dirname(entryFilePath));
  const fsIndex = buildIndex(osEntryDir);
  const osAbs = fsIndex.get(candidate.name);
  if (!osAbs) return null;

  const projectRel = path.relative(projectRoot, osAbs).replaceAll('\\', '/');
  const absKey = '/' + projectRel;
  return tryLoad(absKey);
}
