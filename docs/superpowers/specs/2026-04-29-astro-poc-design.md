---
title: Astro 遷移 POC 設計
date: 2026-04-29
status: draft
---

# Astro 遷移 POC 設計文件

## 背景

現有 blog 以 Next.js 15 (App Router, static export) 製作，含 1400+ 篇繁體中文 markdown 文章、三語言（zh/ja/en）路由與 fallback、RSS、深色模式、code highlighting、Tailwind + 多語 prose 樣式。實際使用一段時間後判斷 **Astro 更適合內容導向 blog**，希望開 POC 驗證可行性。

POC 目的：用最小改動驗證 Astro 能否處理現有內容、開發體驗、build 速度、最終呈現。POC 通過後再逐步擴展三語言、RSS、圖片等功能。

## POC 範圍

### 必做（Must）

- Astro 6.1，static output (`output: 'static'`)
- TypeScript 全程：`astro.config.ts`、所有設定與 component 內嵌 TS
- URL 結構：
  - `/zh`（首頁，最新文章列表）
  - `/zh/tech`（tech 分類列表）
  - `/zh/life`（life 分類列表）
  - `/zh/archives`（封存文章列表）
  - `/zh/about`（佔位內容即可）
  - `/zh/subscription`（佔位內容即可）
  - `/zh/posts/<slug>`（單篇文章）
- 根目錄到 `/zh` 的 redirect（首頁 `/` → `/zh`，POC 階段先做這一個）
- 1400+ 篇繁中 markdown 文章渲染
- Markdown → HTML（Astro 內建 remark/rehype，含 GFM）
- Astro Content Collections + `glob()` loader，schema 用 zod 驗證 frontmatter
- Astro 原生 styling：scoped `<style>` blocks + 一份 `src/styles/global.css`
- Astro Fonts API（Google provider）：Noto Sans TC + Noto Serif TC，self-hosted + auto preload
- 三語言路由結構預留（路徑用 `/[locale]/...`，POC 只填 `zh`）

### 不做（POC 後再加）

- 三語言實際內容（ja/en）與語言切換 UI、語言 fallback
- RSS feeds
- 圖片處理（markdown 內 `<img>` 輸出原樣，POC 不負責讓圖片顯示）
- 深色模式
- Code highlighting（Astro 預設 Shiki 關閉）
- Sitemap、OG meta、SEO metadata
- 其他根目錄路徑（`/tech`、`/posts/...` 等）的 redirect — 之後再加
- 圖片優化、`<Image>` component

## 目錄結構

POC 與現有 Next.js **同 repo 並存**，Astro 放在子目錄 `astro/`：

```
blog/                              # 現有 Next.js（保持不動）
├── app/                           # Next.js App Router（不動）
├── lib/                           # Next.js 邏輯（不動）
├── public/posts/                  # markdown 內容來源（不動，Astro 從這裡讀）
├── package.json                   # Next.js 的
├── astro/                         # ← POC 新目錄
│   ├── src/
│   │   ├── content.config.ts      # Content Collections schema
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro   # html/head/body shell + Font 注入
│   │   │   └── PostLayout.astro   # 文章頁
│   │   ├── components/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── PostList.astro     # 列表（首頁/category/archives 共用）
│   │   │   └── PostMeta.astro     # 日期、分類顯示
│   │   ├── pages/
│   │   │   ├── index.astro        # 根目錄首頁，HTML meta refresh → /zh
│   │   │   └── [locale]/
│   │   │       ├── index.astro    # /zh 首頁
│   │   │       ├── tech.astro
│   │   │       ├── life.astro
│   │   │       ├── archives.astro
│   │   │       ├── about.astro
│   │   │       ├── subscription.astro
│   │   │       └── posts/[slug].astro  # 動態路由 + getStaticPaths
│   │   └── styles/
│   │       └── global.css         # reset + 字型 + prose
│   ├── public/                    # Astro 靜態資源（POC 階段空，圖片之後處理）
│   ├── astro.config.ts
│   ├── tsconfig.json
│   └── package.json               # Astro 自己的依賴
└── docs/superpowers/specs/2026-04-29-astro-poc-design.md
```

