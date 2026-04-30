# Phase 1b 圖片 pipeline 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目標：** 把 Astro 端 corpus 的三種圖片語法（`![](images/...)`、`![[file]]`、frontmatter `cover`）接上 Astro image pipeline 產生 AVIF/WebP/srcset；保留 GIF/SVG/MP4 原檔；移除 Phase 0 的 `passthroughImageService` 與 `ignorePublicContentImages` Vite plugin。

**架構：** 三個 build-time 模組（`obsidian-remark.ts`、`cover.ts`、`passthrough.ts`）+ 一個共用 helper（`find-in-entry-dir.ts`）放在 `astro/src/lib/images/`。順序上先建好全部新基礎設施（每步 build 仍綠），最後一步才拔掉 POC workaround，讓 Astro 預設 sharp service 接管。

**Tech Stack：** Astro 6.2、unified/remark/rehype（Astro 內建）、`unist-util-visit`、`vitest`（新增 devDep，給 helper 與 plugin 單元測試）。

**對應 spec：** [docs/superpowers/specs/2026-04-30-phase-1b-image-pipeline-design.md](../specs/2026-04-30-phase-1b-image-pipeline-design.md)

---

## 檔案結構（建立 / 修改清單）

**建立：**
- `astro/src/lib/images/find-in-entry-dir.ts` — 共用檔案索引 helper
- `astro/src/lib/images/obsidian-remark.ts` — `![[]]` 語法 remark plugin
- `astro/src/lib/images/cover.ts` — cover 解析
- `astro/src/lib/images/passthrough.ts` — gif/svg/mp4 rehype plugin
- `astro/src/lib/images/__tests__/find-in-entry-dir.test.ts`
- `astro/src/lib/images/__tests__/obsidian-remark.test.ts`
- `astro/src/lib/images/__tests__/cover.test.ts`
- `astro/vitest.config.ts` — vitest 設定
- `astro/src/lib/images/__tests__/fixtures/` — 測試用最小 entry 目錄

**修改：**
- `astro/package.json` — 加 vitest devDep + `test` script + `unist-util-visit` dep
- `astro/src/content.config.ts` — schema 註解補充（cover 維持 `z.string().optional()`）
- `astro/src/lib/posts.ts` — `PostMeta` 加 `cover?: ImageMetadata`、`toMeta` 改 async
- `astro/src/components/PostList.astro` — 加 cover thumbnail 渲染（沒 cover 時 layout 不撐）
- `astro/astro.config.ts` — 註冊 remark/rehype plugin、最後一步移除 workaround

---

## Task 1: vitest 基礎設施

**Files:**
- Modify: `astro/package.json`
- Create: `astro/vitest.config.ts`

- [ ] **Step 1: 安裝 vitest 與 unist-util-visit**

```bash
cd astro
npm install --save-dev vitest @vitest/coverage-v8
npm install unist-util-visit
```

- [ ] **Step 2: 建立 `astro/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: 在 `astro/package.json` 的 `scripts` 加 test**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run"
}
```

- [ ] **Step 4: 驗證 vitest 可跑**

Run: `cd astro && npm test`
Expected: PASS（找不到測試檔，輸出 `No test files found` 但 exit 0）

- [ ] **Step 5: Commit**

```bash
git add astro/package.json astro/package-lock.json astro/vitest.config.ts
git commit -m "chore(astro): add vitest + unist-util-visit for Phase 1b"
```

---

## Task 2: `find-in-entry-dir` helper

**Files:**
- Create: `astro/src/lib/images/find-in-entry-dir.ts`
- Test: `astro/src/lib/images/__tests__/find-in-entry-dir.test.ts`
- Test fixtures: `astro/src/lib/images/__tests__/fixtures/post-a/`

- [ ] **Step 1: 建立 fixture 目錄**

```bash
mkdir -p astro/src/lib/images/__tests__/fixtures/post-a/images/sub
echo "" > astro/src/lib/images/__tests__/fixtures/post-a/index.md
echo "" > astro/src/lib/images/__tests__/fixtures/post-a/cover.jpg
echo "" > astro/src/lib/images/__tests__/fixtures/post-a/images/0.png
echo "" > astro/src/lib/images/__tests__/fixtures/post-a/images/sub/nested.gif
```

