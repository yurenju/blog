# Studio Section 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目標:** 為 blog 加上 `/studio` 區域,展示攝影/互動類藝術作品;同時上架第一件作品 fujisan,含 zh / ja / en 三語版本。

**架構:** 新增 `works` content collection,沿用既有 posts 的 i18n / cover / locale fallback 模式;新增 `/[locale]/studio/` 列表頁與 `/[locale]/studio/[slug]/` 詳細頁;沿用既有 BaseLayout 但拆出獨立的 WorkLayout、WorkCard、WorkMeta 元件,讓藝術作品的視覺呈現與一般文章解耦。

**技術堆疊:** Astro 6 (Content Collections + glob loader)、TypeScript、plain CSS、vitest;沿用 `translate` skill 處理 ja/en 翻譯。

**對 spec 的偏離說明:** Spec 寫「Header 在 Tech 與 Life 之間插入 Studio」,但實際 Header 目前只有 About / Subscription;Tech / Life 入口位於首頁 hero 的 `.categories`。因此本計畫把 Studio 加在**首頁 hero categories nav** (與 Tech/Life 同層級),符合 spec 原意 (「Studio 與 Tech/Life 同屬內容入口」)。

---

## 檔案結構

**新增:**
- `src/lib/works.ts` — works 的 meta 解析與 locale fallback (mirror `src/lib/posts.ts` 的模式)
- `src/components/WorkCard.astro` — 列表頁的卡片
- `src/components/WorkMeta.astro` — 詳細頁標題下方的 meta 列 (日期 / tags / Demo & GitHub 按鈕)
- `src/layouts/WorkLayout.astro` — 作品詳細頁的 layout
- `src/pages/[locale]/studio/index.astro` — 作品列表頁
- `src/pages/[locale]/studio/[slug].astro` — 作品詳細頁
- `src/lib/__tests__/works.test.ts` — works.ts 的關鍵單元測試
- `src/content/works/2026-05-15_fujisan/富士山 — 日落的位移.md` (zh 主檔)
- `src/content/works/2026-05-15_fujisan/index.ja.md`
- `src/content/works/2026-05-15_fujisan/index.en.md`
- `src/content/works/2026-05-15_fujisan/assets/cover.jpg`

**修改:**
- `src/content.config.ts` — 註冊新 `works` collection 與 schema
- `src/lib/i18n.ts` — `UiText.nav` 加 `studio` 欄位;`buildLanguageLinks` 處理 work page 的語言切換
- `src/lib/images/cover.ts` — 把 import.meta.glob 從 `posts` 限定改為 `posts | works` 通用
- `src/pages/[locale]/index.astro` — `.categories` nav 加上 Studio 連結

---

## 任務 1:註冊 works content collection

**檔案:**
- 修改: `src/content.config.ts`

- [ ] **步驟 1:擴充 collections export**

把 `src/content.config.ts` 改成:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: ['**/*.md'],
    base: './src/content/posts',
  }),
  schema: z
    .object({
      slug: z.string().optional(),
      title: z.string().optional(),
      date: z.coerce.date().optional(),
      categories: z
        .union([z.array(z.string()), z.string()])
        .optional(),
      category: z.enum(['tech', 'life']).default('tech'),
      description: z.string().optional(),
      cover: z.string().optional(),
    })
    .passthrough(),
});

const works = defineCollection({
  loader: glob({
    pattern: ['**/*.md'],
    base: './src/content/works',
  }),
  schema: z
    .object({
      slug: z.string().optional(),
      title: z.string().optional(),
      date: z.coerce.date().optional(),
      description: z.string().optional(),
      cover: z.string().optional(),
      demo_url: z.string().url().optional(),
      repo_url: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
    })
    .passthrough(),
});

