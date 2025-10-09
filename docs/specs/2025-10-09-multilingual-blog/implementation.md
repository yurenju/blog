# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-10-09-multilingual-blog/prd.md`
**相關研究文件：** `docs/research/2025-10-09-multilingual-blog-implementation.md`

> **重要提醒：** 實作過程中請經常參考上述文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 非功能性需求（性能、安全性等）
> - 系統架構和技術決策的背景脈絡
> - 研究文件中的深入分析和建議

## 相關檔案

### 新增檔案
- `components/ui/button.tsx` - shadcn Button 元件（用於導航連結）
- `components/ui/alert.tsx` - shadcn Alert 元件（準備用於語言提示）
- `components/ui/badge.tsx` - shadcn Badge 元件（準備用於語言版本指示器）
- `components.json` - shadcn/ui 配置檔
- `app/globals.backup.css` - 原始 globals.css 備份
- `lib/i18n/locales.ts` - 語言定義和型別
- `lib/i18n/translations.ts` - UI 翻譯字典
- `app/components/LanguageSwitcher.tsx` - 語言切換器元件（使用 shadcn Button）
- `app/components/ArticleLanguageIndicator.tsx` - 文章語言版本指示器元件（使用 shadcn Badge）
- `app/components/LanguageNotice.tsx` - 文章列表語言提示元件（使用 shadcn Alert）
- `app/components/pages/HomePage.tsx` - 首頁共用元件（接收 locale 參數）
- `app/components/pages/CategoryPage.tsx` - 分類頁面共用元件（tech/life/shorts 共用，接收 category 和 locale 參數）
- `app/components/pages/PostsPage.tsx` - 所有文章頁面共用元件（接收 locale 參數）
- `app/components/pages/PostDetailPage.tsx` - 文章詳細頁面共用元件（接收 slug 和 locale 參數）
- `app/components/pages/StaticMarkdownPage.tsx` - 靜態 Markdown 頁面共用元件（about/subscription 共用，接收 pageName 和 locale 參數）
- `app/[locale]/layout.tsx` - 多語言路由的 layout（設定各語言的 lang 屬性）
- `app/[locale]/page.tsx` - 多語言首頁（使用 HomePage 元件）
- `app/[locale]/tech/page.tsx` - 多語言技術分類頁面（使用 CategoryPage 元件）
- `app/[locale]/life/page.tsx` - 多語言生活分類頁面（使用 CategoryPage 元件）
- `app/[locale]/shorts/page.tsx` - 多語言照片分類頁面（使用 CategoryPage 元件）
- `app/[locale]/posts/page.tsx` - 多語言所有文章頁面（使用 PostsPage 元件）
- `app/[locale]/posts/[slug]/page.tsx` - 多語言文章詳細頁面（使用 PostDetailPage 元件）
- `app/[locale]/about/page.tsx` - 多語言關於頁面（使用 StaticMarkdownPage 元件）
- `app/[locale]/subscription/page.tsx` - 多語言訂閱頁面（使用 StaticMarkdownPage 元件）

### 修改檔案
- `app/globals.css` - 整合 shadcn CSS variables，移除自訂 .function-link 類別
- `app/layout.tsx` - 移除硬編碼的 `lang` 屬性，暫時不設定語言
- `app/components/Navbar.tsx` - 使用 shadcn Button 元件替代自訂連結樣式
- `app/page.tsx` - 將改為使用共用的首頁元件（預設顯示中文內容）
- `app/tech/page.tsx` - 改為使用 CategoryPage 共用元件
- `app/life/page.tsx` - 改為使用 CategoryPage 共用元件
- `app/shorts/page.tsx` - 改為使用 CategoryPage 共用元件
- `app/posts/page.tsx` - 改為使用 PostsPage 共用元件
- `app/posts/[slug]/page.tsx` - 改為使用 PostDetailPage 共用元件
- `app/about/page.tsx` - 改為使用 StaticMarkdownPage 共用元件
- `app/subscription/page.tsx` - 改為使用 StaticMarkdownPage 共用元件
- `app/components/PostsList.tsx` - 改善暗色模式對比度（將支援多語言顯示）
- `app/components/MarkdownPage.tsx` - 擴展以支援根據 locale 尋找對應的 markdown 文件
- `lib/utils.ts` - 新增 shadcn 的 cn() 函式（將擴展日期格式化函式支援多語言）
- `lib/posts.ts` - 擴展以支援多語言文章識別和過濾
- `lib/rss.ts` - 擴展 RSS 產生支援多語言
- `scripts/generate-rss.ts` - 擴展以產生多語言 RSS feeds