- [ ] **Step 2: 寫失敗測試 `find-in-entry-dir.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { buildIndex } from '../find-in-entry-dir';

const fixtureDir = path.resolve(__dirname, 'fixtures/post-a');

describe('buildIndex', () => {
  it('indexes files at the root of the entry directory', () => {
    const index = buildIndex(fixtureDir);
    expect(index.get('cover.jpg')).toBe(path.join(fixtureDir, 'cover.jpg'));
  });

  it('recursively indexes subdirectories', () => {
    const index = buildIndex(fixtureDir);
    expect(index.get('0.png')).toBe(path.join(fixtureDir, 'images', '0.png'));
    expect(index.get('nested.gif')).toBe(
      path.join(fixtureDir, 'images', 'sub', 'nested.gif'),
    );
  });

  it('preserves filename case (no lowercasing)', () => {
    const index = buildIndex(fixtureDir);
    // Map 沒有 'COVER.JPG' 大寫 key
    expect(index.get('COVER.JPG')).toBeUndefined();
  });

  it('returns empty map for non-existent directory', () => {
    const index = buildIndex(path.join(fixtureDir, 'nope'));
    expect(index.size).toBe(0);
  });
});
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `cd astro && npm test -- find-in-entry-dir`
Expected: FAIL — `Cannot find module '../find-in-entry-dir'`

- [ ] **Step 4: 實作 `find-in-entry-dir.ts`**

```ts
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
```

- [ ] **Step 5: 跑測試確認通過**

Run: `cd astro && npm test -- find-in-entry-dir`
Expected: PASS（4/4）

- [ ] **Step 6: Commit**

```bash
git add astro/src/lib/images/find-in-entry-dir.ts astro/src/lib/images/__tests__/
git commit -m "feat(astro): add find-in-entry-dir helper for image lookup"
```

---

## Task 3: `obsidian-remark` plugin

**Files:**
- Create: `astro/src/lib/images/obsidian-remark.ts`
- Test: `astro/src/lib/images/__tests__/obsidian-remark.test.ts`

- [ ] **Step 1: 寫失敗測試 `obsidian-remark.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { obsidianRemark } from '../obsidian-remark';

const fixtureDir = path.resolve(__dirname, 'fixtures/post-a');
const fixtureMd = path.join(fixtureDir, 'index.md');

async function process(src: string) {
  const file = await unified()
    .use(remarkParse)
    .use(obsidianRemark)
    .use(remarkStringify)
    .process({ value: src, path: fixtureMd });
  return String(file);
}