export const collections = { posts, works };
```

- [ ] **步驟 2:建立 works 目錄與 .gitkeep**

Astro 的 glob loader 需要 base 目錄存在,否則 build 會錯。先建空目錄並加 `.gitkeep`,Task 12 加入 fujisan 後再移除。

```bash
mkdir -p src/content/works
touch src/content/works/.gitkeep
```

- [ ] **步驟 3:驗證 schema**

```bash
npm run check
```

預期:無錯誤輸出。

- [ ] **步驟 4:Commit**

```bash
git add src/content.config.ts
git commit -m "feat(works): register works content collection"
```

---

## 任務 2:擴充 cover 圖解析支援 works

**檔案:**
- 修改: `src/lib/images/cover.ts:12-14, 60, 68-69`

目前 `imageModules` 只 glob `/src/content/posts/**`,而 `resolveCover` 的型別簽名鎖死 `CollectionEntry<'posts'>`。Works 需要同樣的封面解析能力。

- [ ] **步驟 1:擴大 glob 範圍**

把 `src/lib/images/cover.ts` 最上面的 glob 改成涵蓋 posts 與 works:

```ts
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  [
    '/src/content/posts/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
    '/src/content/works/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
  ],
);
```

- [ ] **步驟 2:放寬 type 參數**

把檔案中:

```ts
type PostEntry = CollectionEntry<'posts'>;
```

改成支援兩個 collection 的 union:

```ts
type CoverEntry = CollectionEntry<'posts'> | CollectionEntry<'works'>;
```

並把 `resolveCover` 的參數型別從 `PostEntry` 改成 `CoverEntry`。`findFirstBodyImage` 不需要改,因為它只接 string。

- [ ] **步驟 3:Build check**

```bash
npm run check
```

預期:無 type 錯誤。

- [ ] **步驟 4:Commit**

```bash
git add src/lib/images/cover.ts
git commit -m "feat(cover): include works collection in image glob"
```

---

## 任務 3:建立 works.ts meta 解析

**檔案:**
- 新增: `src/lib/works.ts`
- 新增: `src/lib/__tests__/works.test.ts`

Mirror `src/lib/posts.ts` 的設計,但更精簡 — works 沒有 category、沒有 archives、沒有「按年分組」的需求。

- [ ] **步驟 1:寫失敗的測試**

建立 `src/lib/__tests__/works.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseWorkPathSegments } from '../works';

describe('parseWorkPathSegments', () => {
  it('parses zh main file under works dir', () => {
    const result = parseWorkPathSegments({
      filePath: 'src/content/works/2026-05-15_fujisan/富士山 — 日落的位移.md',
      id: '2026-05-15_fujisan/富士山 — 日落的位移',
    });
    expect(result).toEqual({
      dirname: '2026-05-15_fujisan',
      filename: '富士山 — 日落的位移',
    });
  });

  it('parses ja translation file', () => {
    const result = parseWorkPathSegments({
      filePath: 'src/content/works/2026-05-15_fujisan/index.ja.md',
      id: '2026-05-15_fujisan/index.ja',
    });
    expect(result).toEqual({
      dirname: '2026-05-15_fujisan',
      filename: 'index.ja',
    });
  });

  it('returns null for unparseable path', () => {
    const result = parseWorkPathSegments({ filePath: undefined, id: 'broken' });
    expect(result).toBeNull();
  });
});
```

- [ ] **步驟 2:跑測試確認 fail**

```bash
npm run test -- works
```

預期:FAIL,因為 `parseWorkPathSegments` 還不存在。

- [ ] **步驟 3:建立 src/lib/works.ts**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { resolveCover } from './images/cover';
import type { Locale } from './i18n';
import { inferLocaleFromFilename, computeAvailableLocales } from './locale-helpers';

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

/**
 * Parse `<dirname>/<filename>` from a works entry's source file path.
 *
 * Works live directly under `src/content/works/`, so the relative path has
 * only two segments (no `<group>` level like posts have).
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
```

- [ ] **步驟 4:再跑測試確認 pass**

```bash
npm run test -- works
```

預期:PASS。

- [ ] **步驟 5:Commit**

```bash
git add src/lib/works.ts src/lib/__tests__/works.test.ts
git commit -m "feat(works): add meta resolution and locale fallback"
```

---

## 任務 4:加入 Studio i18n 字串與 work page 語言切換

**檔案:**
- 修改: `src/lib/i18n.ts:30-37, 156-208`

- [ ] **步驟 1:寫失敗的測試**

把以下加進 `src/lib/__tests__/language-switcher-links.test.ts` (或新建一個 describe block):

```ts
import { describe, it, expect } from 'vitest';
import { buildLanguageLinks } from '../i18n';

describe('buildLanguageLinks for work pages', () => {
  it('links to /[target]/studio/[slug] when translation available', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/studio/2026-05-15_fujisan',
      isPostPage: false,
      isWorkPage: true,
      slug: '2026-05-15_fujisan',
      availableLocales: ['zh', 'ja', 'en'],
    });
    expect(links.find((l) => l.locale === 'ja')?.href).toBe('/ja/studio/2026-05-15_fujisan');
    expect(links.find((l) => l.locale === 'en')?.href).toBe('/en/studio/2026-05-15_fujisan');
  });

  it('falls back to /[target] home when translation missing', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/studio/2026-05-15_fujisan',
      isPostPage: false,
      isWorkPage: true,
      slug: '2026-05-15_fujisan',
      availableLocales: ['zh'],
    });
    expect(links.find((l) => l.locale === 'ja')?.href).toBe('/ja');
  });
});
```

- [ ] **步驟 2:跑測試確認 fail**

```bash
npm run test -- language-switcher
```

預期:FAIL — `isWorkPage` 不在 `BuildLanguageLinksInput` 上,或行為不符。

- [ ] **步驟 3:擴充 UiText.nav 加 studio**

修改 `src/lib/i18n.ts`,在 `UiText.nav` interface 加 `studio: string`:

```ts
export interface UiText {
  nav: {
    home: string;
    tech: string;
    life: string;
    studio: string;
    archives: string;
    about: string;
    subscription: string;
  };
  // ...rest unchanged
}
```

接著在 `UI_TEXT.zh.nav`、`UI_TEXT.ja.nav`、`UI_TEXT.en.nav` 三處各加上 `studio` 欄位:

```ts
// zh
nav: { home: '首頁', tech: '技術', life: '生活', studio: '工作室', archives: '歸檔', about: '關於', subscription: '訂閱' },
// ja
nav: { home: 'ホーム', tech: '技術', life: '生活', studio: 'スタジオ', archives: 'アーカイブ', about: '概要', subscription: '購読' },
// en
nav: { home: 'Home', tech: 'Tech', life: 'Life', studio: 'Studio', archives: 'Archives', about: 'About', subscription: 'Subscribe' },
```

- [ ] **步驟 4:擴充 BuildLanguageLinksInput 與 buildLanguageLinks**

在 `BuildLanguageLinksInput` interface 加上 `isWorkPage?: boolean`:

```ts
export interface BuildLanguageLinksInput {
  currentLocale: Locale;
  pathname: string;
  isPostPage: boolean;
  isWorkPage?: boolean;
  slug?: string;
  availableLocales?: Locale[];
}
```

把 `buildLanguageLinks` 開頭的 destructure 加上 `isWorkPage = false`,並在 post 分支前加上對 work page 的處理:

```ts
export function buildLanguageLinks(input: BuildLanguageLinksInput): LanguageLink[] {
  const { currentLocale, pathname, isPostPage, isWorkPage = false, slug, availableLocales } = input;
  const others = LOCALES.filter((l) => l !== currentLocale);
  return others.map((target) => {
    if (isWorkPage && slug && availableLocales?.includes(target)) {
      return { locale: target, href: `/${target}/studio/${slug}` };
    }
    if (isWorkPage) {
      return { locale: target, href: `/${target}` };
    }
    if (isPostPage && slug && availableLocales?.includes(target)) {
      return { locale: target, href: `/${target}/posts/${slug}` };
    }
    if (isPostPage) {
      return { locale: target, href: `/${target}` };
    }
    const stripped = pathname.replace(/^\/(zh|ja|en)/, '');
    if (target !== 'zh' && isZhOnlyPath(stripped)) {
      return { locale: target, href: `/${target}` };
    }
    return { locale: target, href: `/${target}${stripped}` };
  });
}
```

- [ ] **步驟 5:測試 pass**

```bash
npm run test
```

預期:全部 PASS,含新加的 work-page 語言切換測試。

- [ ] **步驟 6:Commit**

```bash
git add src/lib/i18n.ts src/lib/__tests__/language-switcher-links.test.ts
git commit -m "feat(i18n): add studio nav label and work-page language links"
```

---

## 任務 5:擴充 Header 接受 isWorkPage prop

**檔案:**
- 修改: `src/components/Header.astro:6-20, 33-39`

Header 目前傳 `isPostPage` 給 LanguageSwitcher。Work page 也要能正確切換語言,所以 Header 必須往下傳 `isWorkPage`。

- [ ] **步驟 1:加 prop**

`src/components/Header.astro` 的 Props interface 加 `isWorkPage?: boolean`,destructure 加 default `false`,然後傳給 `LanguageSwitcher`:

```ts
interface Props {
  locale: Locale;
  pathname: string;
  isPostPage?: boolean;
  isWorkPage?: boolean;
  slug?: string;
  availableLocales?: Locale[];
}

const {
  locale,
  pathname,
  isPostPage = false,
  isWorkPage = false,
  slug,
  availableLocales,
} = Astro.props;
```

在 LanguageSwitcher 標籤上加 `isWorkPage={isWorkPage}`。

- [ ] **步驟 2:在 LanguageSwitcher 元件接收並轉傳**

修改 `src/components/LanguageSwitcher.astro` 的 Props interface 與 destructure,加上 `isWorkPage?: boolean`:

```ts
interface Props {
  currentLocale: Locale;
  pathname: string;
  isPostPage?: boolean;
  isWorkPage?: boolean;
  slug?: string;
  availableLocales?: Locale[];
}

const {
  currentLocale,
  pathname,
  isPostPage = false,
  isWorkPage = false,
  slug,
  availableLocales,
} = Astro.props;
```

並把 `buildLanguageLinks(...)` 呼叫加上 `isWorkPage`:

```ts
const links = buildLanguageLinks({
  currentLocale,
  pathname,
  isPostPage,
  isWorkPage,
  slug,
  availableLocales,
});
```

- [ ] **步驟 3:check**

```bash
npm run check
```

預期:無 type 錯誤。

- [ ] **步驟 4:Commit**

```bash
git add src/components/Header.astro src/components/LanguageSwitcher.astro
git commit -m "feat(header): propagate isWorkPage to language switcher"
```

---

## 任務 6:WorkCard 元件

**檔案:**
- 新增: `src/components/WorkCard.astro`

列表頁的卡片:大封面 + 標題 + 日期 + 前 1–2 個 tag。整張卡片可點。

- [ ] **步驟 1:建立元件**

```astro
---
import { Image } from 'astro:assets';
import type { WorkMeta } from '../lib/works';
import { localePath, type Locale } from '../lib/i18n';

interface Props {
  locale: Locale;
  work: WorkMeta;
}
const { locale, work } = Astro.props;
const dateLabel = work.date.toISOString().slice(0, 10);
const visibleTags = work.tags.slice(0, 2);
---
<a class="work-card" href={localePath(locale, 'studio', work.slug)}>
  {work.cover ? (
    <span class="cover-frame">
      <Image
        src={work.cover}
        alt=""
        widths={[400, 800, 1200]}
        sizes="(max-width: 640px) 100vw, 22rem"
        loading="lazy"
      />
    </span>
  ) : (
    <span class="cover-frame cover-placeholder" aria-hidden="true"></span>
  )}
  <span class="body">
    <span class="title">{work.title}</span>
    <span class="meta">
      <span class="date">{dateLabel}</span>
      {visibleTags.length > 0 && <span class="sep" aria-hidden="true">·</span>}
      {visibleTags.map((tag) => (
        <span class="tag">{tag}</span>
      ))}
    </span>
  </span>
</a>

<style>
  .work-card {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    color: inherit;
    text-decoration: none;
  }
  .cover-frame {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 6px;
    overflow: hidden;
    background: var(--color-border);
  }
  .cover-frame :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cover-placeholder {
    background:
      repeating-linear-gradient(
        45deg,
        var(--color-border) 0 8px,
        var(--color-bg-elevated) 8px 16px
      );
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .title {
    font-family: var(--font-serif), serif;
    font-size: 1.2rem;
    line-height: 1.4;
    color: var(--color-text);
  }
  .meta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: var(--color-text-muted);
  }
  .tag {
    color: var(--color-text-subtle);
  }
  .work-card:hover .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>
```

- [ ] **步驟 2:Commit**

```bash
git add src/components/WorkCard.astro
git commit -m "feat(works): add WorkCard list-page component"
```

---

## 任務 7:WorkMeta 元件 (詳細頁 meta + 按鈕)

**檔案:**
- 新增: `src/components/WorkMeta.astro`

- [ ] **步驟 1:建立元件**

```astro
---
import type { WorkMeta as WorkMetaType } from '../lib/works';

interface Props {
  work: WorkMetaType;
}
const { work } = Astro.props;
const dateLabel = work.date.toISOString().slice(0, 10);
---
<div class="work-meta">
  <div class="row">
    <span class="date">{dateLabel}</span>
    {work.tags.length > 0 && <span class="sep" aria-hidden="true">·</span>}
    {work.tags.map((tag) => (
      <span class="tag">{tag}</span>
    ))}
  </div>
  {(work.demoUrl || work.repoUrl) && (
    <div class="actions">
      {work.demoUrl && (
        <a class="btn primary" href={work.demoUrl} target="_blank" rel="noopener">
          Demo ↗
        </a>
      )}
      {work.repoUrl && (
        <a class="btn" href={work.repoUrl} target="_blank" rel="noopener">
          GitHub ↗
        </a>
      )}
    </div>
  )}
</div>

<style>
  .work-meta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .row {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }
  .tag { color: var(--color-text-subtle); }
  .actions {
    display: inline-flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.92rem;
  }
  .btn:hover { border-color: var(--color-link); color: var(--color-link); }
  .btn.primary {
    background: var(--color-link);
    color: var(--color-bg);
    border-color: var(--color-link);
  }
  .btn.primary:hover { opacity: 0.85; color: var(--color-bg); }
</style>
```

- [ ] **步驟 2:Commit**

```bash
git add src/components/WorkMeta.astro
git commit -m "feat(works): add WorkMeta component with demo and repo buttons"
```

---

## 任務 8:WorkLayout

**檔案:**
- 新增: `src/layouts/WorkLayout.astro`

不沿用 PostLayout 因為:作品頁不顯示 ArticleSignoff、TranslationNotice、ArticleLanguageIndicator;封面圖是頁面 hero (在標題上方),不是隨內文出現的圖。

- [ ] **步驟 1:建立 layout**

```astro
---
import { Image } from 'astro:assets';
import BaseLayout from './BaseLayout.astro';
import Header from '../components/Header.astro';
import WorkMeta from '../components/WorkMeta.astro';
import type { WorkMeta as WorkMetaType } from '../lib/works';
import { HTML_LANG, HREFLANG, type Locale } from '../lib/i18n';
import { SITE_LOGO, absoluteUrl } from '../lib/seo';

interface Props {
  locale: Locale;
  work: WorkMetaType;
}

const { locale, work } = Astro.props;
const pageTitle = `${work.title} · Yuren's Blog`;
const siteUrl = 'https://yurenju.blog';

const ogImage = work.cover
  ? {
      url: absoluteUrl(work.cover.src, Astro.site!),
      width: work.cover.width,
      height: work.cover.height,
    }
  : SITE_LOGO;
---
<BaseLayout
  title={pageTitle}
  description={work.description}
  lang={HTML_LANG[locale]}
  canonical={Astro.url}
  ogType="article"
  ogImage={ogImage}
  ogLocale={HTML_LANG[locale] as 'zh-Hant-TW' | 'ja' | 'en'}
>
  <Fragment slot="head">
    {work.availableLocales.map((l) => (
      <link
        rel="alternate"
        hreflang={HREFLANG[l]}
        href={`${siteUrl}/${l}/studio/${work.slug}`}
      />
    ))}
    <link rel="alternate" hreflang="x-default" href={`${siteUrl}/zh/studio/${work.slug}`} />
  </Fragment>
  <Header
    locale={locale}
    pathname={Astro.url.pathname}
    isWorkPage={true}
    slug={work.slug}
    availableLocales={work.availableLocales}
  />
  <main class="container">
    <article>
      {work.cover && (
        <figure class="hero">
          <Image
            src={work.cover}
            alt={work.title}
            widths={[600, 1200, 1800]}
            sizes="(max-width: 768px) 100vw, 48rem"
            loading="eager"
          />
        </figure>
      )}
      <header class="head">
        <h1>{work.title}</h1>
      </header>
      <WorkMeta work={work} />
      <div class="prose">
        <slot />
      </div>
    </article>
  </main>
</BaseLayout>

<style>
  .hero {
    margin: 0 0 2rem;
  }
  .hero :global(img) {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
  .head { margin-bottom: 1rem; }
  .head h1 { font-size: 2.25rem; line-height: 1.25; }
</style>
```

- [ ] **步驟 2:check**

```bash
npm run check
```

預期:無 type 錯誤。

- [ ] **步驟 3:Commit**

```bash
git add src/layouts/WorkLayout.astro
git commit -m "feat(works): add WorkLayout with hero cover and meta"
```

---

## 任務 9:Studio 列表頁

**檔案:**
- 新增: `src/pages/[locale]/studio/index.astro`

- [ ] **步驟 1:建立列表頁**

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import Header from '../../../components/Header.astro';
import Footer from '../../../components/Footer.astro';
import WorkCard from '../../../components/WorkCard.astro';
import { getWorksByLocale } from '../../../lib/works';
import { LOCALES, HTML_LANG, type Locale, t } from '../../../lib/i18n';

export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

const locale = Astro.params.locale as Locale;
const works = await getWorksByLocale(locale);
const heading = t(locale).nav.studio;
---
<BaseLayout
  title={`${heading} · Yuren's Blog`}
  lang={HTML_LANG[locale]}
  canonical={Astro.url}
  ogLocale={HTML_LANG[locale]}
>
  <Header locale={locale} pathname={Astro.url.pathname} />
  <main class="container">
    <h1 class="page-title">{heading}</h1>
    <div class="grid">
      {works.map((work) => (
        <WorkCard locale={locale} work={work} />
      ))}
    </div>
  </main>
  <Footer />
</BaseLayout>

<style>
  .page-title { font-size: 2.25rem; margin-bottom: 2rem; }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
  }
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
  }
</style>
```

- [ ] **步驟 2:Commit**

```bash
git add src/pages/[locale]/studio/index.astro
git commit -m "feat(works): add /[locale]/studio list page"
```

---

## 任務 10:Studio 詳細頁

**檔案:**
- 新增: `src/pages/[locale]/studio/[slug].astro`

- [ ] **步驟 1:建立詳細頁**

```astro
---
import WorkLayout from '../../../layouts/WorkLayout.astro';
import { getAllWorks } from '../../../lib/works';
import { render } from 'astro:content';
import type { Locale } from '../../../lib/i18n';

export async function getStaticPaths() {
  const works = await getAllWorks();
  return works.map((work) => ({
    params: { locale: work.locale, slug: work.slug },
    props: { work },
  }));
}

const locale = Astro.params.locale as Locale;
const { work } = Astro.props;
const { Content } = await render(work.entry);
---
<WorkLayout locale={locale} work={work}>
  <Content />
</WorkLayout>
```

- [ ] **步驟 2:Commit**

```bash
git add src/pages/[locale]/studio/[slug].astro
git commit -m "feat(works): add /[locale]/studio/[slug] detail page"
```

---

## 任務 11:首頁 hero categories nav 加入 Studio

**檔案:**
- 修改: `src/pages/[locale]/index.astro:28-32`

把 `life · tech` 改成 `life · tech · studio`。

- [ ] **步驟 1:修改 nav**

`src/pages/[locale]/index.astro` 中 `<nav class="categories">` 區塊改成:

```astro
<nav class="categories">
  <a href={localePath(locale, 'life')}>{text.nav.life}</a>
  <span aria-hidden="true">·</span>
  <a href={localePath(locale, 'tech')}>{text.nav.tech}</a>
  <span aria-hidden="true">·</span>
  <a href={localePath(locale, 'studio')}>{text.nav.studio}</a>
</nav>
```

- [ ] **步驟 2:check**

```bash
npm run check
```

預期:無錯誤。

- [ ] **步驟 3:Commit**

```bash
git add src/pages/[locale]/index.astro
git commit -m "feat(home): add Studio entry to hero categories nav"
```

---

## 任務 12:加入 fujisan 作品內容 (zh)

**檔案:**
- 新增: `src/content/works/2026-05-15_fujisan/富士山 — 日落的位移.md`
- 新增: `src/content/works/2026-05-15_fujisan/assets/cover.jpg`
- 刪除: `src/content/works/.gitkeep` (Task 1 建立的佔位)

- [ ] **步驟 1:建立目錄與複製 cover**

```bash
mkdir -p "src/content/works/2026-05-15_fujisan/assets"
cp "/c/Users/yuren/Downloads/cover.jpg" "src/content/works/2026-05-15_fujisan/assets/cover.jpg"
rm src/content/works/.gitkeep
```

- [ ] **步驟 2:建立 zh markdown 主檔**

檔名是「富士山 — 日落的位移.md」(沿用 posts 慣例,檔名即標題)。內容:

```markdown
---
slug: 2026-05-15_fujisan
date: 2026-05-15
cover: assets/cover.jpg
demo_url: https://fujisan.yurenju.me/
repo_url: https://github.com/yurenju/fujisan
tags: [photography, interactive]
description: 在同一個地點不同時刻拍攝 125 張富士山照片,對齊輪廓後用手機傾斜瀏覽,體會時間與季節的流動。
---

去年秋天隱隱約約看到輪廓後,才知道從居所出門時正好看得到富士山。也因此才重新感知到地球傾斜角度對於日落位置的影響,特別是有了這座山作為標的物後,所有拍攝的照片就像是時光切片一樣,一層層的疊加在一起之後,就讓時間與季節流動運轉了起來。

這個專案透過在同一個地點、不同時刻拍攝 100+ 張富士山的照片,將山的輪廓對齊後,透過手機傾斜角度播放不同日期與時間富士山與太陽之間的關聯,體會時間與季節的流動。

## 怎麼玩

在手機上用拇指按住畫面中央的紅圈,**輕輕傾斜手機**翻動照片,放開就停在當下那一張。傾斜的方向決定要走哪條軌跡。

從東京三鷹的同一個地點,2025 年 9 月到 2026 年 5 月之間累積的 125 張富士山照片,逐張用 SIFT + RANSAC 對齊到同一個基準座標,讓富士山在畫面中不會晃動。橫軸是時間、縱軸是日期。傾斜手機在這個矩形內移動,照片就會跟著切換。中間四條軌道是日落時分,時間上有連續的照片,而上下的兩條軌道是沒有整天連續的照片。

## 授權

- **程式碼**:MIT
- **照片**:CC BY-NC 4.0 (姓名標示-非商業性使用)
```

- [ ] **步驟 3:Build verify**

```bash
npm run build
```

預期:build 成功,輸出含 `/zh/studio/`、`/zh/studio/2026-05-15_fujisan/`、`/ja/studio/`、`/en/studio/`。

- [ ] **步驟 4:Commit**

```bash
git add src/content/works/
git commit -m "feat(works): add fujisan as first studio work (zh)"
```

---

## 任務 13:翻譯 fujisan 到日文與英文

**檔案:**
- 新增: `src/content/works/2026-05-15_fujisan/index.ja.md`
- 新增: `src/content/works/2026-05-15_fujisan/index.en.md`

- [ ] **步驟 1:呼叫 translate skill**

呼叫 `translate` skill (Translate Chinese blog post to Japanese and English),input 為 `src/content/works/2026-05-15_fujisan/富士山 — 日落的位移.md`,目標產出:

- `src/content/works/2026-05-15_fujisan/index.ja.md`
- `src/content/works/2026-05-15_fujisan/index.en.md`

翻譯版只需 `title` 與 `description` 兩個 frontmatter 欄位 (slug / date / cover / demo_url / repo_url / tags 都由 zh 版 inherit)。

- [ ] **步驟 2:Build verify 三語都有**

```bash
npm run build
```

預期:build 成功,輸出含 `/ja/studio/2026-05-15_fujisan/` 與 `/en/studio/2026-05-15_fujisan/` 完整頁面。

- [ ] **步驟 3:Commit**

```bash
git add src/content/works/2026-05-15_fujisan/index.ja.md src/content/works/2026-05-15_fujisan/index.en.md
git commit -m "feat(works): add ja and en translations for fujisan"
```

---

## 任務 14:Build 與 preview 驗證

**檔案:**
- 無 (純驗證)

- [ ] **步驟 1:完整 type check + build**

```bash
npm run check && npm run build
```

預期:皆成功,無 warning 阻斷。

- [ ] **步驟 2:跑全部測試**

```bash
npm run test
```

預期:全部 PASS。

- [ ] **步驟 3:啟動 preview 並做視覺驗證**

用 Claude Preview MCP 工具啟動 dev server (依 user memory 不要用 npm run dev),依序確認:

1. `/zh/` 首頁 hero categories 出現「工作室」連結
2. `/zh/studio/` 列表頁顯示 fujisan 卡片 (含封面)
3. `/zh/studio/2026-05-15_fujisan/` 詳細頁顯示 hero cover、標題、Demo & GitHub 按鈕、內文
4. 詳細頁的語言切換可正確跳到 `/ja/studio/...` 與 `/en/studio/...`
5. `/ja/studio/` 與 `/en/studio/` 列表頁顯示 fujisan 卡片並使用對應語言的卡片標題
6. Dark mode 切換時 hero 圖、按鈕、卡片邊框配色正確

截一張詳細頁的 screenshot 給 user 確認。

- [ ] **步驟 4:無新增 commit (本任務只驗證)**

如步驟 1–3 發現問題,回到對應 task 修正並補 commit。

---

## 範圍外 (不在本計畫處理)

- 工程作品的入口設計 (`/projects` 或類似)
- Studio 專屬 RSS feed
- Tag filter / tag 列表頁
- `embed_url` iframe 嵌入模式
- 列表頁分頁
- fujisan 以外作品的內容遷移
