# PRD: Next.js 部落格多語言功能實作

**版本：** 1.0
**日期：** 2025-10-09
**狀態：** Draft

## 簡介/概述

本 PRD 描述為 Yuren's Blog 加入多語言支援功能的完整實作計畫。基於 `docs/research/2025-10-09-multilingual-blog-implementation.md` 的研究發現，我們將採用輕量級自訂實作方案（方案二），以保持專案架構的簡潔性，同時滿足多語言內容展示的需求。

Yuren's Blog 是一個以繁體中文為主的靜態部落格，目前有大量中文文章。隨著內容的擴展，部分文章需要翻譯成日文和英文。此功能的目標不是建立完整的多語言網站，而是支援「主要語言 + 部分翻譯」的混合模式。例如，網站可能有 100 篇中文文章，但只有 3 篇日文翻譯和 1 篇英文翻譯。

此功能將分四個階段實作：核心多語言架構、文章語言支援、UI 多語言化、以及 RSS 與 SEO 優化。所有實作都必須與 Next.js 15 的靜態導出模式（`output: "export"`）完全相容。

## 目標

1. **支援多語言路由**：實作語言前綴路由（`/zh/`、`/ja/`、`/en/`），繁體中文為預設語言
2. **文章語言識別**：透過檔案命名規範自動識別文章語言版本，無需修改現有文章
3. **語言特定內容過濾**：在文章列表頁面只顯示當前語言的文章，並提示使用者中文版有更多內容
4. **完整的 UI 多語言化**：翻譯所有介面元素，包括導航、標題、日期格式和提示訊息
5. **語言切換體驗**：提供直觀的語言切換器，並在文章頁面顯示可用的其他語言版本
6. **多語言 RSS 支援**：為每個語言和分類組合產生獨立的 RSS feed
7. **SEO 優化**：加入 hreflang 標籤，確保搜尋引擎正確索引多語言內容
8. **保持效能**：建置時間增加不超過 50%，bundle size 增加少於 10KB

## 使用者故事

### 故事 1：日文讀者發現翻譯文章
**作為** 日文讀者
**我想要** 切換到日文版網站
**以便** 閱讀我能理解的語言的文章

**驗收標準：**
- 點擊導航列的「日本語」按鈕後，URL 變更為 `/ja/`
- 文章列表只顯示有日文翻譯的文章（例如 3 篇）
- 列表下方顯示提示：「本站主要以繁體中文撰寫。切換到中文版可瀏覽全部 100 篇文章。」
- 所有 UI 元素（導航、標題等）都以日文顯示

### 故事 2：讀者在文章頁面切換語言版本
**作為** 讀者
**我想要** 在閱讀文章時看到其他可用的語言版本
**以便** 根據需要切換到其他語言閱讀同一篇文章

**驗收標準：**
- 在文章標題下方顯著位置看到「Also available in: [日本語] [English]」連結
- 點擊連結後跳轉到對應語言版本的同一篇文章
- 如果當前文章沒有其他語言版本，不顯示此區塊

### 故事 3：讀者訂閱特定語言的 RSS
**作為** RSS 訂閱者
**我想要** 訂閱日文版的技術文章 RSS
**以便** 只收到我能閱讀的語言的更新通知

**驗收標準：**
- 可以存取 `/rss/ja/tech.xml` 取得日文技術文章的 RSS feed
- 可以存取 `/rss/ja.xml` 取得所有日文文章的 RSS feed
- RSS feed 只包含該語言的文章，不包含其他語言

### 故事 4：作者新增文章翻譯
**作為** 部落格作者
**我想要** 為現有文章加入日文翻譯
**以便** 讓日文讀者也能閱讀該內容

**驗收標準：**
- 在文章目錄中建立 `index.ja.md` 檔案
- 翻譯文章不需要完整的 frontmatter，只需要翻譯的內容
- 建置後，日文版文章列表會自動顯示此文章
- 原始中文文章和日文翻譯會自動關聯

## 功能需求

### 第一階段：核心多語言架構