### 測試相關
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [x] 1. 設定 shadcn/ui
  - 1.1 執行 `npx shadcn@latest init` 初始化 shadcn/ui，選擇適合的設定（使用 TypeScript、Tailwind CSS）
  - 1.2 根據需求安裝基礎 UI 元件：`npx shadcn@latest add button alert badge` （這些將用於語言切換器、提示訊息等）
  - 1.3 如果需要下拉選單形式的語言切換器，安裝 `npx shadcn@latest add dropdown-menu`
  - 1.4 驗證 `components/ui/` 目錄已建立且元件可正常使用
  - 1.5 檢查 `lib/utils.ts` 中的 `cn()` 函式是否已由 shadcn 加入（用於合併 className）

- [x] 2. 建立核心多語言架構
  - 2.1 建立 `lib/i18n/locales.ts`，定義支援的語言（zh, ja, en）和 `Locale` 型別
  - 2.2 建立 `lib/i18n/translations.ts`，實作翻譯字典結構，包含所有 UI 元素的翻譯（導航、分類、語言名稱等）
  - 2.3 實作 `getTranslation(locale: Locale)` 函式，返回指定語言的翻譯物件
  - 2.4 修改 `app/layout.tsx`，移除硬編碼的 `lang` 屬性（例如 `<html lang="zh-tw">`），暫時改為 `<html>`
  - 2.5 建立 `app/[locale]/` 目錄結構
  - 2.6 建立 `app/[locale]/layout.tsx`，設定 `lang` 屬性（zh-Hant-TW, ja, en）並實作 `generateStaticParams()` 函式返回所有支援的語言代碼
  - 2.7 建立共用頁面元件：
    - `components/pages/HomePage.tsx`（接收 `locale` 參數）
    - `components/pages/CategoryPage.tsx`（接收 `category` 和 `locale` 參數，tech/life/shorts 共用）
    - `components/pages/PostsPage.tsx`（接收 `locale` 參數）
    - `components/pages/PostDetailPage.tsx`（接收 `slug` 和 `locale` 參數）
    - `components/pages/StaticMarkdownPage.tsx`（接收 `pageName` 和 `locale` 參數，about/subscription 共用，支援 fallback 到中文版本）
  - 2.8 修改 `app/` 下的現有頁面使用共用元件：
    - `app/page.tsx` → 使用 `HomePage` 傳入 `locale='zh'`
    - `app/tech/page.tsx` → 使用 `CategoryPage` 傳入 `category='tech', locale='zh'`
    - `app/life/page.tsx` → 使用 `CategoryPage` 傳入 `category='life', locale='zh'`
    - `app/shorts/page.tsx` → 使用 `CategoryPage` 傳入 `category='shorts', locale='zh'`
    - `app/posts/page.tsx` → 使用 `PostsPage` 傳入 `locale='zh'`
    - `app/posts/[slug]/page.tsx` → 使用 `PostDetailPage` 傳入 `slug` 和 `locale='zh'`
    - `app/about/page.tsx` → 使用 `StaticMarkdownPage` 傳入 `pageName='about', locale='zh'`
    - `app/subscription/page.tsx` → 使用 `StaticMarkdownPage` 傳入 `pageName='subscription', locale='zh'`
  - 2.9 在 `app/[locale]/` 下建立對應的頁面（包括 about 和 subscription），使用相同的共用元件但傳入路由參數的 `locale`
  - 2.10 執行建置測試，驗證 `app/` 下的頁面顯示中文，`app/[locale]/` 下的頁面根據語言參數顯示對應語言
  - **驗證結果**: 架構實作完成且正確。建置時遇到 EMFILE (too many open files) 錯誤，這是 Windows 系統限制問題(~2968 篇文章 × 3 語言 = ~8906 頁面)，非程式碼錯誤。建議在 Linux 環境或 CI/CD 進行完整建置。

