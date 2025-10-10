# Yuren 的部落格

基於 Next.js 15 打造的靜態部落格，主要使用繁體中文撰寫，偶有少量英文與日文翻譯文章。

## 特色

- 📝 **靜態導出** - 完全靜態化的部落格，無需伺服器
- 🌓 **深色模式** - 支援淺色/深色主題切換
- 📱 **響應式設計** - 適應各種裝置尺寸
- 🔖 **多分類支援** - 技術 (tech)、生活 (life)
- 🌍 **多語言支援** - 支援繁體中文、日文、英文的文章翻譯與 UI 多語化
- 🌐 **多語言 RSS** - 自動產生繁體中文、英文、日文的 RSS feeds
- ⚡ **效能優化** - 使用 Turbopack 加速開發體驗

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000) 即可看到網站。

### 建置

```bash
npm run build
```

建置過程會自動產生靜態網站與 RSS feeds。

### 其他指令

- `npm run start` - 啟動生產環境伺服器
- `npm run lint` - 執行 ESLint 檢查
- `npx tsx scripts/generate-rss.ts` - 手動產生 RSS feeds

## 專案架構

### 目錄結構

```
├── app/                       # Next.js App Router 頁面與元件
│   ├── [locale]/             # 多語言路由
│   │   ├── posts/[slug]/    # 動態文章路由
│   │   ├── tech/            # 技術分類頁面
│   │   └── life/            # 生活分類頁面
│   └── page.tsx             # 根路徑重定向
├── components/              # 共用元件
│   ├── LanguageSwitcher.tsx  # 語言切換器
│   └── ArticleLanguageIndicator.tsx  # 文章語言指示器
├── lib/                     # 核心邏輯
│   ├── i18n/               # 多語言設定
│   │   ├── locales.ts      # 語言定義
│   │   └── translations.ts # UI 翻譯字典
│   ├── posts.ts            # 文章管理（含快取機制）
│   ├── markdown.ts         # Markdown 轉 HTML
│   ├── image.ts            # 文章圖片擷取
│   └── rss.ts              # RSS feed 產生
├── public/
│   ├── posts/              # Markdown 文章內容（依日期命名）
│   │   └── [slug]/         # 文章目錄
│   │       ├── index.md    # 繁中原文（或 文章名.md）
│   │       ├── index.ja.md # 日文翻譯（選填）
│   │       └── index.en.md # 英文翻譯（選填）
│   └── pages/              # 靜態頁面（關於、訂閱等）
└── scripts/                # 建置腳本
```

### 技術棧

- **框架**: Next.js 15 (App Router)
- **樣式**: Tailwind CSS
- **圖示**: Tabler Icons, Lucide React
- **Markdown**: remark, rehype
- **語法高亮**: Shiki
- **RSS**: feed
- **主題**: next-themes

## 內容撰寫

### 文章格式

文章使用 Markdown 格式，存放於 `public/posts/` 目錄，檔名格式為 `YYYY-MM-DD_標題.md`。

範例：

```markdown
---
title: "文章標題"
date: "2024-01-01"
category: "tech"
cover: "/images/cover.jpg"
description: "SEO 描述"
---

這裡是文章內容...
```

### Frontmatter 欄位

- `title` - 文章標題（選填，預設從檔名推斷）
- `date` - 發布日期（選填，預設從檔名推斷）
- `category` - 分類：`tech` 或 `life`（預設為 `tech`）
- `cover` - 封面圖片路徑（選填，預設使用文章中第一張圖片）
- `description` - SEO 描述（選填）

### 分類說明

- **tech** - 技術文章
- **life** - 生活隨筆

### 多語言翻譯

部落格支援文章的多語言翻譯功能，採用檔案命名規範來識別語言版本。

#### 支援的語言

- **繁體中文** (`zh`) - 主要語言，預設
- **日文** (`ja`) - 翻譯文章
- **英文** (`en`) - 翻譯文章

#### 新增翻譯文章

1. 在文章目錄中建立對應語言的檔案：
   - 日文翻譯：`index.ja.md` 或 `文章名.ja.md`
   - 英文翻譯：`index.en.md` 或 `文章名.en.md`

2. 翻譯文章只需包含翻譯內容，**不需要** frontmatter：
   ```markdown
   這是翻譯後的文章內容...
   ```

3. 所有 metadata（標題、日期、分類等）會自動從主文章繼承

4. 建置後，翻譯版本會自動出現在對應語言的文章列表中

#### 語言路由結構

- `/zh/` - 繁體中文首頁（預設）
- `/ja/` - 日文首頁
- `/en/` - 英文首頁
- `/zh/posts/[slug]` - 繁體中文文章
- `/ja/posts/[slug]` - 日文翻譯文章
- `/en/posts/[slug]` - 英文翻譯文章

#### RSS 訂閱

每個語言都有獨立的 RSS feed：

- `/rss/zh.xml` - 繁體中文所有文章
- `/rss/ja.xml` - 日文翻譯文章
- `/rss/en.xml` - 英文翻譯文章
- `/rss/zh/tech.xml` - 繁體中文技術文章
- `/rss/ja/tech.xml` - 日文技術翻譯文章
- 以此類推...

## 網站設定

- **主要語言**: 繁體中文 (zh-Hant-TW)，支援日文、英文翻譯
- **網址**: https://yurenju.blog
- **作者**: Yuren
- **主題**: 支援淺色/深色模式，跟隨系統偏好

## 授權

此專案為個人部落格，內容版權歸作者所有。