#### FR-1.1 語言定義與配置
系統必須在 `lib/i18n/locales.ts` 中定義支援的語言清單：
- 支援的語言：繁體中文（`zh`）、日文（`ja`）、英文（`en`）
- 預設語言為繁體中文（`zh`）
- 提供型別定義：`export type Locale = 'zh' | 'ja' | 'en'`

#### FR-1.2 語言路由結構
系統必須實作基於語言前綴的路由：
- 建立 `app/[locale]/` 動態路由資料夾
- 將現有的所有頁面（`page.tsx`、`layout.tsx`）移動到 `app/[locale]/` 下
- 支援的路由格式：
  - `/zh/` - 繁體中文首頁
  - `/ja/posts/2024-01-01_article` - 日文文章頁面
  - `/en/tech` - 英文技術分類頁面

#### FR-1.3 根路徑重新導向
系統必須將根路徑 `/` 自動重新導向到預設語言 `/zh/`：
- 在 `app/page.tsx` 中實作重新導向邏輯
- 使用 Next.js 的 `redirect()` 函式
- 重新導向必須在靜態導出時正確運作

#### FR-1.4 靜態參數產生
系統必須為所有支援的語言產生靜態頁面：
- 在 `app/[locale]/layout.tsx` 中實作 `generateStaticParams()`
- 返回所有支援的語言代碼：`[{locale: 'zh'}, {locale: 'ja'}, {locale: 'en'}]`
- 確保建置時為每個語言產生獨立的靜態頁面

#### FR-1.5 翻譯字典系統
系統必須建立簡單的翻譯字典來管理 UI 文字：
- 在 `lib/i18n/translations.ts` 中定義翻譯物件
- 結構範例：
  ```typescript
  export const translations = {
    zh: {
      nav: { home: '首頁', about: '關於', subscription: '訂閱', allPosts: '全部文章' },
      categories: { tech: '技術', life: '生活', shorts: '照片' },
      post: { writtenBy: '撰於' },
      languageNames: { zh: '繁體中文', ja: '日本語', en: 'English' },
      // ... 其他翻譯
    },
    ja: {
      nav: { home: 'ホーム', about: '概要', subscription: '購読', allPosts: 'すべての記事' },
      post: { writtenBy: '' },
      languageNames: { zh: '繁體中文', ja: '日本語', en: 'English' },
      // ... 日文翻譯
    },
    en: {
      nav: { home: 'Home', about: 'About', subscription: 'Subscribe', allPosts: 'All Posts' },
      post: { writtenBy: 'Written on' },
      languageNames: { zh: '繁體中文', ja: '日本語', en: 'English' },
      // ... 英文翻譯
    }
  }
  ```

#### FR-1.6 翻譯存取函式
系統必須提供便利的函式來存取翻譯：
- 建立 `getTranslation(locale: Locale)` 函式
- 返回指定語言的完整翻譯物件
- 提供型別安全的存取方式

### 第二階段：文章語言支援

#### FR-2.1 檔案命名規範
系統必須支援以下檔案命名規範來識別語言：
- 無語言後綴（`index.md`、`文章標題.md`）：視為繁體中文（`zh`）
- 日文後綴（`index.ja.md`、`文章標題.ja.md`）：視為日文（`ja`）
- 英文後綴（`index.en.md`、`文章標題.en.md`）：視為英文（`en`）
- 檔案命名格式：`<basename>.<locale>.md` 或 `<basename>.md`

#### FR-2.2 文章語言識別邏輯
系統必須在 `lib/posts.ts` 中實作語言識別函式：
- 建立 `extractLocaleFromFilename(filename: string): Locale` 函式
- 從檔案名稱提取語言代碼，若無後綴則返回 `'zh'`
- 範例：
  - `index.md` → `'zh'`
  - `index.ja.md` → `'ja'`
  - `article.en.md` → `'en'`

#### FR-2.3 擴展 PostData 型別
系統必須擴展 `PostData` 型別以支援語言資訊：
```typescript
export type PostData = {
  // ... 現有欄位
  locale: Locale;
  availableLocales: Locale[];
}
```
- `locale`: 當前文章的語言
- `availableLocales`: 此文章可用的所有語言版本（所有語言版本使用相同的 slug）

