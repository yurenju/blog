# Phase 4 — SEO 與 metadata

**狀態：** Spec
**前置 Phase：** Phase 0、1a、1b、2、3（已 merge）
**對應 roadmap：** `docs/research/2026-04-29-astro-migration-roadmap.md` Phase 4

## 目標

補齊 Astro 站台的 SEO metadata：每頁 OG / Twitter card / canonical、文章頁 JSON-LD `Article` schema、`@astrojs/sitemap` 自動產 sitemap（含 i18n hreflang alternates）。沿用 Phase 2 已建好的 hreflang alternates。

## 非目標（明確排除）

- `dateModified` 文章修改時間（無可靠來源）
- `BreadcrumbList`、`WebSite`、`Person` schema（YAGNI）
- 自動 OG image 生成（Cloudflare og-image worker 等）
- robots.txt（Phase 6 部署平台層處理）
- Google Search Console / Bing Webmaster 提交（手動，非 build pipeline）
- AMP

## Next.js prod 既有 metadata 摘要

從 `out/zh/posts/2024-02-02_semaphore.html` 等抽樣（2026-05-02 確認）：

**已有：** og:title / og:description / og:url / og:type=article / og:image (1200×567 cover.png) / twitter:card=summary_large_image / twitter:title / twitter:description / twitter:image / hreflang alternates。

**沒有：** `<link rel="canonical">`、sitemap.xml、JSON-LD schema。

Phase 4 完成後上述沒有的三項都補齊；既有的維持並補強：og:locale、轉用 hashed image URL（Phase 1b 後 cover 走 image pipeline）。

## 架構

擴 `BaseLayout.astro` 接 SEO props（canonical / ogType / ogImage）並在 `<head>` 渲染 canonical + 完整 OG + Twitter card。新 helper `src/lib/seo.ts` 集中 SEO 常數（站 logo URL/尺寸）、`buildArticleSchema()`、`absoluteUrl()`。`PostLayout.astro` 加 JSON-LD `<script type="application/ld+json">` 與選 cover-or-logo 為 og:image。`@astrojs/sitemap` 整合到 `astro.config.ts`，filter 排除 `/rss/*`，i18n config 自動產 hreflang alternates。

### 為什麼 OG fallback 用站 logo

站本身 brand 不強，沒設計 per-locale banner 的負擔有意義。Logo `/logo.jpg` 站根目錄已存在（首頁 hero 用同一張）。一致即可。

### 為什麼只做 `Article` schema

對個人部落格而言 Article schema 是 Google rich results 的甜蜜點。BreadcrumbList 維護成本與導覽複雜度成正比，目前導覽是 Header 平面結構（沒有真的階層），勉強塞 schema 反而失真。WebSite + SearchAction 不適用（站無搜尋功能）。

## 元件邊界

| 單元 | 職責 | 介面 | 依賴 |
|---|---|---|---|
| `src/lib/seo.ts`（新） | SEO 常數與 helper | `SITE_LOGO: { url, width, height }`、`absoluteUrl(path, site)`、`buildArticleSchema(post, locale, ogImageUrl)` | `i18n.ts`、`posts.ts` |
| `src/lib/__tests__/seo.test.ts`（新） | unit tests | — | — |
| `src/layouts/BaseLayout.astro`（修改） | 接 SEO props，渲染 canonical / OG / Twitter | Props 加 `canonical: URL`、`ogType?`、`ogImage?` | `seo.ts` |
| `src/layouts/PostLayout.astro`（修改） | 算 ogImage（cover ∥ logo）、產 JSON-LD、傳 SEO props 到 BaseLayout | 無新 props | `seo.ts`、`i18n.ts`、`HREFLANG` |
| 6 page files（list/about/subscription，修改） | 傳對應 SEO props 給 BaseLayout | 各加 4-5 行 | `seo.ts` |
| `astro.config.ts`（修改） | 加 `@astrojs/sitemap` integration | — | — |
| `astro/package.json`（修改） | 加 `@astrojs/sitemap` dep | — | — |

## SEO Props 設計

**`BaseLayout.astro` Props**（在 Phase 2 既有的 `title` / `description` / `lang` 之上增加）：

