/**
 * Scan all images under public/posts and detect broken ones.
 *
 * Broken means:
 *  - File content is HTML (e.g. a 404 page saved with an image extension)
 *  - File magic bytes don't match its extension
 *  - sharp() cannot decode the image
 *
 * For each broken image, references in sibling index*.md files are removed
 * (markdown image syntax and HTML <img> tags). SVG files are skipped because
 * many legitimate SVGs start with `<` and aren't bitmaps.
 *
 * Usage:
 *   npx tsx scripts/check-broken-images.ts                 # dry-run report
 *   npx tsx scripts/check-broken-images.ts --apply         # rewrite markdown
 *   npx tsx scripts/check-broken-images.ts --apply --delete-files
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const POSTS_DIR = path.join(process.cwd(), "public", "posts");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

type BrokenReason = "html-content" | "magic-mismatch" | "decode-failed" | "empty";

interface BrokenImage {
  absPath: string;
  postDir: string;
  filename: string;
  reason: BrokenReason;
  detail?: string;
}

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const DELETE_FILES = args.has("--delete-files");

async function walkImages(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkImages(full)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTS.has(ext)) out.push(full);
    }
  }
  return out;
}

function detectMagicMismatch(ext: string, head: Buffer): BrokenReason | null {
  // Detect HTML disguised as image
  const text = head.slice(0, 512).toString("utf8").trimStart().toLowerCase();
  if (
    text.startsWith("<!doctype html") ||
    text.startsWith("<html") ||
    text.startsWith("<head") ||
    text.startsWith("<body")
  ) {
    return "html-content";
  }

  if (head.length === 0) return "empty";

  const isPNG = head.length >= 8 && head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const isJPEG = head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isGIF = head.length >= 6 && head.slice(0, 6).toString("ascii").match(/^GIF8[79]a$/) !== null;
  const isWEBP =
    head.length >= 12 &&
    head.slice(0, 4).toString("ascii") === "RIFF" &&
    head.slice(8, 12).toString("ascii") === "WEBP";
  // AVIF: bytes 4..8 are "ftyp", brand at 8..12 is "avif"/"avis"/"mif1"/"heic"...
  const isAVIF =
    head.length >= 12 &&
    head.slice(4, 8).toString("ascii") === "ftyp" &&
    ["avif", "avis", "mif1", "heic", "heix"].includes(head.slice(8, 12).toString("ascii"));

  switch (ext) {
    case ".png":
      return isPNG ? null : "magic-mismatch";
    case ".jpg":
    case ".jpeg":
      return isJPEG ? null : "magic-mismatch";
    case ".gif":
      return isGIF ? null : "magic-mismatch";
    case ".webp":
      return isWEBP ? null : "magic-mismatch";
    case ".avif":
      return isAVIF ? null : "magic-mismatch";
    default:
      return null;
  }
}

async function checkImage(absPath: string): Promise<BrokenImage | null> {
  const ext = path.extname(absPath).toLowerCase();
  const stat = await fs.stat(absPath);
  if (stat.size === 0) {
    return { absPath, postDir: path.dirname(absPath), filename: path.basename(absPath), reason: "empty" };
  }

  const fh = await fs.open(absPath, "r");
  let head: Buffer;
  try {
    head = Buffer.alloc(Math.min(1024, stat.size));
    await fh.read(head, 0, head.length, 0);
  } finally {
    await fh.close();
  }

  const magicReason = detectMagicMismatch(ext, head);
  if (magicReason) {
    return {
      absPath,
      postDir: path.dirname(absPath),
      filename: path.basename(absPath),
      reason: magicReason,
    };
  }

  // Final guard: ask sharp to actually decode metadata
  try {
    const meta = await sharp(absPath, { failOn: "error" }).metadata();
    if (!meta.width || !meta.height) {
      return {
        absPath,
        postDir: path.dirname(absPath),
        filename: path.basename(absPath),
        reason: "decode-failed",
        detail: "no dimensions",
      };
    }
  } catch (err) {
    return {
      absPath,
      postDir: path.dirname(absPath),
      filename: path.basename(absPath),
      reason: "decode-failed",
      detail: (err as Error).message,
    };
  }

  return null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Remove references to a given image filename from markdown text.
 * Handles markdown image syntax and HTML <img> tags. References are matched
 * by basename so relative paths like "./foo.png" or "foo.png" both match.
 */