#### FR-2.4 文章語言關聯邏輯
系統必須自動關聯同一篇文章的不同語言版本：
- 建立 `findTranslations(postSlug: string, locale: Locale)` 函式
- 基於相同的基礎 slug 和日期前綴來識別翻譯版本
- 範例：
  - `2024-01-01_article` 目錄下的 `index.md`、`index.ja.md`、`index.en.md` 應該被識別為同一篇文章的三個版本

#### FR-2.5 語言過濾函式
系統必須實作文章語言過濾功能：
- 建立 `getPostsByLocale(locale: Locale): Promise<PostData[]>` 函式
- 只返回指定語言的文章
- 保持現有的日期排序（由新到舊）

#### FR-2.6 分類語言過濾函式
系統必須擴展 `fetchCategoryPosts` 以支援語言過濾：
- 修改函式簽章：`fetchCategoryPosts(category: Category, locale: Locale)`
- 只返回指定語言和分類的文章

#### FR-2.7 文章統計功能
系統必須提供文章數量統計功能：
- 建立 `getPostCountByLocale(locale: Locale): Promise<number>` 函式
- 返回指定語言的文章總數
- 用於顯示提示訊息（如「中文版有 100 篇文章」）

#### FR-2.8 翻譯文章的 Frontmatter 限制
系統必須確保翻譯文章不包含完整的 frontmatter：
- 翻譯文章（`*.ja.md`、`*.en.md`）只包含翻譯的內容
- 所有 metadata（標題、日期、分類等）都從主文章（無語言後綴）繼承
- 主文章的 frontmatter 不需要新增 `locale` 或 `translations` 欄位

#### FR-2.9 文章列表語言提示
系統必須在文章列表頁面顯示語言提示：
- 當使用者檢視非中文版本的文章列表時（`/ja/posts` 或 `/en/posts`）
- 在文章列表下方顯示提示區塊
- 提示內容包含：
  - 說明本站主要以繁體中文撰寫
  - 顯示中文版的文章總數
  - 提供切換到中文版的連結
- 提示文字範例：
  ```
  本站主要以繁體中文撰寫，目前有 [數量] 篇文章。
  切換到中文版以瀏覽所有內容。
  ```

### 第三階段：UI 多語言化

#### FR-3.1 導航列多語言化
系統必須將導航列（`app/components/Navbar.tsx`）中的所有文字翻譯：
- 「首頁」、「關於」、「訂閱」、「全部文章」
- 根據當前 locale 顯示對應語言
- 保持連結的 locale 前綴（例如：`/ja/about`）

#### FR-3.2 語言切換器元件
系統必須建立語言切換器元件（`app/components/LanguageSwitcher.tsx`）：
- 顯示所有支援的語言：「中文」、「日本語」、「English」
- 當前語言以粗體或特殊樣式標示
- 點擊語言時切換到對應的語言版本
- 在導航列中整合語言切換器（放在主題切換按鈕旁邊）

#### FR-3.3 語言切換邏輯
語言切換必須保持當前頁面的上下文：
- 首頁：`/zh/` → `/ja/`
- 分類頁面：`/zh/tech` → `/ja/tech`
- 文章頁面：`/zh/posts/[slug]` → `/ja/posts/[slug]`（如果存在該語言版本）
- 如果目標語言版本不存在，導向該語言的首頁

#### FR-3.4 首頁多語言化
系統必須翻譯首頁（`app/[locale]/page.tsx`）的所有文字：
- 網站標題和描述
- 分類連結（「照片」、「生活」、「技術」）
- 使用翻譯字典提供的文字

#### FR-3.5 文章列表頁面多語言化
系統必須翻譯文章列表相關的所有文字：
- 頁面標題（「全部文章」、「科技」、「生活」、「照片」）
- 年份顯示格式（「2024 年」、「2024年」、「2024」）
- aria-label 文字（「閱讀文章：...」）
- 修改 `app/components/PostsList.tsx` 接受 locale 參數

#### FR-3.6 文章頁面多語言化
系統必須翻譯文章頁面（`app/[locale]/posts/[slug]/page.tsx`）的文字：
- 作者署名格式：「⸺ Yuren 撰於 2024 年 1 月 1 日」
- 日期格式根據語言調整：
  - 中文：「2024 年 1 月 1 日」
  - 日文：「2024年1月1日」
  - 英文：「January 1, 2024」