```ts
interface Props {
  title: string;
  description?: string;
  lang?: string;
  // 新增 ↓
  canonical: URL;                                              // 必傳，傳 Astro.url
  ogType?: 'website' | 'article';                              // default 'website'
  ogImage?: { url: string; width?: number; height?: number };  // default SITE_LOGO
  ogLocale?: 'zh-Hant-TW' | 'ja' | 'en';                       // default 'zh-Hant-TW'
}
```

**Head 區塊渲染（追加）：**

```astro
<link rel="canonical" href={canonical} />

<meta property="og:title" content={title} />
<meta property="og:description" content={description ?? siteDescription} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content={ogType ?? 'website'} />
<meta property="og:locale" content={ogLocale ?? 'zh-Hant-TW'} />
<meta property="og:image" content={image.url} />
{image.width && <meta property="og:image:width" content={String(image.width)} />}
{image.height && <meta property="og:image:height" content={String(image.height)} />}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description ?? siteDescription} />
<meta name="twitter:image" content={image.url} />
```

`image` 為 `ogImage ?? SITE_LOGO`。

## SEO Props per page

| Page | title | ogType | ogImage |
|---|---|---|---|
| `[locale]/index.astro` | "Yuren's Blog" | website | logo |
| `[locale]/tech.astro` | `${t(locale).nav.tech} - Yuren's Blog` | website | logo |
| `[locale]/life.astro` | `${t(locale).nav.life} - Yuren's Blog` | website | logo |
| `[locale]/archives.astro` | `${t(locale).nav.archives} - Yuren's Blog` | website | logo |
| `[locale]/about.astro` | `${t(locale).nav.about} - Yuren's Blog` | website | logo |
| `[locale]/subscription.astro` | `${t(locale).nav.subscription} - Yuren's Blog` | website | logo |
| `[locale]/posts/[slug].astro`（透過 PostLayout） | post.title | article | post.cover ∥ logo |

`canonical` 一律 `Astro.url`（self）。Phase 2 hreflang 機制獨立運作不受影響。

## `seo.ts` API

```ts
// src/lib/seo.ts
import type { PostMeta } from './posts';
import { HREFLANG, type Locale } from './i18n';

export const SITE_LOGO = {
  url: 'https://yurenju.blog/logo.jpg',
  width: 100,
  height: 100,
};

/**
 * Resolve path/URL to absolute URL using the configured site origin.
 * Pass-through if already absolute.
 */
export function absoluteUrl(pathOrUrl: string, site: URL): string {
  if (/^https?:/.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, site).href;
}

/**
 * Build the JSON-LD `Article` schema object for a post.
 * Caller serializes via JSON.stringify and wraps in <script type="application/ld+json">.
 */
export function buildArticleSchema(
  post: PostMeta,
  locale: Locale,
  ogImageUrl: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    inLanguage: HREFLANG[locale],
    datePublished: post.date.toISOString(),
    image: ogImageUrl,
    author: {
      '@type': 'Person',
      name: 'Yuren Ju',
      url: 'https://yurenju.blog',
    },
  };
}
```

## JSON-LD 嵌入

`PostLayout.astro` 渲染：

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify(articleSchema).replaceAll('</', '<\\/')}
  slot="head"
