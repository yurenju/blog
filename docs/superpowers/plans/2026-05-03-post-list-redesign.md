# 文章列表頁面 redesign 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 改造文章列表頁面（`/[locale]/life`、`/[locale]/tech`、`/zh/archives`）為「雜誌列」版面，新增句點感知的摘要萃取，並把全站 base font-size 從 16px 提升到 20px 以改善手機閱讀。

**Architecture:** 共用元件 `PostList.astro` 改為固定大小縮圖框 + 垂直置中 + 兩行摘要。摘要在 build 時於 `getAllPosts()` 階段透過新 helper `extractExcerpt()` 從 markdown body 萃取，存入 `PostMeta.excerpt`。全站字級調整在 `global.css` 一行改動，其他元件以 rem 計算的尺寸自動跟著放大。

**Tech Stack:** Astro 6（Content Collections + scoped CSS）、TypeScript、vitest（測試在 `src/lib/__tests__/`）。

---

## File Structure

**新檔：**
- `src/lib/excerpt.ts` — 摘要萃取 helper（純函式）
- `src/lib/__tests__/excerpt.test.ts` — vitest 單元測試

**修改：**
- `src/lib/posts.ts` — `PostMeta` 介面新增 `excerpt`，`toMeta()` 計算並填入
- `src/styles/global.css` — `html { font-size: 16px }` → `20px`
- `src/components/PostList.astro` — 完全重寫版面（含 mobile 響應）

**不會修改：**
- 路由頁面（`life.astro`、`tech.astro`、`archives.astro`）—— 它們只是呼叫 `<PostList>`，不需要動
- frontmatter schema、其他元件、其他樣式

---

## Task 1: extractExcerpt helper（TDD）

**Files:**
- Create: `src/lib/excerpt.ts`
- Test: `src/lib/__tests__/excerpt.test.ts`

- [ ] **Step 1.1: Write the failing test file**

Create `src/lib/__tests__/excerpt.test.ts`:

```ts
// src/lib/__tests__/excerpt.test.ts
import { describe, it, expect } from 'vitest';
import { extractExcerpt } from '../excerpt';

describe('extractExcerpt', () => {
  describe('source priority', () => {
    it('uses frontmatter description when provided', () => {
      const body = '這是內文。';
      const desc = '這是 description。';
      expect(extractExcerpt(body, desc)).toBe('這是 description。');
    });

    it('falls back to body when description is empty string', () => {
      expect(extractExcerpt('內文。', '')).toBe('內文。');
    });

    it('falls back to body when description is undefined', () => {
      expect(extractExcerpt('內文。', undefined)).toBe('內文。');
    });
  });

  describe('cleaning markdown', () => {
    it('strips Obsidian wiki image links at the start', () => {
      const body = '![[cover.jpg]]\n\n這是首段。';
      expect(extractExcerpt(body)).toBe('這是首段。');
    });

    it('strips standard markdown image at the start', () => {
      const body = '![alt text](./cover.jpg)\n\n這是首段。';
      expect(extractExcerpt(body)).toBe('這是首段。');
    });

    it('preserves text from inline markdown links', () => {
      const body = '請看[這裡](https://example.com)的說明。';
      expect(extractExcerpt(body)).toBe('請看這裡的說明。');
    });

    it('skips heading lines and uses next paragraph', () => {
      const body = '# 標題\n\n這是首段。';
      expect(extractExcerpt(body)).toBe('這是首段。');
    });

    it('strips inline HTML tags', () => {
      const body = '這是<strong>重點</strong>內容。';
      expect(extractExcerpt(body)).toBe('這是重點內容。');
    });

    it('collapses repeated whitespace into a single space', () => {
      const body = '前段。\n\n\n   多   餘   空白。';
      expect(extractExcerpt(body)).toBe('前段。');
    });
  });

  describe('truncation by sentence terminators', () => {
    it('returns the whole paragraph if shorter than 80 chars', () => {
      const body = '一個短句。';
      expect(extractExcerpt(body)).toBe('一個短句。');
    });

    it('cuts at the last sentence terminator within 80 chars', () => {
      // 35 + 35 = 70 chars, two sentences both within 80 — cut at 2nd terminator
      const s1 = '一'.repeat(34) + '。';
      const s2 = '二'.repeat(34) + '。';
      const s3 = '三'.repeat(50) + '。'; // pushes total over 80
      expect(extractExcerpt(s1 + s2 + s3)).toBe(s1 + s2);
    });

    it('extends search to 100 chars when no terminator within 80', () => {
      // First terminator falls between 80 and 100
      const head = '甲'.repeat(85);
      const body = head + '。後面文字。';
      expect(extractExcerpt(body)).toBe(head + '。');
    });

    it('hard-cuts to 80 chars + ellipsis when no terminator within 100', () => {
      const body = '無'.repeat(150);
      const result = extractExcerpt(body);
      expect(result).toBe('無'.repeat(80) + '⋯');
    });

    it('recognises ASCII period as a terminator', () => {
      const body = 'This is a sentence. And another one that goes on much longer than expected to see truncation behavior.';
      const result = extractExcerpt(body);
      expect(result).toBe('This is a sentence.');
    });

    it('recognises full-width comma exclamation and question marks', () => {
      const body = '真的嗎？我不確定欸。' + '其'.repeat(100);
      // First terminator '？' at 4 chars, but next '。' at 10 chars — both within 80,
      // last terminator within 80 wins → '真的嗎？我不確定欸。'
      expect(extractExcerpt(body)).toBe('真的嗎？我不確定欸。');
    });
  });

  describe('empty cases', () => {
    it('returns empty string for empty body', () => {
      expect(extractExcerpt('')).toBe('');
    });

    it('returns empty string for body with only images', () => {
      expect(extractExcerpt('![[a.jpg]]\n![[b.jpg]]')).toBe('');
    });

    it('returns empty string for body with only headings', () => {
      expect(extractExcerpt('# 標題一\n\n## 標題二')).toBe('');
    });

    it('returns empty string for body with only fenced code block', () => {
      const body = '```ts\nconst x = 1;\n```';
      expect(extractExcerpt(body)).toBe('');
    });
  });
});
```