#### FR-3.7 文章語言版本指示器
系統必須在文章頁面顯示可用的其他語言版本：
- 建立 `app/components/ArticleLanguageIndicator.tsx` 元件
- 在文章標題下方顯著位置顯示
- 顯示格式：「Also available in: [繁體中文](/zh/posts/[slug]) [日本語](/ja/posts/[slug]) [English](/en/posts/[slug])」
- 「Also available in:」文字固定使用英文，不需要進入翻譯系統
- 語言名稱使用各語言的本地名稱：
  - 繁體中文：「繁體中文」
  - 日文：「日本語」
  - 英文：「English」
- 只顯示實際存在的語言版本
- 當前語言不顯示為連結

#### FR-3.8 日期格式化
系統必須擴展 `lib/utils.ts` 中的 `formatDate` 函式：
- 接受 `locale` 參數
- 根據不同語言返回正確的日期格式
- 範例：
  ```typescript
  formatDate('2024-01-01', { locale: 'zh', withYear: true }) // '2024 年 1 月 1 日'
  formatDate('2024-01-01', { locale: 'ja', withYear: true }) // '2024年1月1日'
  formatDate('2024-01-01', { locale: 'en', withYear: true }) // 'January 1, 2024'
  ```

#### FR-3.9 Metadata 多語言化
系統必須為每個語言版本產生正確的 metadata：
- 頁面標題（`<title>`）使用對應語言
- `lang` 屬性根據 locale 設定（`zh-Hant-TW`、`ja`、`en`）
- OpenGraph 和 Twitter Card 使用對應語言的描述

### 第四階段：RSS 與 SEO

#### FR-4.1 擴展 RSS 產生腳本
系統必須修改 `scripts/generate-rss.ts` 以支援多語言：
- 為每個語言和分類組合產生 RSS feed
- 產生全語言的 RSS feed（每個語言一個總 feed）

#### FR-4.2 RSS Feed 路徑結構
系統必須產生以下 RSS feed：
- 語言特定的分類 feed：
  - `/rss/zh/tech.xml` - 繁體中文技術文章
  - `/rss/ja/life.xml` - 日文生活文章
  - `/rss/en/shorts.xml` - 英文照片文章
- 語言特定的總 feed：
  - `/rss/zh.xml` - 所有繁體中文文章
  - `/rss/ja.xml` - 所有日文文章
  - `/rss/en.xml` - 所有英文文章
- 保留原有的全站 feed（`/rss.xml`），包含所有語言的文章

#### FR-4.3 RSS Feed 內容過濾
每個 RSS feed 必須只包含對應語言的文章：
- 擴展 `lib/rss.ts` 中的 `generateRSSFeed` 函式
- 接受 `locale` 參數
- 過濾並只包含指定語言的文章

#### FR-4.4 RSS Feed Metadata
RSS feed 的 metadata 必須使用對應語言：
- Feed 標題：使用對應語言的翻譯（例如：「Yuren's Blog - 技術」、「Yuren's Blog - 技術」）
- Feed 描述：使用對應語言
- 文章標題和描述保持原始語言

#### FR-4.5 hreflang 標籤實作
系統必須在所有頁面加入 hreflang 標籤：
- 在 `app/[locale]/layout.tsx` 的 metadata 中加入 `alternates.languages`
- 為每個可用的語言版本加入 hreflang 標籤
- 範例：
  ```html
  <link rel="alternate" hreflang="zh-Hant" href="https://yurenju.blog/zh/posts/article" />
  <link rel="alternate" hreflang="ja" href="https://yurenju.blog/ja/posts/article" />
  <link rel="alternate" hreflang="en" href="https://yurenju.blog/en/posts/article" />
  <link rel="alternate" hreflang="x-default" href="https://yurenju.blog/zh/posts/article" />
  ```

#### FR-4.6 文章頁面動態 hreflang
文章頁面的 hreflang 標籤必須根據實際可用的翻譯動態產生：
- 只為實際存在的語言版本加入 hreflang 標籤
- 使用文章的 `availableLocales` 資訊
- 在 `generateMetadata` 函式中實作