/>
```

`replaceAll('</', '<\\/')` 是防 `</script>` 注入。`set:html` 是 Astro 慣用。`slot="head"` 透過 BaseLayout 的 `<slot name="head" />`（Phase 2 已建立）注入到 `<head>`。

## Sitemap

**`astro.config.ts` 整合：**

```ts
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // ...既有
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-Hant', ja: 'ja', en: 'en' },
      },
      filter: (page) => !page.includes('/rss'),
    }),
  ],
});
```

**產出：**
- `dist/sitemap-index.xml`（entry，引用下方分檔）
- `dist/sitemap-0.xml`（實際 URL；50K 內單檔）

`@astrojs/sitemap` 自動：
- 掃 `dist/**/*.html` 列入
- 用 i18n.locales 把同一篇 post 的 `/zh/posts/<slug>`、`/ja/posts/<slug>`、`/en/posts/<slug>` 互相用 `<xhtml:link rel="alternate" hreflang="...">` 連起來
- 排除 RSS endpoint（filter）

## 測試

vitest 新增：

- `src/lib/__tests__/seo.test.ts`：
  - `absoluteUrl('https://example.com/x', site)` 直接 return
  - `absoluteUrl('/foo', new URL('https://yurenju.blog'))` → `'https://yurenju.blog/foo'`
  - `buildArticleSchema(post, 'zh', img)`：`@type` = 'Article'、`inLanguage` = 'zh-Hant'、`datePublished` ISO、`image` = img、author Person
  - `buildArticleSchema(post, 'ja', img).inLanguage` = 'ja'

整合驗證（plan 最後 task 手動）：
- `dist/sitemap-index.xml` 存在
- `dist/sitemap-0.xml` 含 1500+ URL，抽樣翻譯篇有 hreflang alternates，無 `/rss/` 或 `/_astro/` URL
- 抽樣 post 頁 head 含 canonical / og:* 完整 / twitter:card / `<script type="application/ld+json">`；JSON-LD 內 `inLanguage` 對 locale；image 是 hashed `/_astro/<hash>.webp` 絕對 URL
- 抽樣 list 頁 head 含 og/twitter/canonical（無 JSON-LD）
- Phase 2 hreflang alternates 在文章頁仍存在（不被覆蓋）
- 上 Google Rich Results Test 抽樣 zh/ja/en post URL：valid

## 驗收

1. **Sitemap：** `dist/sitemap-index.xml`、`dist/sitemap-0.xml` 存在且 well-formed（`xmllint --noout`）
2. **Sitemap 內容：** 含全部 zh/ja/en post URL（≈ 1547）+ list/about/subscription（zh×6 + ja×5 + en×5 = 16）≈ 1563 條 URL（不含 archives 目錄頁的 redundant 條目，archives 列表頁本身會在）
3. **Sitemap 無 RSS / _astro：** `grep` `dist/sitemap-0.xml` 無 `/rss/`、無 `/_astro/`
4. **Sitemap hreflang alternates：** 抽樣翻譯篇 `2024-02-02_semaphore` 在 sitemap 三條 URL 間有 `<xhtml:link rel="alternate" hreflang="...">` 互相對應
5. **Canonical 全頁：** 每頁 head 有 `<link rel="canonical" href={self}>`
6. **OG 完整：** og:title / og:description / og:url / og:type / og:locale / og:image 全頁
7. **Twitter card：** twitter:card="summary_large_image" + title / description / image 全頁
8. **OG image fallback：** 沒 cover 的頁 og:image = `https://yurenju.blog/logo.jpg`；有 cover 的文章頁 og:image = hashed `/_astro/<hash>.webp` 絕對 URL
9. **JSON-LD：** 文章頁有 `<script type="application/ld+json">`，schema `@type` = Article、`inLanguage` 對應 locale、含 datePublished / headline / image / author
10. **Phase 2 hreflang 不被破壞：** 翻譯篇 head 仍含 4 條 hreflang alternates（zh-Hant / ja / en / x-default）
11. **Google Rich Results Test：** 抽樣 zh / ja / en post 各一篇通過 Article schema 驗證
12. **Build 時間：** 相對 Phase 3 (32.63s) 增加 < +5s

## 風險

| 風險 | 機率 | 影響 | 緩解 |
|---|---|---|---|
| `@astrojs/sitemap` i18n alternate 配對失敗（譬如 URL 編碼問題） | 低 | 中 | 抽樣肉眼確認；驗收項目 4 |
| `<script set:html>` 內 `</script>` 注入 | 低 | 中 | helper `replaceAll('</', '<\\/')` |
| Cover image URL 不是絕對 URL → OG image 失效 | 中 | 中 | `absoluteUrl(post.cover.src, site)` 強制轉絕對 |
| Sitemap 含 archives 列表頁但內容只 zh，會有 ja/en 版本但 sitemap 沒列 | 已成立 | 低 | 預期行為：ja/en archives 不存在所以 sitemap 不該列 |
| BaseLayout 多塞 5 個 props 讓所有 caller 變胖 | 中 | 低 | 用合理 default（`canonical` 必傳、其他 default fallback） |

## 範圍外明示

- `dateModified` / 修改時間
- BreadcrumbList、WebSite、Person standalone schema
- robots.txt（Phase 6）
- 自動 OG image 生成
- AMP

## 完成定義

- 所有驗收項目通過
- spec 與 plan commit
- branch 可獨立 merge 進 main