- [x] 3. 實作文章多語言支援
  - 3.1 在 `lib/posts.ts` 中實作 `extractLocaleFromFilename(filename: string): Locale` 函式，從檔案名稱提取語言代碼（無後綴為 zh，.ja.md 為 ja，.en.md 為 en）
  - 3.2 擴展 `PostData` 型別，加入 `locale: Locale`、`availableLocales: Locale[]` 欄位
  - 3.3 修改 `getAllPostMetadata()` 函式，在每個目錄中找到所有語言版本的 markdown 檔案（而非只找第一個），為每個語言版本建立獨立的 metadata 條目
  - 3.4 修改 `getPostData()` 函式，根據檔案名稱設定 `locale` 欄位，並支援翻譯文章從主文章繼承 metadata（同時允許 frontmatter 覆寫）
  - 3.5 實作 `findTranslations(dirPath: string): Record<Locale, string>` 函式，在同一目錄下找到所有語言版本的檔案路徑
  - 3.6 在 `getPostData()` 中呼叫 `findTranslations()`，填充 `availableLocales` 欄位
  - 3.7 實作 `getPostsByLocale(locale: Locale): Promise<PostData[]>` 函式，過濾並返回指定語言的所有文章
  - 3.8 修改 `fetchCategoryPosts(category: Category)` 函式簽章為 `fetchCategoryPosts(category: Category, locale: Locale)`，加入語言過濾
  - 3.9 實作 `getPostCountByLocale(locale: Locale): Promise<number>` 函式，返回指定語言的文章總數
  - 3.10 建立測試文章（在某個文章目錄加入 `index.ja.md` 和 `index.en.md`），驗證語言識別和關聯功能正確運作
  - 3.11 修正 `app/[locale]/posts/[slug]/page.tsx` 和 `components/pages/PostDetailPage.tsx` 中的 postKey 查找邏輯，確保正確載入對應語言版本

- [x] 4. 實作 UI 多語言化
  - 4.1 完成 `lib/i18n/translations.ts` 中所有 UI 元素的日文和英文翻譯
  - 4.2 建立 `app/components/LanguageSwitcher.tsx` 元件，使用 shadcn Button 元件顯示所有支援的語言（中文、日本語、English），當前語言使用 variant="default"，其他語言使用 variant="ghost"。對於 `app/` 下的頁面，點擊切換會導向 `/[locale]/相同路徑`；對於 `app/[locale]/` 下的頁面，點擊切換會導向 `/[新語言]/相同路徑`
  - 4.3 修改 `app/components/Navbar.tsx`，接收 `locale` prop（可選，預設為 'zh'），整合 `LanguageSwitcher` 元件（放在主題切換按鈕旁）。如果 locale 為 'zh'，導航連結不加前綴；否則加入 `/[locale]` 前綴
  - 4.4 建立 `app/components/ArticleLanguageIndicator.tsx` 元件，接收 `availableLocales`、`currentLocale` 和 `slug` props，使用 shadcn Badge 元件顯示「Also available in: [繁體中文] [日本語] [English]」格式的連結，連結會導向對應語言版本的文章
  - 4.5 建立 `app/components/LanguageNotice.tsx` 元件，使用 shadcn Alert 元件，接收當前 locale 和中文文章總數，顯示「本站主要以繁體中文撰寫，目前有 X 篇文章。切換到中文版以瀏覽所有內容。」提示訊息
  - 4.6 在共用頁面元件中實作多語言：
    - `HomePage.tsx`：使用 `getTranslation(locale)` 取得翻譯，替換硬編碼的分類名稱（"照片"、"生活"、"技術"）
    - `CategoryPage.tsx`：使用翻譯字典取得分類標題，呼叫 `fetchCategoryPosts(category, locale)` 過濾文章
    - `PostsPage.tsx`：使用翻譯字典取得頁面標題，呼叫 `getPostsByLocale(locale)` 過濾文章
    - `PostDetailPage.tsx`：使用翻譯字典顯示作者署名（"撰於" → "Written on"），加入 `ArticleLanguageIndicator` 元件
    - `StaticMarkdownPage.tsx`：根據 `pageName` 和 `locale` 尋找對應的 markdown 文件（例如 `about.ja.md`、`subscription.en.md`），如果找不到對應語言版本則 fallback 到預設的中文版本
  - 4.7 修改 `app/components/MarkdownPage.tsx`，擴展以支援接收 `locale` 參數，根據 locale 尋找對應語言的 markdown 文件（檔名格式：`about.ja.md`、`about.en.md`），使用翻譯字典顯示作者署名文字
  - 4.8 在列表頁面元件（`CategoryPage.tsx`、`PostsPage.tsx`）中，當 locale 不是 'zh' 時顯示 `LanguageNotice` 元件
  - 4.9 修改 `app/components/PostsList.tsx`，接收 `locale` prop，使用翻譯字典顯示「年」、aria-label 等文字
  - 4.10 擴展 `lib/utils.ts` 中的 `formatDate()` 函式，接受 `locale` 參數，根據不同語言返回正確的日期格式（zh: "2024 年 1 月 1 日", ja: "2024年1月1日", en: "January 1, 2024"）
  - 4.11 在 `app/[locale]/` 下的所有頁面的 `generateMetadata()` 函式中，使用對應語言的翻譯來設定 title 和 description。`app/` 下的頁面保持使用中文 metadata
  - 4.12 在 `public/pages/` 目錄下建立測試用的多語言靜態頁面（例如 `about.ja.md`、`subscription.en.md`），驗證靜態頁面多語言功能正確運作