#### FR-4.7 Sitemap 多語言支援（選擇性）
系統應該考慮為每個語言版本產生獨立的 sitemap：
- `/sitemap-zh.xml` - 繁體中文頁面
- `/sitemap-ja.xml` - 日文頁面
- `/sitemap-en.xml` - 英文頁面
- 主 sitemap 包含所有語言版本的連結

#### FR-4.8 建置效能測試
系統必須確保建置效能在可接受範圍內：
- 測量實作前後的建置時間
- 建置時間增加不得超過 50%
- 若超過，需要優化快取或並行處理策略

## 非目標（超出範圍）

1. **自動語言偵測**：不會根據瀏覽器語言設定自動切換語言（未來可能加入）
2. **即時翻譯**：不提供自動機器翻譯功能，所有翻譯都需要手動建立
3. **使用者語言偏好記憶**：不使用 cookies 或 localStorage 記住使用者的語言選擇（未來可能加入）
4. **搜尋功能多語言化**：目前沒有搜尋功能，不在此版本處理
5. **留言系統多語言化**：如果未來加入留言功能，其多語言支援不在此版本範圍
6. **語言混合內容**：不支援在同一頁面顯示多種語言的文章列表
7. **翻譯進度管理**：不提供翻譯進度追蹤或管理介面
8. **RTL 語言支援**：不支援從右到左（RTL）的語言，如阿拉伯文或希伯來文

## 設計考量

### UI/UX 設計

#### 語言切換器設計
- **位置**：導航列右側，主題切換按鈕旁邊
- **樣式**：與其他導航連結保持一致的 `function-link` 樣式
- **顯示方式**：用分隔符號（•）分隔各語言，當前語言以粗體顯示
- **互動回饋**：hover 時與其他連結相同的樣式變化

#### 文章語言指示器設計
- **位置**：文章標題下方，日期上方
- **樣式**：使用較小的字體（`text-sm`），顏色為次要文字色（`text-gray-600`）
- **格式**：「Also available in: [繁體中文] [日本語] [English]」，連結使用 `text-blue-600`

#### 語言提示訊息設計
- **位置**：文章列表下方，與列表有適當間距
- **樣式**：使用資訊提示框樣式（淡藍色背景，圓角，適當的 padding）
- **內容**：清楚說明網站的語言分布，提供切換連結

### 無障礙考量
- 所有語言切換連結都有適當的 aria-label
- 保持現有的鍵盤導航支援
- 確保語言指示器的對比度符合 WCAG 標準

### 響應式設計
- 語言切換器在小螢幕上仍然可見且易於點擊
- 文章語言指示器在行動裝置上自動換行
- 語言提示訊息在小螢幕上保持可讀性

## 技術考量

### 架構決策

1. **不使用外部 i18n 函式庫**：基於研究結果，採用自訂實作以保持專案簡潔性
2. **檔案命名規範識別語言**：不在 frontmatter 中儲存語言資訊，透過檔案名稱自動識別
3. **靜態導出相容性**：所有實作都必須與 `output: "export"` 模式相容，不使用 middleware
4. **向後相容性**：現有文章不需要任何修改，自動視為繁體中文

### 技術限制

1. **靜態導出限制**：
   - 無法使用 Next.js middleware 進行語言偵測或重新導向
   - 所有語言路由必須在建置時產生
   - 根路徑重新導向需要使用客戶端或靜態 HTML 重新導向

2. **建置效能**：
   - 每增加一個語言版本，靜態頁面數量會倍增
   - 需要注意文章數量多時的建置時間
   - 可能需要實作智慧快取機制

3. **型別安全**：
   - 所有語言相關的程式碼都應該有完整的 TypeScript 型別定義
   - 翻譯字典應該有型別檢查，避免遺漏翻譯

### 相依性

1. **現有系統**：
   - 依賴 `lib/posts.ts` 的文章管理系統
   - 依賴 `lib/markdown.ts` 的 markdown 處理
   - 依賴 `lib/rss.ts` 的 RSS 產生功能
   - 依賴 `lib/siteConfig.ts` 的網站配置

