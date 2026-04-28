/**
 * Strip URL fragments from local image references in markdown posts.
 *
 * Bear (the markdown editor) embeds layout hints as URL fragments such as
 * `images/1.jpg#layoutTextWidth`. The blog renderer ignores them, so they're
 * dead weight from migration. This script removes the `#fragment` suffix
 * from image references in markdown image syntax and HTML <img src>.
 *
 * Only local references (no protocol, no `//` prefix) are touched, to avoid
 * breaking real anchor links to external pages.
 *
 * Usage:
 *   npx tsx scripts/strip-image-fragments.ts            # report only
 *   npx tsx scripts/strip-image-fragments.ts --apply    # write changes
 */

import fs from "node:fs/promises";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "public", "posts");
const APPLY = process.argv.includes("--apply");

const IMG_EXT = "(?:jpg|jpeg|png|gif|webp|avif|svg)";

// Markdown image: ![alt](path.ext#frag)  -> ![alt](path.ext)
// Group 1: everything before `#`, Group 2: dropped fragment
const MD_IMAGE_RE = new RegExp(
  String.raw`(!\[[^\]]*\]\()([^)\s]+\.${IMG_EXT})#[^)\s]*(\)|\s+"[^"]*"\))`,
  "gi",
);

// HTML <img src="path.ext#frag" ...>
const HTML_IMG_RE = new RegExp(
  String.raw`(<img\b[^>]*\bsrc=["'])([^"'\s]+\.${IMG_EXT})#[^"']*(["'])`,
  "gi",
);

/**
 * Skip references that look like external URLs (with protocol or `//` prefix)
 * by checking the captured path. We let through anything that starts with
 * `/`, `./`, `../`, `images/`, `assets/`, or a bare filename.
 */
function isLocalPath(p: string): boolean {
  return !/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(p);
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile() && /\.md$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  const files = await walk(POSTS_DIR);
  let totalReplacements = 0;
  let filesTouched = 0;

  for (const file of files) {
    const original = await fs.readFile(file, "utf8");
    let count = 0;

    let updated = original.replace(MD_IMAGE_RE, (full, prefix, p, suffix) => {
      if (!isLocalPath(p)) return full;
      count += 1;
      return `${prefix}${p}${suffix}`;
    });

    updated = updated.replace(HTML_IMG_RE, (full, prefix, p, quote) => {
      if (!isLocalPath(p)) return full;
      count += 1;
      return `${prefix}${p}${quote}`;
    });

    if (count > 0) {
      filesTouched += 1;
      totalReplacements += count;
      const rel = path.relative(process.cwd(), file);
      console.log(`  ${rel}: ${count} fragment(s)`);
      if (APPLY) await fs.writeFile(file, updated, "utf8");
    }
  }

  console.log(
    `\n${APPLY ? "Removed" : "Would remove"} ${totalReplacements} fragment(s) across ${filesTouched} file(s).`,
  );
  if (!APPLY) console.log("Dry-run only. Pass --apply to write changes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