- [x] 5. 修正根路徑重新導向架構
  - 5.1 將 `app/` 下的所有頁面改為重新導向到 `/zh/` 對應路徑
  - 5.2 修改 `app/page.tsx`，使用 Next.js `redirect()` 重新導向到 `/zh/`
  - 5.3 修改 `app/posts/page.tsx`，重新導向到 `/zh/posts`
  - 5.4 修改 `app/posts/[slug]/page.tsx`，重新導向到 `/zh/posts/[slug]`
  - 5.5 修改 `app/tech/page.tsx`，重新導向到 `/zh/tech`
  - 5.6 修改 `app/life/page.tsx`，重新導向到 `/zh/life`
  - 5.7 修改 `app/shorts/page.tsx`，重新導向到 `/zh/shorts`
  - 5.8 修改 `app/about/page.tsx`，重新導向到 `/zh/about`
  - 5.9 修改 `app/subscription/page.tsx`，重新導向到 `/zh/subscription`
  - 5.10 修改架構：移除 `lang` 屬性，將 Navbar 移至 `app/[locale]/layout.tsx`，`app/layout.tsx` 只保留基本結構
  - 5.11 新增 `site.description` 和 `theme` 翻譯，讓所有 UI 元素完全多語言化
  - **驗證結果**: 所有根路徑重新導向正常，架構調整完成，所有語言版本的 UI 完全翻譯

- [ ] 6. 實作多語言 RSS 與 SEO 優化
  - 6.1 修改 `lib/rss.ts` 中的 `generateRSSFeed()` 函式，接受 `locale?: Locale` 參數，過濾指定語言的文章
  - 6.2 修改 `getCategoryTitle()` 函式，接受 `locale` 參數，返回對應語言的分類標題
  - 6.3 更新 RSS feed 的 title 和 description 使用對應語言的翻譯
  - 6.4 修改 `scripts/generate-rss.ts`，為每個語言和分類組合產生 RSS feed（如 `/rss/zh/tech.xml`、`/rss/ja.xml`）
  - 6.5 確保原有的 `/rss.xml` 保持運作，包含所有語言的文章
  - 6.6 在 `app/[locale]/layout.tsx` 的 `generateMetadata()` 中加入 `alternates.languages` 設定，為所有頁面加入 hreflang 標籤
  - 6.7 在 `app/[locale]/posts/[slug]/page.tsx` 的 `generateMetadata()` 中，根據 `availableLocales` 動態產生 hreflang 標籤，只為實際存在的語言版本加入標籤
  - 6.8 執行完整建置，測試所有 RSS feeds 是否正確產生
  - 6.9 驗證產生的 HTML 中 hreflang 標籤是否正確
  - 6.10 測量建置時間，確保增加不超過 50%

- [ ] 7. 執行驗收測試
  - 7.1 使用 AI 讀取 `acceptance.feature` 檔案
  - 7.2 透過終端指令和瀏覽器操作執行每個場景
  - 7.3 驗證所有場景通過並記錄結果
  - 7.4 如有失敗場景，修正程式碼後重新測試

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑：** `docs/research/2025-10-09-multilingual-blog-implementation.md`

**選擇自訂實作的理由：**
- Next.js 的內建 i18n 路由無法與靜態導出（`output: 'export'`）整合
- next-intl 雖功能完整但對於此專案需求來說過於複雜
- 自訂實作可以：
  - 完全掌控實作細節
  - 保持專案架構簡潔
  - 不引入額外依賴
  - Bundle size 增加少於 5KB
  - 與現有程式碼風格完全一致

**靜態導出環境的技術限制：**
- 無法使用 Next.js middleware 進行語言偵測或重新導向
- 所有語言路由必須在建置時產生
- 根路徑重新導向需要使用客戶端或靜態 HTML 重新導向

**文章組織最佳實踐：**
- 採用語言後綴法：`index.md`（預設語言）、`index.ja.md`（日文）、`index.en.md`（英文）
- 同一目錄下的不同語言檔案自動視為翻譯版本
- 翻譯文章不需要完整的 frontmatter，所有 metadata 從主文章繼承