describe('obsidianRemark', () => {
  it('rewrites ![[name.ext]] to standard image syntax with relative path', async () => {
    const out = await process('See ![[0.png]] inline.');
    expect(out).toContain('![0.png](images/0.png)');
  });

  it('rewrites root-level files', async () => {
    const out = await process('![[cover.jpg]]');
    expect(out).toContain('![cover.jpg](cover.jpg)');
  });

  it('handles multiple wiki links in one paragraph', async () => {
    const out = await process('![[0.png]] and ![[cover.jpg]]');
    expect(out).toContain('![0.png](images/0.png)');
    expect(out).toContain('![cover.jpg](cover.jpg)');
  });

  it('warns and preserves text when file not found', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const out = await process('![[missing.png]] tail');
    expect(out).toContain('![[missing.png]]');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('not found: missing.png'),
    );
    warn.mockRestore();
  });

  it('leaves regular markdown images untouched', async () => {
    const out = await process('![alt](images/0.png)');
    expect(out).toContain('![alt](images/0.png)');
  });

  it('does nothing when vfile.path is missing', async () => {
    const file = await unified()
      .use(remarkParse)
      .use(obsidianRemark)
      .use(remarkStringify)
      .process('![[anything.png]]');
    expect(String(file)).toContain('![[anything.png]]');
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `cd astro && npm test -- obsidian-remark`
Expected: FAIL — `Cannot find module '../obsidian-remark'`

- [ ] **Step 3: 安裝 remark-stringify、remark-parse 給測試用**

```bash
cd astro
npm install --save-dev remark-parse remark-stringify
```

- [ ] **Step 4: 實作 `obsidian-remark.ts`**

```ts
import path from 'node:path';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, Image, PhrasingContent } from 'mdast';
import type { VFile } from 'vfile';
import { buildIndex } from './find-in-entry-dir';

const WIKI_LINK = /!\[\[([^\]]+?)\]\]/g;

/**
 * Remark plugin: converts Obsidian wiki-link images `![[name.ext]]` into
 * standard mdast image nodes with paths relative to the markdown file.
 *
 * After this plugin runs, Astro Content Collections' built-in asset
 * pipeline picks up the relative path and produces hashed/optimized URLs.
 *
 * Lookup is scoped to the markdown file's directory tree (recursive).
 * Missing files: warn and preserve the original text node.
 */
export const obsidianRemark: Plugin<[], Root> = () => {
  return (tree, file: VFile) => {
    const filePath = file.path;
    if (!filePath) return;

    const entryDir = path.dirname(filePath);
    let indexCache: Map<string, string> | null = null;
    const getIndex = () => indexCache ?? (indexCache = buildIndex(entryDir));

    visit(tree, 'text', (node: Text, index, parent) => {
      if (typeof index !== 'number' || !parent) return;
      if (!node.value.includes('![[')) return;

      const replacements: PhrasingContent[] = [];
      let lastEnd = 0;
      let m: RegExpExecArray | null;
      WIKI_LINK.lastIndex = 0;
      while ((m = WIKI_LINK.exec(node.value)) !== null) {
        const [match, name] = m;
        const matchStart = m.index;
        const matchEnd = matchStart + match.length;

        if (matchStart > lastEnd) {
          replacements.push({
            type: 'text',
            value: node.value.slice(lastEnd, matchStart),
          });
        }

        const abs = getIndex().get(name);
        if (abs) {
          const rel = path.relative(entryDir, abs).replaceAll('\\', '/');
          const img: Image = { type: 'image', url: rel, alt: name };
          replacements.push(img);
        } else {
          console.warn(`[obsidian-remark] not found: ${name} in ${filePath}`);
          replacements.push({ type: 'text', value: match });
        }
        lastEnd = matchEnd;
      }

      if (replacements.length === 0) return;

      if (lastEnd < node.value.length) {
        replacements.push({
          type: 'text',
          value: node.value.slice(lastEnd),
        });
      }

      parent.children.splice(index, 1, ...replacements);
      return index + replacements.length;
    });
  };
};
```

- [ ] **Step 5: 跑測試確認通過**

Run: `cd astro && npm test -- obsidian-remark`
Expected: PASS（6/6）

- [ ] **Step 6: 註冊 plugin 到 `astro.config.ts`**

把 `markdown.remarkPlugins` 加進 config（保留現有 workaround，不要動）：

```ts
import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';
import { obsidianRemark } from './src/lib/images/obsidian-remark';

// (ignorePublicContentImages 函式保留不動)

export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  vite: {
    plugins: [ignorePublicContentImages()],
  },
  markdown: {
    remarkPlugins: [obsidianRemark],
  },
  output: 'static',
  site: 'https://yurenju.blog',
  trailingSlash: 'ignore',
  fonts: [
    /* unchanged */
  ],
});
```

- [ ] **Step 7: 跑 build 確認沒回退**

Run: `cd astro && npm run build`
Expected: PASS — 1494 頁全綠（plugin rewrite 後仍由 `ignorePublicContentImages` 接走 import，build 行為不變）

- [ ] **Step 8: Commit**

```bash
git add astro/package.json astro/package-lock.json astro/src/lib/images/obsidian-remark.ts astro/src/lib/images/__tests__/obsidian-remark.test.ts astro/astro.config.ts
git commit -m "feat(astro): add obsidian-remark plugin for ![[ ]] syntax"
```

---

## Task 4: `cover.ts` + `PostMeta.cover` 整合

**Files:**
- Create: `astro/src/lib/images/cover.ts`
- Test: `astro/src/lib/images/__tests__/cover.test.ts`
- Modify: `astro/src/lib/posts.ts`

- [ ] **Step 1: 寫失敗測試 `cover.test.ts`（純函式 body-scan 部分，不測 import.meta.glob）**

```ts
import { describe, it, expect } from 'vitest';
import { findFirstBodyImage } from '../cover';

describe('findFirstBodyImage', () => {
  it('returns first ![](path) match with allowed extension', () => {
    const body = 'Intro\n\n![alt](images/foo.jpg)\n\nmore';
    expect(findFirstBodyImage(body)).toEqual({ kind: 'rel', path: 'images/foo.jpg' });
  });

  it('returns first ![[name]] match with allowed extension', () => {
    expect(findFirstBodyImage('![[foo.png]]')).toEqual({ kind: 'wiki', name: 'foo.png' });
  });

  it('skips gif/svg/mp4 and returns next allowed image', () => {
    const body = '![](a.gif)\n\n![](b.svg)\n\n![](c.jpg)';
    expect(findFirstBodyImage(body)).toEqual({ kind: 'rel', path: 'c.jpg' });
  });

  it('skips external URLs (http, https, //, leading /)', () => {
    const body = '![](https://x/a.jpg)\n\n![](/posts/b.jpg)\n\n![](c.jpg)';
    expect(findFirstBodyImage(body)).toEqual({ kind: 'rel', path: 'c.jpg' });
  });

  it('case-insensitive extension matching', () => {
    expect(findFirstBodyImage('![](a.JPG)')).toEqual({ kind: 'rel', path: 'a.JPG' });
  });

  it('returns null when no allowed image is found', () => {
    expect(findFirstBodyImage('No images here')).toBeNull();
    expect(findFirstBodyImage('![](a.gif)')).toBeNull();
  });

  it('returns the earlier of mixed wiki and standard syntax', () => {
    expect(findFirstBodyImage('![[a.png]] then ![](b.jpg)')).toEqual({
      kind: 'wiki',
      name: 'a.png',
    });
    expect(findFirstBodyImage('![](a.jpg) then ![[b.png]]')).toEqual({
      kind: 'rel',
      path: 'a.jpg',
    });
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `cd astro && npm test -- cover`
Expected: FAIL — module not found

- [ ] **Step 3: 實作 `cover.ts`**

```ts
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
```

- [ ] **Step 4: 跑測試確認 `findFirstBodyImage` 通過**

Run: `cd astro && npm test -- cover`
Expected: PASS（7/7）

- [ ] **Step 5: 整合 `PostMeta.cover` 到 `lib/posts.ts`**

修改 `astro/src/lib/posts.ts`：

頂部 import 新增：
```ts
import type { ImageMetadata } from 'astro';
import { resolveCover } from './images/cover';
```

`PostMeta` interface 加欄位：
```ts
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
}
```

`toMeta` 改 async 並寫入 cover：
```ts
async function toMeta(entry: PostEntry): Promise<PostMeta | null> {
  const parsed = parsePathSegments(entry);
  if (!parsed) {
    console.warn(`[posts] Skipping entry with unparseable path: ${entry.id}`);
    return null;
  }
  const { group, dirname, filename } = parsed;

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
  };
}
```

`getAllPosts` 改 `await Promise.all`：
```ts
export async function getAllPosts(): Promise<PostMeta[]> {
  const entries = await getCollection('posts');
  const resolved = await Promise.all(entries.map(toMeta));
  const sorted = resolved
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Slug uniqueness assertion: duplicates would silently collide on /zh/posts/<slug>.
  const seen = new Map<string, string>();
  for (const post of sorted) {
    const prev = seen.get(post.slug);
    if (prev) {
      throw new Error(
        `[posts] Duplicate slug "${post.slug}" in entries: ${prev} and ${post.entry.id}`,
      );
    }
    seen.set(post.slug, post.entry.id);
  }

  return sorted;
}
```

- [ ] **Step 6: `npm run check` 通過**

Run: `cd astro && npm run check`
Expected: PASS — TypeScript 無錯（注意：因為 workaround `passthroughImageService` 還在，cover 解出來的 ImageMetadata 仍有效，但實際 build 時對應 import 會被 stub。預期 build 會印 warn 但不掛）

- [ ] **Step 7: 跑 build 確認沒回退**

Run: `cd astro && npm run build`
Expected: PASS — 頁數仍 1494。可能多出 cover not found warns（Vite plugin stub 影響），這是預期內、最終 Task 7 拔掉 workaround 後消失。

- [ ] **Step 8: Commit**

```bash
git add astro/src/lib/images/cover.ts astro/src/lib/images/__tests__/cover.test.ts astro/src/lib/posts.ts
git commit -m "feat(astro): add cover resolver and PostMeta.cover field"
```

---

## Task 5: GIF/SVG/MP4 passthrough rehype plugin（含 spike）

**Files:**
- Create: `astro/src/lib/images/passthrough.ts`
- Modify: `astro/astro.config.ts`

- [ ] **Step 1: Spike — 確認 Astro 對 markdown 內 `.gif` 預設行為**

建立臨時測試檔 `astro/src/content/posts/_spike-gif/index.md`：
```markdown
---
slug: spike-gif
categories: [tech]
date: 2026-04-30
title: Spike GIF
---