- [ ] **Step 1.2: Run the test to confirm it fails**

Run: `npm run test -- excerpt`
Expected: FAIL — `Cannot find module '../excerpt'`

- [ ] **Step 1.3: Implement extractExcerpt**

Create `src/lib/excerpt.ts`:

```ts
// src/lib/excerpt.ts
//
// Derive a short excerpt from a markdown post body, suitable for showing
// under the title in list views. Sentence-aware truncation: prefers cutting
// at a sentence terminator near the soft limit; only hard-cuts when none
// is found within the hard limit.

const SOFT_LIMIT = 80;
const HARD_LIMIT = 100;
const TERMINATORS = ['。', '．', '.', '！', '？', '!', '?'];
const ELLIPSIS = '⋯';

/**
 * Strip markdown / HTML noise from raw body and return the first non-empty
 * paragraph as a single line of plain text.
 */
function cleanFirstParagraph(body: string): string {
  // Remove fenced code blocks first (they would otherwise contribute text).
  let s = body.replace(/```[\s\S]*?```/g, '');

  // Split into paragraphs (blank-line delimited) and process each until we
  // find one that has visible text after cleaning.
  const paragraphs = s.split(/\n\s*\n/);
  for (const raw of paragraphs) {
    const cleaned = cleanLine(raw);
    if (cleaned) return cleaned;
  }
  return '';
}

function cleanLine(raw: string): string {
  // Skip headings (entire paragraph is a heading line)
  if (/^\s*#/.test(raw)) return '';

  let s = raw;
  // Obsidian wiki image: ![[...]]
  s = s.replace(/!\[\[[^\]]*\]\]/g, '');
  // Markdown image: ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Inline link [text](url) → text
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  // HTML tags
  s = s.replace(/<[^>]+>/g, '');
  // Collapse whitespace (incl. newlines inside the paragraph) and trim
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function isTerminator(ch: string): boolean {
  return TERMINATORS.includes(ch);
}

/**
 * Find the index *after* the last terminator within [0, limit). Returns -1
 * if no terminator exists in that range.
 */
function lastTerminatorEnd(text: string, limit: number): number {
  const end = Math.min(limit, text.length);
  for (let i = end - 1; i >= 0; i--) {
    if (isTerminator(text[i]!)) return i + 1;
  }
  return -1;
}

/**
 * Find the index *after* the first terminator in [start, limit). Returns -1
 * if no terminator exists in that range.
 */
function firstTerminatorEnd(text: string, start: number, limit: number): number {
  const end = Math.min(limit, text.length);
  for (let i = start; i < end; i++) {
    if (isTerminator(text[i]!)) return i + 1;
  }
  return -1;
}

function truncate(text: string): string {
  if (text.length <= SOFT_LIMIT) return text;

  const softCut = lastTerminatorEnd(text, SOFT_LIMIT);
  if (softCut > 0) return text.slice(0, softCut);

  const hardCut = firstTerminatorEnd(text, SOFT_LIMIT, HARD_LIMIT);
  if (hardCut > 0) return text.slice(0, hardCut);

  return text.slice(0, SOFT_LIMIT) + ELLIPSIS;
}

export function extractExcerpt(body: string, description?: string): string {
  if (description && description.trim()) {
    return truncate(description.trim());
  }
  const para = cleanFirstParagraph(body);
  if (!para) return '';
  return truncate(para);
}
```