function stripImageReferences(md: string, filename: string): { result: string; count: number } {
  const escaped = escapeRegex(filename);
  // Filename must be preceded by `/` or `(` so we don't substring-match (e.g. 1.jpg vs 11.jpg).
  // After filename, optional #fragment or ?query (no whitespace, no `)`), optional title.
  let count = 0;

  // Markdown link wrapping an image where the link target is the broken file:
  //   [![alt](thumbUrl)](broken.jpg)  ->  ![alt](thumbUrl)
  const linkWrappedImageRe = new RegExp(
    String.raw`\[(!\[[^\]]*\]\([^)]*\))\]\([^)]*[/(]${escaped}(?:[#?][^)\s]*)?(?:\s+"[^"]*")?\)`,
    "g",
  );
  md = md.replace(linkWrappedImageRe, (_m, inner) => {
    count += 1;
    return inner;
  });

  // Plain markdown link [text](broken.jpg) -> text
  const linkPlainRe = new RegExp(
    String.raw`\[([^\]\n]+)\]\([^)]*[/(]${escaped}(?:[#?][^)\s]*)?(?:\s+"[^"]*")?\)`,
    "g",
  );
  md = md.replace(linkPlainRe, (_m, inner) => {
    count += 1;
    return inner;
  });

  // Markdown image whole-line variant
  const mdImageLineRe = new RegExp(
    String.raw`^[ \t]*!\[[^\]]*\]\([^)]*[/(]${escaped}(?:[#?][^)\s]*)?(?:\s+"[^"]*")?\)[ \t]*\r?\n?`,
    "gm",
  );
  md = md.replace(mdImageLineRe, () => {
    count += 1;
    return "";
  });

  // Markdown image inline variant
  const mdImageInlineRe = new RegExp(
    String.raw`!\[[^\]]*\]\([^)]*[/(]${escaped}(?:[#?][^)\s]*)?(?:\s+"[^"]*")?\)`,
    "g",
  );
  md = md.replace(mdImageInlineRe, () => {
    count += 1;
    return "";
  });

  // HTML <img>
  const htmlImgLineRe = new RegExp(
    String.raw`^[ \t]*<img\b[^>]*src=["'][^"']*[/"']${escaped}(?:[#?][^"']*)?["'][^>]*/?>[ \t]*\r?\n?`,
    "gim",
  );
  md = md.replace(htmlImgLineRe, () => {
    count += 1;
    return "";
  });

  const htmlImgInlineRe = new RegExp(
    String.raw`<img\b[^>]*src=["'][^"']*[/"']${escaped}(?:[#?][^"']*)?["'][^>]*/?>`,
    "gi",
  );
  md = md.replace(htmlImgInlineRe, () => {
    count += 1;
    return "";
  });

  // Frontmatter image list entries: lines like `  - "/path/to/<filename>"` or `  - /path/<filename>`
  const frontmatterListRe = new RegExp(
    String.raw`^[ \t]*-[ \t]+["']?[^"'\n]*[/]${escaped}(?:[#?][^"'\n]*)?["']?[ \t]*\r?\n`,
    "gm",
  );
  md = md.replace(frontmatterListRe, () => {
    count += 1;
    return "";
  });

  // Frontmatter scalar field: `cover: "/path/<filename>"` -> remove whole line
  const frontmatterScalarRe = new RegExp(
    String.raw`^[ \t]*[A-Za-z_][\w-]*:[ \t]*["']?[^"'\n]*[/]${escaped}(?:[#?][^"'\n]*)?["']?[ \t]*\r?\n`,
    "gm",
  );
  md = md.replace(frontmatterScalarRe, () => {
    count += 1;
    return "";
  });

  // Collapse runs of 3+ blank lines left behind in body
  md = md.replace(/\n{3,}/g, "\n\n");

  return { result: md, count };
}