![test](test.gif)
```

把任一現有 gif 複製成 `test.gif` 放進該目錄。

Run: `cd astro && npm run build`
觀察 `dist/zh/posts/spike-gif/index.html` 內 `<img>` src：
- 若已是 `.gif`（未轉 webp）→ Astro 預設不對 markdown 內 gif 做 transform，**不需 rehype plugin**，可大幅簡化
- 若被轉成 `.webp` → 需要 rehype plugin 攔截

寫下觀察結果並繼續。

**清理：** `rm -rf astro/src/content/posts/_spike-gif`

- [ ] **Step 2: 視 spike 結果分支**

**分支 A（Astro 不 transform gif）：** 跳過 Step 3-5，直接到 Step 6 寫一個 minimal `passthrough.ts`（only handles svg/mp4 if needed）or skip plugin altogether。在 plan 註解寫明「spike 確認 gif 預設不轉，無需 rehype 攔截」。

**分支 B（Astro 會 transform gif）：** 繼續 Step 3 實作 rehype plugin。

- [ ] **Step 3：（分支 B）實作 `passthrough.ts`**

```ts
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Element } from 'hast';

const PASSTHROUGH_EXT = /\.(gif|svg|mp4)$/i;

/**
 * Rehype plugin: marks <img> tags whose src ends in gif/svg/mp4 with
 * `data-passthrough` so they are emitted as-is (no sharp transform).
 *
 * Pairs with a Vite/Astro hook that respects this attribute. If Astro's
 * default markdown image handling already passes these through (verified
 * by spike), this plugin is unnecessary.
 */