- [ ] **Step 1.4: Run tests to verify they pass**

Run: `npm run test -- excerpt`
Expected: All ~17 tests PASS.

- [ ] **Step 1.5: Commit**

```bash
git add src/lib/excerpt.ts src/lib/__tests__/excerpt.test.ts
git commit -m "feat(excerpt): add sentence-aware excerpt extraction helper"
```

---

## Task 2: Wire excerpt into PostMeta

**Files:**
- Modify: `src/lib/posts.ts`

- [ ] **Step 2.1: Add excerpt field to PostMeta interface**

In `src/lib/posts.ts`, find the `PostMeta` interface (around line 9). Add `excerpt: string;` after `description?: string;`:

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
  excerpt: string;            // <-- new
  cover: ImageMetadata | null;
  locale: Locale;
  availableLocales: Locale[];
}
```

- [ ] **Step 2.2: Import extractExcerpt at the top of posts.ts**

Add to the existing imports near the top:

```ts
import { extractExcerpt } from './excerpt';
```

- [ ] **Step 2.3: Compute excerpt inside toMeta()**

Find the `return { ... }` block at the end of `toMeta()`. Just before the return, add:

```ts
const excerpt = extractExcerpt(entry.body ?? '', entry.data.description);
```

Then add `excerpt,` to the returned object (alongside `cover`, `description`, etc.):

```ts
return {
  entry,
  slug,
  group,
  archived: group === 'archives',
  category: resolveCategory(entry.data),
  title,
  date,
  description: entry.data.description,
  excerpt,                    // <-- new
  cover,
  locale,
  availableLocales: [locale],
};
```

- [ ] **Step 2.4: Verify type checks pass**

Run: `npm run check`
Expected: PASS, no TypeScript errors.

- [ ] **Step 2.5: Commit**

```bash
git add src/lib/posts.ts
git commit -m "feat(posts): expose excerpt field on PostMeta"
```

---

## Task 3: Global base font bump

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 3.1: Read current value to confirm location**

Open `src/styles/global.css`. Find the `html { ... }` rule (around line 30):

```css
html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}
```

- [ ] **Step 3.2: Change font-size to 20px**

Edit just that line:

```css
html {
  font-size: 20px;
  -webkit-text-size-adjust: 100%;
}
```

- [ ] **Step 3.3: Verify type / build still works**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3.4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: bump global base font-size to 20px"
```

> Note: Do not visually verify yet — we will inspect after PostList is also updated, since multiple changes affect the same screens.

---

## Task 4: PostList.astro redesign

**Files:**
- Modify: `src/components/PostList.astro`

This task replaces the entire file. The current implementation (date · title · right-side cover with `align-items: center` on the anchor and large fixed-width cover) is replaced by the magazine-row design with a fixed thumbnail frame, placeholder for missing covers, and a body containing date / title / excerpt.

- [ ] **Step 4.1: Read the existing file to confirm baseline**

Open `src/components/PostList.astro`. Confirm it matches the structure described in the spec (date | title | optional cover, grouped by year).

- [ ] **Step 4.2: Replace the entire file**

Overwrite `src/components/PostList.astro` with:

```astro
---
import { Image } from 'astro:assets';
import type { PostMeta } from '../lib/posts';
import { groupByYear } from '../lib/posts';
import { localePath, type Locale } from '../lib/i18n';

interface Props {
  locale: Locale;
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
            <a href={localePath(locale, 'posts', post.slug)}>
              {post.cover ? (
                <span class="thumb-frame">
                  <Image
                    src={post.cover}
                    alt=""
                    widths={[140, 280]}
                    sizes="140px"
                    loading="lazy"
                  />
                </span>
              ) : (
                <span class="thumb-frame thumb-placeholder" aria-hidden="true"></span>
              )}
              <span class="body">
                <span class="date">{post.date.toISOString().slice(5, 10)}</span>
                <span class="title">{post.title}</span>
                {post.excerpt && <span class="excerpt">{post.excerpt}</span>}
              </span>
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
    color: var(--color-text-muted);
  }

  ul { list-style: none; padding: 0; margin: 0; }
  li { margin: 0; }

  li a {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.15rem 0;
    border-bottom: 1px solid var(--color-border);
    color: inherit;
    text-decoration: none;
  }
  li:last-child a { border-bottom: none; }

  .thumb-frame {
    flex-shrink: 0;
    width: 140px;
    height: 105px;
    border-radius: 6px;
    overflow: hidden;
    background: var(--color-border);
    display: block;
  }
  .thumb-frame :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .thumb-placeholder {
    background:
      repeating-linear-gradient(
        45deg,
        var(--color-border) 0 8px,
        var(--color-bg-elevated) 8px 16px
      );
  }

  .body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .date {
    font-family: var(--font-serif), serif;
    font-size: 0.78rem;
    color: var(--color-text-subtle);
    letter-spacing: 0;
  }
  .title {
    font-size: 1.1rem;
    line-height: 1.4;
    color: var(--color-text);
  }
  .excerpt {
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--color-text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  li a:hover .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  @media (max-width: 640px) {
    li a {
      gap: 0.85rem;
      padding: 0.95rem 0;
    }
    .thumb-frame {
      width: 105px;
      height: 105px;
    }
    .body { gap: 0.3rem; }
    .date { font-size: 0.72rem; }
    .title { font-size: 1rem; line-height: 1.35; }
    .excerpt { font-size: 0.82rem; line-height: 1.55; }
  }
</style>
```

- [ ] **Step 4.3: Type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 4.4: Commit**

```bash
git add src/components/PostList.astro
git commit -m "feat(post-list): magazine-row layout with excerpt and placeholder"
```

---

## Task 5: Visual verification

This task does not commit code; it only validates. Use Claude Preview MCP tools (per project memory) — not direct `npm run dev`.

- [ ] **Step 5.1: Start the dev server via preview MCP**

Ensure `.claude/launch.json` has an Astro dev entry. If not, create:

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "astro-dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 4321 }
  ]
}
```

Then call `mcp__Claude_Preview__preview_start` with `name: "astro-dev"`.

- [ ] **Step 5.2: Verify desktop list pages**

For each of `/zh/life`, `/zh/tech`, `/zh/archives`, `/ja/life`, `/ja/tech`, `/en/life`, `/en/tech`:
- `mcp__Claude_Preview__preview_eval` with `window.location.href = '<url>'`
- `mcp__Claude_Preview__preview_screenshot` and visually check:
  - All thumbnails are 140×105 and identically sized
  - Excerpts wrap at 2 lines and are truncated cleanly
  - Year headings render in serif muted color
  - Border-bottoms separate rows; last row of each year has none
  - Posts without a cover show the striped placeholder, not a missing frame

- [ ] **Step 5.3: Verify mobile via resize**

Call `mcp__Claude_Preview__preview_resize` to 375 × 800. Re-screenshot the same routes and confirm:
  - Thumbnails are 105×105 (square)
  - Text is centered vertically against the thumbnail
  - Font-size bump is visible (text is comfortably readable)

- [ ] **Step 5.4: Spot-check edge cases**

Find any post known to have no cover (or temporarily test by inspecting an archives entry without an image). Confirm placeholder renders.

If any post body is purely images / code, confirm the row simply omits the `.excerpt` line (no empty span artefact).

- [ ] **Step 5.5: Verify other pages still look OK after font bump**

Check homepage `/zh/`, an article page (any post under `/zh/posts/...`), and the about page `/zh/about`. Confirm:
  - No layout breaks (e.g. nav wrapping awkwardly, footer overflowing)
  - Reading is more comfortable on mobile

If something breaks (e.g. nav too wide), file a follow-up — don't fix in this plan unless trivial.

- [ ] **Step 5.6: Stop the dev server**

Call `mcp__Claude_Preview__preview_stop` for the `astro-dev` server.

> No commit in this task — purely verification.

---

## Self-Review Checklist (for the planner)

- [x] Spec coverage: 全站字級 (Task 3), `extractExcerpt` (Task 1), `PostMeta.excerpt` (Task 2), `PostList.astro` 版面 + 響應式 + 無封面 placeholder (Task 4), 視覺驗證 (Task 5).
- [x] No placeholders / TBDs in any step.
- [x] Type / function names consistent: `extractExcerpt(body, description?)` referenced identically in Tasks 1 & 2; `PostMeta.excerpt: string` matches across Tasks 2 & 4.
- [x] Each task ends with a commit step (except Task 5 which is verification-only).