2. **新增檔案**：
   - `lib/i18n/locales.ts` - 語言定義
   - `lib/i18n/translations.ts` - 翻譯字典
   - `app/components/LanguageSwitcher.tsx` - 語言切換器
   - `app/components/ArticleLanguageIndicator.tsx` - 文章語言指示器

3. **修改檔案**：
   - 所有現有頁面需要移動到 `app/[locale]/` 下
   - `lib/posts.ts` 需要擴展以支援語言識別和過濾
   - `scripts/generate-rss.ts` 需要擴展以支援多語言

### 測試策略

1. **單元測試**：
   - 語言識別函式（`extractLocaleFromFilename`）
   - 文章過濾函式（`getPostsByLocale`）
   - 翻譯關聯函式（`findTranslations`）
   - 日期格式化函式

2. **整合測試**：
   - 建立測試文章，包含中文、日文、英文版本
   - 測試語言切換是否正確導向
   - 測試文章列表是否正確過濾
   - 測試 RSS feed 是否正確產生

3. **建置測試**：
   - 驗證所有語言版本的靜態頁面都正確產生
   - 檢查產生的 HTML 中的 hreflang 標籤
   - 驗證 RSS feed 檔案都存在且內容正確
   - 測量建置時間和 bundle size

4. **手動測試檢查清單**：
   - [ ] 根路徑 `/` 重新導向到 `/zh/`
   - [ ] 語言切換器在所有頁面都正常運作
   - [ ] 日文版文章列表只顯示日文文章
   - [ ] 英文版文章列表只顯示英文文章
   - [ ] 文章頁面顯示正確的其他語言版本連結
   - [ ] 語言提示訊息在非中文版本正確顯示
   - [ ] 所有 UI 元素都正確翻譯
   - [ ] 日期格式在不同語言下正確顯示
   - [ ] RSS feeds 正確產生且內容正確過濾
   - [ ] SEO 標籤（hreflang）正確設定

## 實作階段規劃

### 第一階段：核心多語言架構（1-2 天）

**目標**：建立多語言路由和翻譯系統基礎

**任務清單**：
1. 建立 `lib/i18n/locales.ts` 和 `lib/i18n/translations.ts`
2. 建立 `app/[locale]/` 目錄結構
3. 移動現有頁面到 `app/[locale]/` 下
4. 實作 `app/page.tsx` 的重新導向邏輯
5. 在 `app/[locale]/layout.tsx` 加入 `generateStaticParams()`
6. 實作 `getTranslation()` 函式
7. 測試建置是否正確產生三個語言版本的靜態頁面

**驗收標準**：
- 存取 `/` 自動重新導向到 `/zh/`
- 可以手動存取 `/zh/`、`/ja/`、`/en/`
- 建置產生所有語言版本的靜態頁面
- 翻譯系統可以正確返回對應語言的文字

### 第二階段：文章語言支援（1-2 天）

**目標**：實作文章語言識別、過濾和關聯功能

**任務清單**：
1. 實作 `extractLocaleFromFilename()` 函式
2. 擴展 `PostData` 型別定義
3. 修改 `getPostData()` 以加入語言資訊
4. 實作 `findTranslations()` 函式
5. 實作 `getPostsByLocale()` 函式
6. 修改 `fetchCategoryPosts()` 加入 locale 參數
7. 實作 `getPostCountByLocale()` 函式
8. 更新文章列表頁面使用語言過濾
9. 加入語言提示訊息元件
10. 建立測試文章驗證功能

**驗收標準**：
- 系統能正確識別 `index.md`、`index.ja.md`、`index.en.md` 的語言
- 日文版文章列表只顯示日文文章
- 英文版文章列表只顯示英文文章
- 非中文版本顯示正確的文章統計提示
- 同一篇文章的不同語言版本正確關聯

### 第三階段：UI 多語言化（1 天）

**目標**：翻譯所有介面元素並實作語言切換功能

**任務清單**：
1. 完成所有 UI 元素的翻譯字典
2. 實作 `LanguageSwitcher` 元件
3. 更新 `Navbar` 整合語言切換器
4. 實作 `ArticleLanguageIndicator` 元件
5. 更新首頁使用翻譯
6. 更新文章列表頁面使用翻譯
7. 更新文章頁面使用翻譯
8. 擴展 `formatDate()` 支援多語言
9. 更新 metadata 使用對應語言
10. 測試所有頁面的翻譯正確性