export const passthroughBinaries: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return;
      const src = node.properties?.src;
      if (typeof src !== 'string') return;
      if (PASSTHROUGH_EXT.test(src)) {
        node.properties = node.properties ?? {};
        node.properties['data-passthrough'] = 'true';
      }
    });
  };
};
```

- [ ] **Step 4：（分支 B）註冊 rehype plugin**

修改 `astro/astro.config.ts`，加 `markdown.rehypePlugins`：
```ts
import { obsidianRemark } from './src/lib/images/obsidian-remark';
import { passthroughBinaries } from './src/lib/images/passthrough';

// ...
  markdown: {
    remarkPlugins: [obsidianRemark],
    rehypePlugins: [passthroughBinaries],
  },
```

- [ ] **Step 5：（分支 B）build 後抽樣驗證 gif HTML 輸出**

Run: `cd astro && npm run build`
找一個 gif 文章（譬如先前 grep `\.gif` 結果），看 `dist/.../index.html` 內 `<img>`：
- 應有 `data-passthrough="true"` attr
- src 應指向 `.gif` 路徑（非 webp）

若 src 仍被 transform，spike 結果跟 Step 1 不一致 → fallback 用 Astro config 級排除（Step 6）。

- [ ] **Step 6：分支 C fallback — 透過 Astro config 排除**

如果 Step 5 失敗，移除 rehype plugin，改用 Astro markdown image config（Astro 6.2 有 `image.experimentalLayout` / `markdown.image` 選項）跳過特定副檔名。具體 API 在 spike 階段查 Astro 6.2 docs；最差情況就是接受 GIF 被轉 webp 的限制，並在 spec 標註為 known issue。

- [ ] **Step 7: Commit**

```bash
git add astro/src/lib/images/passthrough.ts astro/astro.config.ts
git commit -m "feat(astro): passthrough gif/svg/mp4 in markdown rendering"
```

（若採分支 A，commit message 改：`docs(astro): note Astro defaults preserve gif (no plugin needed)` 並可能只動 plan 文件 / spec 註記）

---

## Task 6: PostList 加 cover 渲染

**Files:**
- Modify: `astro/src/components/PostList.astro`

- [ ] **Step 1: 修改 PostList.astro 加 cover thumbnail**

```astro
---
import { Image } from 'astro:assets';
import type { PostMeta } from '../lib/posts';
import { groupByYear } from '../lib/posts';