未來「把 Next.js 替換成 Astro」時：將 `astro/` 內容上移到根目錄，刪除 Next.js 的 `app/`、`lib/`、`package.json` 等；`public/posts/` 留在原位繼續被 Astro 使用。

## 內容讀取

Content Collections 用 `glob()` loader 指向**父目錄**，POC 不搬檔：

```ts
// astro/src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../public/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['tech', 'life']).default('tech'),
    description: z.string().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { posts };
```

每篇文章的 `id` 會是相對於 base 的路徑（例：`2024/2024-01-01_title/index`）。
從 `id` 可推導：
- **slug**：取最後一段資料夾名稱（如 `2024-01-01_title`）
- **archived**：`id.startsWith('archives/')`
- **group**：第一段（如 `2024`、`archives`）

寫一個 `src/lib/posts.ts` helper 把 collection entry 轉成統一的 `PostMeta` 型別。

## 路由與分類邏輯

| 路徑 | 顯示 |
|---|---|
| `/zh` | 全部非 archived，按日期 desc，含 tech + life |
| `/zh/tech` | `category === 'tech'` 且非 archived |
| `/zh/life` | `category === 'life'` 且非 archived |
| `/zh/archives` | `archived === true` |
| `/zh/posts/<slug>` | 單篇（含 archived 文章也能直接連到） |

列表頁按年份分組（沿用現有設計）。

## Styling

### 全域樣式（`src/styles/global.css`）

- Modern CSS reset（box-sizing、margin、line-height base）
- Body 套 `--font-sans`，標題套 `--font-serif`
- 段落 line-height 2.0、letter-spacing 0.05em（沿用現有繁中閱讀體驗）
- Max width 48rem 居中
- Prose 樣式自己寫（不使用 `@tailwindcss/typography`）

### Component scoped styles

每個 `.astro` component 內 `<style>` 寫該 component 的樣式，Astro 自動 scope。

### 字型

Astro Fonts API：

```ts
// astro.config.ts
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  output: 'static',
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

`BaseLayout.astro` 的 `<head>` 引入 `<Font cssVariable="--font-sans" preload />` 與 serif 對應 tag。

## Redirect 策略

`src/pages/index.astro` 內容只放 HTML meta refresh + canonical：

```astro
---
---
<!doctype html>
<html lang="zh-Hant-TW">
  <head>
    <meta http-equiv="refresh" content="0; url=/zh/" />
    <link rel="canonical" href="/zh/" />
    <title>Yuren's Blog</title>
  </head>
  <body><a href="/zh/">/zh/</a></body>
</html>
```

POC 不處理 `/tech`、`/posts/...` 等其他路徑的 redirect（之後在部署平台用 `_redirects` 或加 Astro page 處理）。

## 驗收標準

POC 視為完成，需以下都成立：

1. `npm install` 與 `npm run dev` 可啟動 dev server
2. `npm run build` 成功，無 schema validation 錯誤
3. 1400+ 篇文章全部 build 出對應 `/zh/posts/<slug>/index.html`
4. `/zh`、`/zh/tech`、`/zh/life`、`/zh/archives` 列表正常顯示，按年分組
5. 任意點開一篇文章，內文 markdown 正確渲染（內含 `<img>` 顯示為破圖是預期行為）
6. 字型載入：頁面顯示 Noto Sans TC（內文）與 Noto Serif TC（標題）
7. 根目錄 `/` 開啟後 redirect 到 `/zh`
8. Build 時間紀錄下來作為對比基準

## Out of Scope（明確排除）

- 不參考既有的 `astro-poc` branch
- 不做向後相容、不寫 migration script
- 不刪除任何 Next.js 既有檔案
- 不 commit 圖片到新位置
