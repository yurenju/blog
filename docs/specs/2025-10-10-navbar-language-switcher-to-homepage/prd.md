# PRD: Navbar 語言切換器導向首頁

## 簡介/概述

本功能旨在改善部落格 Navbar 中語言切換器的使用者體驗，解決當使用者在沒有特定語言翻譯的文章頁面點擊語言切換器時，會導致 404 錯誤的問題。

基於 [docs/research/2025-10-10-language-switcher-ux-improvement.md](../../research/2025-10-10-language-switcher-ux-improvement.md) 的研究發現，我們將 Navbar 的 LanguageSwitcher 重新定位為「全站語言環境切換」功能。使用者點擊任何語言選項後，將直接導向該語言的首頁，而不是嘗試切換到當前頁面的對應語言版本。

這個設計與文章內的 ArticleLanguageIndicator 形成清楚的功能分層：
- **Navbar 語言切換器**：切換全站語言環境 → 導向目標語言首頁
- **ArticleLanguageIndicator**：切換文章語言版本 → 只顯示該文章已有的翻譯

## 目標

1. **消除 404 錯誤**：使用者點擊語言切換器後，永遠不會因為頁面不存在而看到 404 錯誤
2. **簡化使用者認知**：建立清楚的心智模型，Navbar 語言切換 = 切換網站語言環境
3. **降低維護成本**：實作邏輯簡單明確，不需要複雜的翻譯狀態檢測
4. **符合 UX 最佳實踐**：符合業界對多語言網站語言切換器的建議做法

## 使用者故事

### 故事 1：切換到有翻譯的文章
**身份**：日文讀者
**場景**：正在閱讀一篇有日文翻譯的文章（例如 `zh/posts/2025-09-27_牆上紙膠帶貼出的畫框`）
**動作**：點擊 Navbar 右上角的語言切換器，選擇「日本語」
**預期結果**：導向日文首頁 `/ja/`，而不是該文章的日文版
**效益**：使用者進入日文語言環境，可以瀏覽所有日文內容

### 故事 2：切換到沒有翻譯的文章
**身份**：日文讀者
**場景**：正在閱讀一篇沒有日文翻譯的文章（例如 `zh/posts/2024-12-31_完美的答案蘊含疑問`）
**動作**：點擊 Navbar 右上角的語言切換器，選擇「日本語」
**預期結果**：導向日文首頁 `/ja/`
**效益**：避免 404 錯誤，使用者可以從日文首頁探索其他日文內容

### 故事 3：在文章內切換語言版本
**身份**：雙語讀者
**場景**：正在閱讀一篇有日文翻譯的文章
**動作**：注意到文章內的 ArticleLanguageIndicator 顯示「Also available in: 日本語」，點擊該連結
**預期結果**：導向該文章的日文版本 `/ja/posts/2025-09-27_牆上紙膠帶貼出的畫框`
**效益**：可以閱讀同一篇文章的日文版本，保持閱讀情境

### 故事 4：從其他頁面切換語言
**身份**：英文讀者
**場景**：正在瀏覽「關於」頁面（`/zh/about`）
**動作**：點擊 Navbar 語言切換器，選擇「English」
**預期結果**：導向英文首頁 `/en/`
**效益**：切換到英文語言環境

## 功能需求

### FR-1：語言切換器導向首頁
**描述**：Navbar 的 LanguageSwitcher 元件點擊任何語言選項後，必須導向該語言的首頁。

**具體要求**：
- FR-1.1：點擊「繁體中文」導向 `/`（繁體中文是預設語言，無語言前綴）
- FR-1.2：點擊「日本語」導向 `/ja/`
- FR-1.3：點擊「English」導向 `/en/`
- FR-1.4：此行為在所有頁面（首頁、文章頁、列表頁、靜態頁）都一致

### FR-2：移除當前的路徑替換邏輯
**描述**：移除 LanguageSwitcher 中嘗試保留當前路徑並替換語言前綴的邏輯。

**具體要求**：
- FR-2.1：修改 `getLanguageUrl()` 函式，不再使用 `pathname` 進行路徑拼接
- FR-2.2：不再使用 `pathname.replace(/^\/(zh|ja|en)/, '')` 來去除語言前綴
- FR-2.3：簡化為只返回目標語言的首頁路徑

### FR-3：保持語言切換器的其他功能不變
**描述**：語言切換器的外觀、互動方式和其他功能保持不變。

**具體要求**：
- FR-3.1：下拉選單的樣式和行為不變
- FR-3.2：當前語言的粗體標示（`font-bold`）保持不變
- FR-3.3：語言名稱顯示（繁體中文、日本語、English）保持不變
- FR-3.4：使用 Next.js `<Link>` 元件進行導航，保持客戶端路由

### FR-4：ArticleLanguageIndicator 功能不受影響
**描述**：文章內的 ArticleLanguageIndicator 元件繼續提供文章特定的語言切換功能。

**具體要求**：
- FR-4.1：ArticleLanguageIndicator 的連結邏輯不變，仍然導向同一文章的其他語言版本
- FR-4.2：只顯示該文章實際存在的語言版本（基於 `availableLocales`）
- FR-4.3：功能與 Navbar 的 LanguageSwitcher 保持獨立

## 非目標（超出範圍）

以下項目**不在**本次功能範圍內：