**驗收標準**：
- 語言切換器在導航列正確顯示
- 點擊語言切換後正確切換頁面
- 所有 UI 元素在不同語言下正確翻譯
- 文章頁面顯示可用的其他語言版本
- 日期格式在不同語言下正確顯示
- 頁面 metadata 使用對應語言

### 第四階段：RSS 與 SEO（1 天）

**目標**：實作多語言 RSS feeds 和 SEO 優化

**任務清單**：
1. 修改 `scripts/generate-rss.ts` 支援語言參數
2. 擴展 `generateRSSFeed()` 接受 locale 參數
3. 實作語言特定 RSS feeds 產生邏輯
4. 實作 RSS feed 內容過濾
5. 在 `app/[locale]/layout.tsx` 加入 hreflang 標籤
6. 在文章頁面的 `generateMetadata()` 加入動態 hreflang
7. 測試所有 RSS feeds 正確產生
8. 驗證 hreflang 標籤正確設定
9. 測量建置時間和效能
10. 產生完整的測試報告

**驗收標準**：
- 所有語言和分類組合的 RSS feeds 都正確產生
- 每個 RSS feed 只包含對應語言的文章
- 所有頁面都有正確的 hreflang 標籤
- 文章頁面的 hreflang 根據可用翻譯動態產生
- 建置時間增加不超過 50%
- 所有測試都通過

## 開放問題

1. **語言代碼一致性**：
   - 需要確認 `zh-Hant-TW` 和 `zh` 的使用場景
   - HTML lang 屬性使用 `zh-Hant-TW`
   - 內部 locale 代碼使用 `zh`
   - hreflang 標籤使用 `zh-Hant`

2. **根路徑重新導向**：
   - 靜態導出模式下，根路徑重新導向可能需要使用 `meta refresh` 或客戶端重新導向
   - 需要驗證 SEO 影響

3. **建置優化**：
   - 如果文章數量增加到數百篇，建置時間可能需要優化
   - 可能需要實作增量建置或智慧快取

4. **404 頁面**：
   - 需要確認 404 頁面是否也要多語言化
   - 404 頁面如何偵測應該顯示哪個語言

5. **翻譯字典管理**：
   - 隨著翻譯內容增加，可能需要考慮將翻譯字典分割成多個檔案
   - 是否需要工具來檢查翻譯完整性

## 成功指標

1. **功能完整性**：
   - 所有功能需求都已實作並通過測試
   - 所有驗收標準都達成

2. **效能指標**：
   - 建置時間增加 < 50%
   - Bundle size 增加 < 10KB
   - 首次載入時間維持不變

3. **程式碼品質**：
   - 所有新增程式碼都有 TypeScript 型別定義
   - 核心函式都有單元測試
   - 程式碼通過 ESLint 檢查

4. **使用者體驗**：
   - 語言切換流暢無延遲
   - 所有 UI 元素翻譯正確且自然
   - 不同語言的使用者都能輕易找到內容

5. **SEO 最佳化**：
   - 所有頁面都有正確的 hreflang 標籤
   - 所有語言版本的 RSS feeds 都正確產生
   - 搜尋引擎能正確索引不同語言的內容

## 參考資料

1. **研究文件**：
   - [docs/research/2025-10-09-multilingual-blog-implementation.md](../research/2025-10-09-multilingual-blog-implementation.md)

2. **Next.js 文件**：
   - [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)
   - [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)
   - [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

3. **最佳實踐**：
   - [Google Search Central: Multilingual Websites](https://developers.google.com/search/blog/2010/03/working-with-multilingual-websites)
   - [hreflang Implementation Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)

4. **程式碼參考**：
   - [CLAUDE.md](../../CLAUDE.md) - 專案架構說明
   - 現有的 `lib/posts.ts` - 文章管理系統
   - 現有的 `scripts/generate-rss.ts` - RSS 產生腳本

---

**PRD 版本歷史**：
- v1.0 (2025-10-09): 初始版本，定義完整的四階段實作計畫