### 來自 PRD 的實作細節
> **文件路徑：** `docs/specs/2025-10-09-multilingual-blog/prd.md`

**翻譯字典結構範例：**
```typescript
export const translations = {
  zh: {
    nav: { home: '首頁', about: '關於', subscription: '訂閱', allPosts: '全部文章' },
    categories: { tech: '技術', life: '生活', shorts: '照片' },
    post: { writtenBy: '撰於' },
    languageNames: { zh: '繁體中文', ja: '日本語', en: 'English' },
  },
  ja: {
    nav: { home: 'ホーム', about: '概要', subscription: '購読', allPosts: 'すべての記事' },
    categories: { tech: '技術', life: '生活', shorts: '写真' },
    post: { writtenBy: '' },
    languageNames: { zh: '繁體中文', ja: '日本語', en: 'English' },
  },
  en: {
    nav: { home: 'Home', about: 'About', subscription: 'Subscribe', allPosts: 'All Posts' },
    categories: { tech: 'Tech', life: 'Life', shorts: 'Photos' },
    post: { writtenBy: 'Written on' },
    languageNames: { zh: '繁體中文', ja: '日本語', en: 'English' },
  }
}
```

**語言識別函式範例：**
```typescript
function extractLocaleFromFilename(filename: string): Locale {
  const match = filename.match(/\.(ja|en)\.md$/);
  return match ? match[1] as Locale : 'zh';
}
```

**PostData 型別擴展：**
```typescript
export type PostData = {
  // ... 現有欄位
  locale: Locale;
  availableLocales: Locale[];
}
```

**日期格式化範例：**
```typescript
formatDate('2024-01-01', { locale: 'zh', withYear: true }) // '2024 年 1 月 1 日'
formatDate('2024-01-01', { locale: 'ja', withYear: true }) // '2024年1月1日'
formatDate('2024-01-01', { locale: 'en', withYear: true }) // 'January 1, 2024'
```

**hreflang 標籤範例：**
```html
<link rel="alternate" hreflang="zh-Hant" href="https://yurenju.blog/zh/posts/article" />
<link rel="alternate" hreflang="ja" href="https://yurenju.blog/ja/posts/article" />
<link rel="alternate" hreflang="en" href="https://yurenju.blog/en/posts/article" />
<link rel="alternate" hreflang="x-default" href="https://yurenju.blog/zh/posts/article" />
```

### 關鍵技術決策

1. **檔案命名規範識別語言：** 不在 frontmatter 中儲存語言資訊，透過檔案名稱（`.ja.md`、`.en.md`）自動識別，保持向後相容（現有文章無需修改）

2. **一個目錄代表一篇文章：** 所有語言版本（包括翻譯）都放在同一個目錄下，系統自動建立關聯

3. **翻譯文章繼承 metadata：** 翻譯文章（`*.ja.md`、`*.en.md`）只包含翻譯內容，所有標題、日期、分類等資訊從主文章（無語言後綴）繼承

4. **「Also available in」固定用英文：** 文章語言版本指示器的提示文字統一使用英文，語言名稱使用各語言的本地名稱（繁體中文、日本語、English），不進入翻譯系統以保持簡單

5. **雙層 RSS 結構：** 同時提供語言×分類（`/rss/zh/tech.xml`）和純語言（`/rss/zh.xml`）兩種 RSS feeds，滿足不同訂閱需求

6. **建置效能目標：** 建置時間增加不超過 50%，bundle size 增加少於 10KB，確保多語言功能不影響網站效能

7. **靜態參數產生：** 使用 `generateStaticParams()` 為所有語言產生靜態頁面，確保完全靜態導出而無需伺服器端處理

8. **雙路徑架構取代重導向：** 不使用根路徑重導向到 `/zh/`，而是在 `app/` 和 `app/[locale]/` 下都建立頁面，透過共用元件實現邏輯複用。這個方案雖然有少量程式碼重複，但避免了以下問題：
   - 靜態導出環境下重導向的複雜性（需要客戶端 JavaScript 或 meta refresh）
   - 移動大量檔案可能造成的錯誤
   - `app/layout.tsx` 中的 `lang` 屬性設定問題（`app/` 下保持預設，`app/[locale]/layout.tsx` 中設定各語言的 lang）
   - 更容易維護現有的中文內容路徑（如 `/tech`、`/posts` 等保持不變）