/**
 * Find the post root for an image: walk up from the image's directory until
 * we find a directory containing index*.md. Returns the markdown file paths.
 */
async function findMarkdownFiles(imageDir: string): Promise<string[]> {
  let dir = imageDir;
  // Don't walk above POSTS_DIR
  while (dir.startsWith(POSTS_DIR)) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const mdFiles = entries
      .filter((e) => e.isFile() && /^index(\.[a-z-]+)?\.md$/i.test(e.name))
      .map((e) => path.join(dir, e.name));
    if (mdFiles.length > 0) return mdFiles;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return [];
}

async function main() {
  console.log(`Scanning images under ${POSTS_DIR}...`);
  const images = await walkImages(POSTS_DIR);
  console.log(`Found ${images.length} image files. Checking...`);

  const broken: BrokenImage[] = [];
  let checked = 0;
  const concurrency = 16;
  for (let i = 0; i < images.length; i += concurrency) {
    const batch = images.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(checkImage));
    for (const r of results) if (r) broken.push(r);
    checked += batch.length;
    if (checked % 200 === 0 || checked === images.length) {
      process.stdout.write(`  checked ${checked}/${images.length}\r`);
    }
  }
  console.log("");

  if (broken.length === 0) {
    console.log("No broken images found.");
    return;
  }

  console.log(`\nBroken images (${broken.length}):`);
  for (const b of broken) {
    const rel = path.relative(process.cwd(), b.absPath);
    console.log(`  [${b.reason}] ${rel}${b.detail ? ` -- ${b.detail}` : ""}`);
  }

  // Group by post directory and rewrite markdown
  const byPostDir = new Map<string, BrokenImage[]>();
  for (const b of broken) {
    if (!byPostDir.has(b.postDir)) byPostDir.set(b.postDir, []);
    byPostDir.get(b.postDir)!.push(b);
  }

  console.log(APPLY ? "\nApplying changes..." : "\nDry-run (use --apply to write changes):");

  let totalRefRemovals = 0;
  let totalFilesEdited = 0;
  for (const [imageDir, items] of byPostDir) {
    const mdFiles = await findMarkdownFiles(imageDir);
    if (mdFiles.length === 0) {
      console.log(`  (no markdown found near ${path.relative(process.cwd(), imageDir)})`);
      continue;
    }
    for (const mdFile of mdFiles) {
      const original = await fs.readFile(mdFile, "utf8");
      let updated = original;
      let perFileCount = 0;
      for (const item of items) {
        const { result, count } = stripImageReferences(updated, item.filename);
        updated = result;
        perFileCount += count;
      }
      if (perFileCount > 0) {
        const rel = path.relative(process.cwd(), mdFile);
        console.log(`  ${rel}: would remove ${perFileCount} reference(s)`);
        totalRefRemovals += perFileCount;
        totalFilesEdited += 1;
        if (APPLY) await fs.writeFile(mdFile, updated, "utf8");
      }
    }
  }

  console.log(
    `\nReferences removed: ${totalRefRemovals} across ${totalFilesEdited} markdown file(s).`,
  );

  if (DELETE_FILES) {
    if (!APPLY) {
      console.log("\n--delete-files requires --apply; skipping file deletion.");
    } else {
      console.log("\nDeleting broken image files...");
      for (const b of broken) {
        await fs.unlink(b.absPath);
        console.log(`  deleted ${path.relative(process.cwd(), b.absPath)}`);
      }
    }
  } else {
    console.log("\nBroken image files were NOT deleted (pass --delete-files with --apply to remove).");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