interface Props {
  locale: string;
  posts: PostMeta[];
}
const { locale, posts } = Astro.props;
const grouped = groupByYear(posts);
const years = [...grouped.keys()].sort((a, b) => b - a);
---
<div class="post-list">
  {years.map((year) => (
    <section class="year">
      <h2>{year}</h2>
      <ul>
        {grouped.get(year)!.map((post) => (
          <li>
            <a href={`/${locale}/posts/${post.slug}`}>
              <span class="date">{post.date.toISOString().slice(5, 10)}</span>
              <span class="title">{post.title}</span>
              {post.cover && (
                <span class="cover">
                  <Image
                    src={post.cover}
                    alt=""
                    widths={[120, 240]}
                    sizes="120px"
                    loading="lazy"
                  />
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  ))}
</div>

<style>
  .year { margin-bottom: 3rem; }
  .year h2 {
    font-family: var(--font-serif), serif;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #444;
  }
  ul { list-style: none; padding: 0; }
  li { margin: 0.75rem 0; }
  li a {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .date {
    font-family: var(--font-serif), serif;
    font-size: 0.875rem;
    color: #888;
    min-width: 4rem;
    letter-spacing: 0;
  }
  .title { flex: 1; }
  .cover { flex-shrink: 0; }
  .cover :global(img) {
    width: 120px;
    height: auto;
    border-radius: 4px;
    display: block;
  }
  li a:hover .title { text-decoration: underline; text-underline-offset: 4px; }
</style>
```

- [ ] **Step 2: 跑 build（workaround 仍在 → cover 模組多半 stub，但結構應正確）**

Run: `cd astro && npm run build`
Expected: PASS — 1494 頁。HTML 結構應該有 `.cover` 區塊（只在 `post.cover` 非 null 時）。實際 srcset 等到 Task 7 才會生效。

- [ ] **Step 3: Commit**

```bash
git add astro/src/components/PostList.astro
git commit -m "feat(astro): render post cover thumbnails in PostList"
```

---

## Task 7: 移除 POC workaround，sharp service 接管

**Files:**
- Modify: `astro/astro.config.ts`

- [ ] **Step 1: 從 `astro.config.ts` 移除 workaround**

完整改寫成（保留 Task 3/5 加的 markdown plugin 註冊）：

```ts
import { defineConfig, fontProviders } from 'astro/config';
import { obsidianRemark } from './src/lib/images/obsidian-remark';
import { passthroughBinaries } from './src/lib/images/passthrough';

export default defineConfig({
  output: 'static',
  site: 'https://yurenju.blog',
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [obsidianRemark],
    rehypePlugins: [passthroughBinaries],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans TC',
      cssVariable: '--font-sans',
      weights: [400, 500, 700],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Serif TC',
      cssVariable: '--font-serif',
      weights: [400, 700],
    },
  ],
});
```

（若 Task 5 走分支 A 沒寫 passthrough plugin，移除對應 import 與 rehypePlugins 行）

- [ ] **Step 2: 跑 build，記錄時間並觀察錯誤**

Run: `cd astro && npm run build`
Expected: 可能會出現新錯誤，**這是預期的** —— 列出來逐一處理：
- 若有 `Could not find image file` 之類 → 是 cover 路徑解析或 obsidian-remark rewrite 問題；找出有問題的 entry，先檢查實際檔案是否存在
- 若有 `Maximum call stack` / OOM → 圖片數量過大，回到 spec 風險表的 cache 策略

記錄 build 時間（時鐘秒數）。

- [ ] **Step 3: 修任何 build 阻塞**

依錯誤訊息逐個修。常見可能：
- 路徑大小寫錯（macOS dev 機器與 CI Linux 差異）→ 修 fixture 或檔名
- `import.meta.glob` 沒涵蓋某副檔名 → 補進 cover.ts 的 glob pattern
- 某些 markdown 內的相對 image 路徑因 Phase 1a `cp` 而失效（不應該，但要確認）→ 個別 case 處理

每修一個跑一次 build 直到綠。

- [ ] **Step 4: 跑 vitest 確認單元測試還綠**

Run: `cd astro && npm test`
Expected: PASS — find-in-entry-dir、obsidian-remark、cover 三組測試全通過

- [ ] **Step 5: 抽樣驗收（手動，配 Claude Preview）**

啟動 preview server（用 MCP preview 工具）：
- 抽樣 5 篇文章對應 acceptance 條件（純 `![[]]`、純 `![](images/)`、混用、含 GIF、無圖）
- 用 DevTools Network panel 看：
  - PNG/JPG/JPEG/WEBP：應有 srcset、AVIF/WebP 變體、檔名 hashed、`width`/`height` attr
  - GIF：`.gif` 原檔（非 webp）、檔名 hashed、動畫播放
- 抽樣 `/zh/`、`/zh/tech`、`/zh/life`、`/zh/archives`：cover 走 sharp pipeline 有 srcset

把抽樣結果（截圖 + 觀察）貼進 PR 描述。

- [ ] **Step 6: 確認 workaround 痕跡清乾淨**

Run: `cd astro && grep -r ignorePublicContentImages src/ astro.config.ts || echo "clean"`
Expected: `clean`

Run: `cd astro && grep -r passthroughImageService src/ astro.config.ts || echo "clean"`
Expected: `clean`

- [ ] **Step 7: Commit**

```bash
git add astro/astro.config.ts
git commit -m "feat(astro): remove POC workarounds, sharp pipeline takes over"
```

---

## Task 8: roadmap 完成備忘 + Phase 1b 收尾

**Files:**
- Modify: `docs/research/2026-04-29-astro-migration-roadmap.md`

- [ ] **Step 1: 更新 roadmap 的 Phase 1b 段落**

在 `### Phase 1b — 圖片 pipeline` 標題後加上：

```markdown
### Phase 1b — 圖片 pipeline ✅ 已完成（YYYY-MM-DD）

**完成 commits：** `<commit hashes>`。spec：`docs/superpowers/specs/2026-04-30-phase-1b-image-pipeline-design.md`，plan：`docs/superpowers/plans/2026-04-30-phase-1b-image-pipeline.md`。

**完成備忘：**
- Build 時間：`<秒數>`s（Phase 0 基準 8.7s）
- GIF 處理路線：分支 `<A/B/C>`（`<簡述>`）
- POC workaround 已全清，sharp service 接管 image pipeline
- `PostMeta.cover` 為 Phase 4 OG meta 與後續 styling 預備好基礎設施
```

把上方原本的「目標 / 範圍 / 驗收 / 相依 / 風險」段落保留，標記過去式。

- [ ] **Step 2: 更新 roadmap 頂部「狀態」行**

把：
```
**狀態：** Phase 0（POC）、Phase 1a 已完成並 merge 進 main。後續 phase 待執行。
```

改為：
```
**狀態：** Phase 0（POC）、Phase 1a、Phase 1b 已完成並 merge 進 main。後續 phase 待執行。
```

- [ ] **Step 3: Commit**

```bash
git add docs/research/2026-04-29-astro-migration-roadmap.md
git commit -m "docs: mark Phase 1b complete in migration roadmap"
```

- [ ] **Step 4: 開 PR / merge 進 main**

依 git flow 慣例（branch → PR → merge）。Phase 1b 結束。

---

## 自我檢查與觀察

**Spec 涵蓋對照：**
- 移除 POC workaround → Task 7
- `obsidian-remark` 改寫 `![[]]` → Task 3
- Cover 解析（frontmatter + body fallback） → Task 4
- GIF/SVG/MP4 passthrough → Task 5
- 列表頁 `<Image>` 渲染 → Task 6
- `findInEntryDir` 共用 helper → Task 2
- 範圍外（ja/en、OG cover、placeholder）→ 計畫無相關 task，符合
- 驗收條件（build、DevTools 抽樣、warn 行為、workaround 清光）→ Task 7 step 5/6 + Task 8

**未在計畫的 spec 內容：** 無。

**Type 一致性：** `PostMeta.cover` 型別 `ImageMetadata | null`（Task 4），`<Image src={post.cover}>` 在 `post.cover` truthy 時才用（Task 6 用 `{post.cover && ...}`）。`resolveCover` 回傳 `Promise<ImageMetadata | null>`（Task 4 cover.ts），`toMeta` await 後寫入 `cover`，全部一致。

**Placeholder 掃描：** Task 5 step 6 提到「最差情況接受 GIF 被轉 webp 的限制」是 fallback 路線、非 placeholder；spike 必須先做、結果決定走哪個分支。
