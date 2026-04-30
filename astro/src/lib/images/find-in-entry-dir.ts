import fs from 'node:fs';
import path from 'node:path';

/**
 * Build a flat filename → absolute path index by recursively scanning `dir`.
 *
 * Used by obsidian-remark and cover resolver to look up `![[name]]` references
 * within a single post's directory tree. Filename comparison is case-sensitive
 * (matches actual fs entries) so Linux CI matches Windows local behavior.
 *
 * On filename collision (rare; same name in two subdirs of one post),
 * the depth-first first occurrence wins and a warning is emitted.
 */
export function buildIndex(dir: string): Map<string, string> {
  const index = new Map<string, string>();
  if (!fs.existsSync(dir)) return index;

  const walk = (current: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        if (index.has(entry.name)) {
          console.warn(
            `[find-in-entry-dir] Duplicate filename "${entry.name}" in ${dir}; ` +
              `keeping ${index.get(entry.name)}, skipping ${full}`,
          );
          continue;
        }
        index.set(entry.name, full);
      }
    }
  };

  walk(dir);
  return index;
}