1. **特殊的 404 頁面處理**：不需要為語言切換創建特殊的 404 頁面或錯誤處理機制
2. **查詢參數和 Hash 的保留**：不需要處理 URL 中的查詢參數（`?ref=source`）或 hash（`#section`），一律導向純淨的首頁路徑
3. **同語言點擊的特殊處理**：如果使用者在日文首頁點擊「日本語」，仍然會導向 `/ja/`（即重新載入當前頁面）
4. **ArticleLanguageIndicator 的優化**：不修改 ArticleLanguageIndicator 的文案或功能（雖然研究建議可以優化，但使用者認為當前版本已足夠）
5. **視覺反饋或載入提示**：不需要在語言切換時顯示載入動畫或過渡效果
6. **語言切換的確認對話框**：不需要在導向首頁前詢問使用者確認
7. **其他頁面類型的對應語言版本**：不嘗試將使用者導向靜態頁面（如 `/about`）的對應語言版本

## 設計考量

### UI/UX 不變
本次修改**不涉及任何視覺或互動設計的改變**。LanguageSwitcher 的外觀、位置、下拉選單樣式都保持原樣。

### 現有元件
- **修改元件**：`components/LanguageSwitcher.tsx`
- **保持不變**：`components/ArticleLanguageIndicator.tsx`、`components/Navbar.tsx`

## 技術考量

### 實作方式
修改 `components/LanguageSwitcher.tsx` 中的 `getLanguageUrl()` 函式：

**修改前**：
```typescript
const getLanguageUrl = (targetLocale: Locale) => {
  // If we're on app/ (no locale prefix), navigate to /[locale]/path
  if (!pathname.startsWith('/zh') && !pathname.startsWith('/ja') && !pathname.startsWith('/en')) {
    return `/${targetLocale}${pathname}`;
  }

  // If we're on app/[locale]/, switch locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(zh|ja|en)/, '');
  return targetLocale === 'zh' ? pathWithoutLocale || '/' : `/${targetLocale}${pathWithoutLocale || ''}`;
};
```

**修改後**：
```typescript
const getLanguageUrl = (targetLocale: Locale) => {
  return targetLocale === 'zh' ? '/' : `/${targetLocale}`;
};
```

### 技術相依性
- **Next.js Link 元件**：繼續使用 `next/link` 的 `<Link>` 元件進行客戶端路由
- **usePathname Hook**：修改後不再需要 `usePathname()`，可以移除該 import（但保留也無妨）
- **locale 類型**：繼續使用 `lib/i18n/locales` 中定義的 `Locale` 類型

### 向後相容性
此修改**完全向後相容**：
- 不影響現有的路由結構
- 不影響靜態頁面生成（`generateStaticParams()`）
- 不影響 SEO（`hreflang` 標籤由文章頁面的 `generateMetadata()` 管理）
- 不影響其他元件的功能

### 效能影響
**無負面影響**，反而可能有輕微改善：
- 移除了 `pathname` 的讀取和字串處理
- 邏輯更簡單，執行速度更快

## 驗收標準

### AC-1：Navbar 語言切換導向首頁
**測試步驟**：
1. 在任意頁面（首頁、文章頁、關於頁等）
2. 點擊 Navbar 右上角的語言切換器
3. 選擇任一語言

**預期結果**：
- 選擇「繁體中文」→ 導向 `/`
- 選擇「日本語」→ 導向 `/ja/`
- 選擇「English」→ 導向 `/en/`

### AC-2：ArticleLanguageIndicator 功能正常
**測試步驟**：
1. 開啟一篇有多語言翻譯的文章（例如 `/posts/2025-09-27_牆上紙膠帶貼出的畫框`）
2. 確認文章內顯示 ArticleLanguageIndicator（「Also available in: 日本語 English」）
3. 點擊其中一個語言連結（例如「日本語」）

**預期結果**：
- 導向該文章的日文版本 `/ja/posts/2025-09-27_牆上紙膠帶貼出的畫框`
- 文章內容切換為日文

### AC-3：沒有翻譯的文章不顯示 ArticleLanguageIndicator
**測試步驟**：
1. 開啟一篇只有中文版本的文章（例如 `/posts/2024-12-31_完美的答案蘊含疑問`）
2. 檢查文章內容

**預期結果**：
- 不顯示 ArticleLanguageIndicator（因為 `otherLocales.length === 0`）

### AC-4：當前語言標示正確
**測試步驟**：
1. 在繁體中文首頁 `/`，開啟 Navbar 語言切換器
2. 在日文首頁 `/ja/`，開啟 Navbar 語言切換器

**預期結果**：
- 在 `/` 時，「繁體中文」顯示為粗體（`font-bold`）
- 在 `/ja/` 時，「日本語」顯示為粗體

### AC-5：建構成功且無錯誤
**測試步驟**：
1. 執行 `npm run build`
2. 檢查建構輸出

**預期結果**：
- 建構成功，無 TypeScript 錯誤
- 所有靜態頁面正常生成
- 無 console 警告或錯誤

## 開放問題

目前無開放問題。所有需求已經明確定義。

## 參考資料

1. **研究文件**：[docs/research/2025-10-10-language-switcher-ux-improvement.md](../../research/2025-10-10-language-switcher-ux-improvement.md)
2. **相關元件**：
   - [components/LanguageSwitcher.tsx](../../../components/LanguageSwitcher.tsx) - 需要修改
   - [components/ArticleLanguageIndicator.tsx](../../../components/ArticleLanguageIndicator.tsx) - 參考用，不修改
   - [lib/i18n/locales.ts](../../../lib/i18n/locales.ts) - Locale 類型定義
3. **UX 最佳實踐**：
   - [Language switching UI/UX on multilingual sites](https://www.robertjelenic.com/language-switching-ui-ux-on-multilingual-sites/)
   - [Smartling - Language selector best practices](https://www.smartling.com/blog/language-selector-best-practices)
