/**
 * Parse `<dirname>/<filename>` from a works entry's source file path.
 *
 * Works live directly under `src/content/works/`, so the relative path has
 * only two segments (no `<group>` level like posts have).
 *
 * Kept in a separate module from `works.ts` so unit tests can import this
 * pure helper without pulling in the `astro:content` virtual module.
 */
export function parseWorkPathSegments(entry: {
  filePath?: string;
  id: string;
}): { dirname: string; filename: string } | null {
  const fp = entry.filePath?.replaceAll('\\', '/');
  if (fp) {
    const marker = 'src/content/works/';
    const i = fp.lastIndexOf(marker);
    if (i >= 0) {
      const rel = fp.slice(i + marker.length).replace(/\.md$/, '');
      const segs = rel.split('/');
      if (segs.length >= 2) {
        return { dirname: segs[0]!, filename: segs[segs.length - 1]! };
      }
    }
  }
  const segs = entry.id.split('/');
  if (segs.length >= 2) {
    return { dirname: segs[0]!, filename: segs[segs.length - 1]! };
  }
  return null;
}
