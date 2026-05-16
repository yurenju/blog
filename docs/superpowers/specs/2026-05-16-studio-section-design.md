# Studio 區域設計

## 目標

在 blog 新增一個 `/studio` 區域,用來蒐集攝影、互動裝置等「藝術/創作型」作品。與既有的 Tech / Life 文章列表並列,但用更視覺化的卡片呈現,並把作品本身的 demo 與 source code 連結放在顯眼位置。

工程型開源專案不在這次範圍內 — 未來會獨立規劃另一個入口 (例如 `/projects`),不混進 Studio。

首件作品為 [fujisan](https://github.com/yurenju/fujisan/) (富士山 — 日落的位移),一個用手機傾斜瀏覽 125 張對齊富士山照片的互動作品。

## 架構

### 路由

- `/[locale]/studio/` — 作品列表頁
- `/[locale]/studio/[slug]/` — 單一作品詳細頁

三語都生成 (zh / ja / en),沿用既有 `[locale]` 動態路由模式。

### 導覽

Header 在 Tech 與 Life 之後、Archives 之前插入 Studio:

```
Tech  /  Life  /  Studio  /  Archives  /  About
```

各 locale 的 label 用 `translate` skill 處理。預想對應 (實作時以 skill 輸出為準):

| Locale | Label |
|---|---|
| zh-Hant-TW | 工作室 |
| ja | スタジオ |
| en | Studio |

i18n 字串加進 `src/lib/i18n.ts` 既有的 translation table。

### 內容存放

新 content collection:

- 路徑: `src/content/works/`
- 目錄結構沿用 posts 慣例:`works/YYYY-MM-DD_<slug>/`
  - zh 主檔: `<title>.md` (檔名為人類可讀標題)
  - 翻譯 (optional): `index.ja.md` / `index.en.md`,只需 `title` frontmatter,其餘 inherit zh 版
  - 素材: `assets/` 子目錄,markdown 內用 Obsidian wiki link 引用 (`![[cover.jpg]]`)

### Frontmatter Schema

```yaml
---
slug: 2026-05-15_fujisan
title: 富士山 — 日落的位移
date: 2026-05-15
cover: assets/cover.jpg
demo_url: https://fujisan.yurenju.me/
repo_url: https://github.com/yurenju/fujisan
tags: [photography, interactive]
---
```

欄位說明:

| 欄位 | 必填 | 用途 |
|---|---|---|
| `slug` | 是 | URL slug,沿用 `YYYY-MM-DD_<name>` 格式 |
| `title` | 是 (zh) / 是 (翻譯版) | 顯示標題;zh 版可由檔名推得,翻譯版必填 |
| `date` | 是 | 完成日期 (顯示在卡片與作品頁) |
| `cover` | 是 | 列表卡片與作品頁 hero 圖 |
| `demo_url` | 否 | 有則顯示「開啟 Demo」按鈕 |
| `repo_url` | 否 | 有則顯示「GitHub」按鈕 |
| `tags` | 否 | 列表卡片顯示前 1–2 個 tag,純展示用,這次不做 tag filter |

i18n inherit 行為與 posts 完全一致 (參考 `src/lib/posts.ts` 的 `resolvePostMeta` / locale fallback 邏輯)。沒有翻譯版時,該作品只在 zh locale 出現。

### 列表頁 `/[locale]/studio/`

- 卡片 grid:桌機 2 欄、手機 1 欄
- 每張卡片元素:大封面圖 (16:9 或維持原圖比例)、標題、日期、前 1–2 個 tag
- 點卡片進詳細頁
- 依 `date` 反序,無分頁 (作品數量可預見地少,未來超過再加)
- 沿用 `.container` (max-width 48rem) 的寬度約束

### 詳細頁 `/[locale]/studio/[slug]/`

頁面結構:

```
┌────────────────────────────────────┐
│  封面圖 (full-width within container) │
├────────────────────────────────────┤
│  標題                                │
│  2026-05-15 • photography           │
│                                    │
│  [ 開啟 Demo ↗ ]  [ GitHub ↗ ]     │ ← 視 frontmatter 而定
├────────────────────────────────────┤
│  markdown 內文 (.prose)             │
└────────────────────────────────────┘
```

- 套用既有 PostLayout 的變體,或拆一個獨立 `WorkLayout.astro` (實作時決定哪個更乾淨)
- Demo / GitHub 按鈕用視覺對比明顯的樣式 (沿用既有 link color,加 border + icon),`target="_blank" rel="noopener"`
- 內文沿用 `.prose` 與既有 remark plugin (Obsidian wiki link、image service)

### Components

預計新增:

- `src/components/WorkCard.astro` — 列表卡片
- `src/components/WorkMeta.astro` — 詳細頁上方的 meta 區 (日期、tags、Demo/GitHub 按鈕)
- (可能) `src/layouts/WorkLayout.astro` — 若 PostLayout 不易直接 reuse

預計修改:

- `src/components/Header.astro` — 插入 Studio 入口
- `src/lib/i18n.ts` — 加 Studio label 三語翻譯
- `src/content.config.ts` — 註冊新 `works` collection 與 schema
- `src/lib/posts.ts` 或新增 `src/lib/works.ts` — works 的 meta 解析與 locale fallback (盡量抽共用邏輯,但避免硬塞進 posts 模組)

### 首件作品:fujisan

- 路徑:`src/content/works/2026-05-15_fujisan/`
- Cover:從 `C:\Users\yuren\Downloads\cover.jpg` 複製到 `assets/cover.jpg`
- 內文:以 fujisan README 的「展示」段落為基礎改寫成 blog 風格的 zh 文章,涵蓋創作緣起、技術手法 (SIFT + RANSAC 對齊)、互動方式說明、授權資訊
- Frontmatter:
  ```yaml
  ---
  slug: 2026-05-15_fujisan
  title: 富士山 — 日落的位移
  date: 2026-05-15
  cover: assets/cover.jpg
  demo_url: https://fujisan.yurenju.me/
  repo_url: https://github.com/yurenju/fujisan
  tags: [photography, interactive]
  ---
  ```
- ja / en 翻譯一併完成,使用 `translate` skill (Translate Chinese blog post to Japanese and English) 從 zh 版產出 `index.ja.md` 與 `index.en.md`

## 範圍外 (這次不做)

- 工程型開源作品的入口 (`/projects` 或類似) — 之後獨立規劃
- Studio 專屬 RSS feed
- Tag filter / tag 列表頁
- 詳細頁 iframe embed 模式 (`embed_url` 欄位) — 等到有純 web 互動作品再加
- 作品分頁 (作品數量超過時再加)
- fujisan 以外作品的內容遷移

## 風險與注意事項

- **i18n fallback 邏輯重用**:posts 的 locale 解析邏輯在 `src/lib/posts.ts`,要避免直接把 works 邏輯硬塞進去。抽共用 helper 或新建 `works.ts` 並參考 posts 的做法,實作時擇一。
- **Header 多語 label**:加新 nav item 一定要三語都補上,否則翻譯缺漏會 fallback 到 key 或空字串。
- **Cover 圖路徑**:Obsidian wiki link plugin 預期 `assets/` 在 markdown 同目錄。frontmatter 的 `cover: assets/cover.jpg` 也是相對路徑,要確認既有 cover 解析邏輯能正確處理 works collection (跟 posts 路徑深度可能不同)。
- **PostLayout 重用 vs WorkLayout 新建**:傾向先嘗試 reuse,如果發現要塞太多 conditional (例如 Demo/GitHub 按鈕、不顯示 article signoff、不顯示 translation notice),就拆獨立 layout 比較乾淨。
