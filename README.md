# Yuren 的部落格

基於 [Astro](https://astro.build/) 打造的靜態部落格，主要使用繁體中文撰寫，偶有少量英文與日文翻譯文章。網站部署於 Cloudflare Pages。

## 特色

- 📝 **靜態導出** - 全站於建置時預先渲染為 HTML，無需伺服器
- 🌓 **深色模式** - 支援淺色/深色主題切換，跟隨系統偏好
- 📱 **響應式設計** - 適應各種裝置尺寸
- 🔖 **多分類支援** - 技術 (tech)、生活 (life)
- 🗄️ **文章歸檔** - 2019 年以前的舊文章歸檔至 Archives，主列表只顯示近年文章
- 🌍 **多語言支援** - 繁體中文、日文、英文的文章翻譯與 UI 多語化
- 🌐 **多語言 RSS** - 12 個 RSS feed（每語言全站、每語言每分類，含 legacy 別名）
- 🅰️ **CJK 字型管線** - 透過 Astro Font API 於建置時 subset Noto Sans/Serif TC/JP

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:4321](http://localhost:4321) 即可看到網站。

### 建置

```bash
npm run build
```

建置產物輸出至 `dist/`，全站約 1500+ 頁，建置時間約 40 秒；RSS feed 也會在這一步一併產出。

### 其他指令

- `npm run preview` - 在本機預覽 production build
- `npm run check` - 執行 `astro check`（型別檢查 + content collection 驗證）
- `npm run test` - 執行 vitest 單元測試

## 專案架構

### 目錄結構

```
├── src/
│   ├── pages/                # Astro 路由
│   │   ├── [locale]/         # 多語言路由（zh / ja / en）
│   │   │   ├── posts/[slug].astro     # 文章頁
│   │   │   ├── tech.astro             # 技術分類列表
│   │   │   ├── life.astro             # 生活分類列表
│   │   │   ├── archives/              # 歸檔列表（含 tech/life 子分類）
│   │   │   ├── about.astro
│   │   │   └── subscription.astro
│   │   ├── rss/[name].xml.ts # 12 個 RSS feed endpoint
│   │   ├── 404.astro
│   │   └── index.astro       # 根路徑 meta refresh 至 /zh/
│   ├── content/posts/        # Markdown 文章來源
│   │   ├── archives/         # 2019 年及以前歸檔
│   │   └── 2020/～2026/      # 依年份分組
│   ├── components/           # Astro 元件（Header、Footer、PostList…）
│   ├── layouts/              # BaseLayout、PostLayout
│   ├── lib/                  # posts、i18n、seo、images、rss-feed
│   ├── static-pages/         # 各語言版「關於」「訂閱」內容
│   └── styles/global.css     # 全站 CSS（無 Tailwind）
├── public/                   # 靜態資產（logo、_redirects）
├── astro.config.ts           # Astro 設定（sitemap、Font API、image service）
└── docs/                     # 設計文件、規格、實作 plan
```

### 技術棧

- **框架**: Astro 6（static export）
- **樣式**: 純 CSS + CSS 變數（`src/styles/global.css`）
- **字型**: Astro Font API（Noto Sans TC/JP、Noto Serif TC/JP、Noto Sans Mono）
- **Markdown**: Astro Content Collections + remark/rehype（含自製 Obsidian wiki link plugin）
- **語法高亮**: Shiki（Astro 內建）
- **RSS**: `@astrojs/rss`
- **Sitemap**: `@astrojs/sitemap`
- **測試**: Vitest
- **部署**: Cloudflare Pages

## 內容撰寫

### 文章存放

每篇文章是一個目錄，路徑為 `src/content/posts/{group}/YYYY-MM-DD_{slug}/`。`{group}` 為 `archives`（2019 年及以前）或年份目錄（`2020`～`2026`）。

目錄內：

- **繁中主檔**：檔名為文章標題本身的 `.md` 檔（例：`語言是概念的剪刀.md`），**不是** `index.md`
- **翻譯**（選填）：`index.ja.md`、`index.en.md`
- **資產**（選填）：`assets/` 子目錄，文中以 Obsidian wiki link 引用，如 `![[ginkgo.jpg]]`

範例：

```
src/content/posts/2026/2026-01-17_語言是概念的剪刀/
├── 語言是概念的剪刀.md   # 繁中主檔
├── index.ja.md           # 日文翻譯
├── index.en.md           # 英文翻譯
└── assets/
    └── ginkgo.jpg
```

### Frontmatter

Frontmatter 刻意極簡——絕大多數文章只寫 `slug` 與 `categories`，`title` 由檔名推斷、`date` 由目錄名前綴 `YYYY-MM-DD` 推斷。

繁中主檔典型寫法：

```markdown
---
slug: 2025-02-03_point-card-belonging
categories:
  - life          # 或 tech
---

文章內容…
```

可用欄位（皆選填）：

- `slug` - URL slug；未指定時由目錄名稱推斷
- `categories` - 陣列；實際使用以第一項為準（`tech` / `life`）
- `category` - 單一字串（`tech` / `life`）；schema 同時接受，但 `categories` 優先
- `title`、`date` - 覆寫檔名/目錄名推斷的值
- `cover` - 封面圖路徑；未指定時取文章中第一張圖
- `description` - SEO 描述

### 多語言翻譯

支援的語言：

- **繁體中文** (`zh`) - 主要語言，預設
- **日文** (`ja`) - 翻譯文章
- **英文** (`en`) - 翻譯文章

新增翻譯時，在文章目錄中加入對應檔案：

- 日文：`index.ja.md`
- 英文：`index.en.md`

翻譯檔通常**只需在 frontmatter 寫 `title`**（該語言的標題），其他 metadata（`slug`、`date`、`categories` 等）會自動從繁中主檔繼承——這也代表三語共用同一條 canonical URL。建置後翻譯版本會出現在對應語言的列表與 RSS。

### 路由結構

- `/zh/`、`/ja/`、`/en/` - 各語言首頁
- `/{locale}/posts/[slug]` - 文章頁
- `/{locale}/tech`、`/{locale}/life` - 分類列表
- `/{locale}/archives`、`/{locale}/archives/tech`、`/{locale}/archives/life` - 歸檔列表

### RSS

每語言獨立 feed，並可進一步依分類過濾：

- `/rss/zh.xml`、`/rss/ja.xml`、`/rss/en.xml`
- `/rss/{locale}/tech.xml`、`/rss/{locale}/life.xml`
- Legacy 別名：`/rss.xml`、`/rss/tech.xml`、`/rss/life.xml`（皆對應繁中內容）

## 網站設定

- **主要語言**: 繁體中文 (zh-Hant-TW)，支援日文、英文翻譯
- **網址**: https://yurenju.blog
- **作者**: Yuren
- **主題**: 支援淺色/深色模式，跟隨系統偏好

## 授權

本專案採用雙重授權：

- **程式碼**: [MIT License](LICENSE)
- **文章內容**: [Creative Commons BY-NC 4.0](LICENSE)

詳細授權資訊請參閱 [LICENSE](LICENSE) 檔案。

若您需要將文章內容用於商業用途，請聯絡 blog@yurenju.me 洽談授權事宜。
