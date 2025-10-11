# PRD: 國際化連結與導航改善

## 簡介/概述

本 PRD 旨在修正部落格系統中多個與國際化 (i18n) 相關的小問題，這些問題影響了使用者在多語言環境下的導航體驗。基於 `docs/research/2025-10-11-explicit-locale-in-links.md` 中的研究發現，我們識別出四個主要問題領域：

1. **LanguageNotice 元件缺少分類上下文感知**：元件無法根據當前瀏覽的分類（tech 或 life）提供正確的連結和文章數量
2. **連結缺少 locale 前綴**：導致不必要的重定向跳轉
3. **標點符號國際化問題**：英文和日文介面中出現中文標點符號
4. **LanguageSwitcher 無法保持路徑上下文**：切換語言時無法停留在相同類型的頁面

這些問題雖然都是小問題，但累積起來會顯著影響使用者體驗和網站的專業度。透過一次性修正這些問題，可以提供更流暢、更一致的多語言瀏覽體驗。

**解決方案策略**：採用研究報告中的方案 B（輕量級修正），使用 Next.js 原生 API，保持現有架構不變，專注於修正已識別的問題。

## 目標

1. **改善導航準確性**：使用者在非中文語言的分類頁面點擊「切換到中文版」時，能夠停留在相同的分類而非跳到全部文章列表
2. **提升資訊準確性**：LanguageNotice 顯示的文章數量應該反映當前分類的實際文章數，而非所有文章的總數
3. **消除重定向跳轉**：所有連結都應該包含正確的 locale 前綴，避免不必要的 301/302 重定向
4. **修正標點符號本地化**：確保每種語言使用正確的標點符號
5. **增強語言切換體驗**：使用者切換語言時能夠停留在相同類型的頁面（首頁、about、分類等）

## 使用者故事

### 故事 1: 分類頁面的語言切換
作為一個正在瀏覽日文技術文章列表的使用者，我看到網站主要內容是中文撰寫，當我點擊「切換到中文版」連結時，我希望能夠直接看到技術分類的中文文章列表，而不是所有文章的列表，這樣我才能保持瀏覽的上下文。

### 故事 2: 準確的文章數量資訊
作為一個正在瀏覽英文生活分類的使用者，我看到提示說「目前有 1479 篇文章」，但當我切換到中文後，我發現生活分類只有幾百篇文章，這讓我感到困惑。我希望看到的數字是該分類的實際文章數，而不是所有文章的總數。

### 故事 3: 流暢的頁面載入
作為一個使用非中文介面的使用者，當我點擊任何連結時，我希望能夠直接到達目標頁面，而不是先看到一個瞬間的跳轉頁面，這樣瀏覽體驗會更流暢。

### 故事 4: 專業的文字顯示
作為一個使用英文介面的使用者，我期望看到正確的英文標點符號（如 `.`），而不是中文的全形句號（`。`），這樣網站看起來更專業。

### 故事 5: 保持瀏覽上下文的語言切換
作為一個正在閱讀關於頁面的使用者，當我切換語言時，我希望能夠停留在關於頁面的對應語言版本，而不是被導向首頁，這樣我才不會失去瀏覽的上下文。

## 功能需求

### FR-1: LanguageNotice 元件增強

#### FR-1.1 分類上下文感知
- 元件必須接受一個可選的 `category` prop（型別為 `Category | undefined`）
- 當 `category` 為 `undefined` 時，表示在全部文章列表頁面
- 當 `category` 為 `'tech'` 或 `'life'` 時，表示在對應的分類頁面

#### FR-1.2 動態連結生成
- 元件必須根據 `category` prop 動態生成連結路徑：
  - 若 `category` 為 `'tech'`，連結應導向 `/zh/tech`
  - 若 `category` 為 `'life'`，連結應導向 `/zh/life`
  - 若 `category` 為 `undefined`，連結應導向 `/zh/posts`
- **重要設計原則**：所有內部連結都必須明確包含 locale 前綴，包括中文也要使用 `/zh/` 格式
- 不含 locale 的路徑（如 `/tech`、`/life`、`/posts`）僅用於重定向目的，不應出現在任何內部連結中

#### FR-1.3 精確的文章數量顯示
- 當在分類頁面時，顯示的文章數量必須是該分類的中文文章數
- 當在全部文章頁面時，顯示的文章數量必須是所有中文文章的總數

#### FR-1.4 標點符號國際化
- 元件必須根據當前 locale 使用正確的標點符號：
  - 中文 (`zh`) 和日文 (`ja`)：使用全形句號 `。`
  - 英文 (`en`)：使用英文句號 `.`

### FR-2: 資料層支援

#### FR-2.1 分類文章計數函式
- 必須在 `lib/posts.ts` 中新增 `getPostCountByCategoryAndLocale` 函式
- 函式簽章：`async function getPostCountByCategoryAndLocale(category: Category, locale: Locale): Promise<number>`
- 函式必須回傳指定分類和語言的文章數量
- 函式應該重用現有的 `fetchCategoryPosts` 函式以保持一致性

### FR-3: 頁面元件更新

#### FR-3.1 CategoryPage 元件
- 必須傳遞 `category` prop 給 `LanguageNotice` 元件
- 必須使用 `getPostCountByCategoryAndLocale('zh', category)` 取得該分類的中文文章數
- 必須將取得的文章數傳遞給 `LanguageNotice` 元件的 `chinesePostCount` prop

#### FR-3.2 PostsPage 元件
- 必須維持原有行為，不傳遞 `category` prop 給 `LanguageNotice` 元件
- 繼續使用 `getPostCountByLocale('zh')` 取得所有中文文章數

### FR-4: LanguageSwitcher 元件增強

#### FR-4.1 路徑保持機制
- 元件必須使用 Next.js 的 `usePathname()` hook 取得當前路徑
- 元件必須解析當前路徑並識別路徑類型（首頁、about、分類、文章詳情等）

#### FR-4.2 智慧型語言切換
- 對於首頁、about、subscription、分類頁面（tech、life）：切換語言時必須保持在相同類型的頁面
  - 例如：從 `/ja/about` 切換到英文時，應導向 `/en/about`
  - 例如：從 `/zh/tech` 切換到日文時，應導向 `/ja/tech`
- 對於文章詳情頁（`/posts/[slug]`）：切換語言時必須導向目標語言的首頁
  - 理由：文章可能沒有對應語言的翻譯版本

#### FR-4.3 Locale 前綴處理
- 切換後的連結必須正確處理 locale 前綴：
  - **所有語言**（包括中文）都必須包含明確的 locale 前綴
  - 切換到中文時，路徑應為 `/zh/about`、`/zh/tech` 等格式
  - 切換到其他語言時，路徑應為 `/ja/tech`、`/en/life` 等格式
- **設計原則**：所有內部連結都使用明確的 locale 路徑，不使用簡短路徑（如 `/about`、`/tech`）

## 非目標（超出範圍）

1. **引入新的 i18n 套件**：不引入 next-intl 或類似的第三方套件
2. **大規模重構**：不改變現有的路由架構或國際化處理模式
3. **效能優化**：不特別處理文章數量計算的效能問題（假設靜態頁面生成時計算不會有顯著效能影響）
4. **錯誤處理增強**：不為邊緣情況（如分類不存在、文章數為 0）添加特殊的錯誤處理邏輯
5. **文件更新**：不需要更新開發文件、CHANGELOG 或其他文件
6. **Cookie 持久化**：不實作語言偏好的 cookie 記憶功能
7. **文章詳情頁的語言版本檢測**：不檢查目標語言是否有該文章的翻譯版本

## 設計考量

### 型別定義

**LanguageNotice Props 介面**：
```typescript
interface LanguageNoticeProps {
  locale: Locale;
  chinesePostCount: number;
  category?: Category;  // 可選：undefined 表示全部文章頁面
}
```

### 連結生成邏輯

**重要**：所有內部連結都必須明確包含 locale 前綴，包括中文。

```typescript
// 正確：所有語言都包含 locale
const fullPath = `/${locale}${targetPath}`;
// 例如：/zh/tech, /ja/life, /en/posts

// 錯誤：不要使用這種模式
// const prefix = locale === 'zh' ? '' : `/${locale}`;
```

具體範例：
```typescript
const targetPath = category ? `/${category}` : '/posts';
const fullPath = `/${locale}${targetPath}`;
// 結果：/zh/tech, /zh/posts, /ja/life 等
```

### 標點符號選擇邏輯

```typescript
const period = locale === 'en' ? '.' : '。';
```

## 技術考量

### 相依性
- 使用現有的 `@/lib/posts` 模組中的函式
- 使用 Next.js 原生的 `usePathname` 和 `useRouter` hooks
- 不引入新的外部依賴

### 整合點
- `components/LanguageNotice.tsx` - 主要修改點
- `components/LanguageSwitcher.tsx` - 主要修改點
- `components/pages/CategoryPage.tsx` - 需要更新呼叫方式
- `components/pages/PostsPage.tsx` - 維持原有呼叫方式
- `lib/posts.ts` - 新增函式

### 程式碼風格
- 遵循專案現有的 TypeScript 和 React 程式碼風格
- 使用可選 props 時提供明確的預設值
- 保持與現有元件一致的命名慣例

## 驗收標準

### AC-1: LanguageNotice 元件功能正確性
- 在技術分類頁面（如 `/ja/tech`）點擊「切換到中文版」連結時，應導向 `/zh/tech`（中文技術分類）
- 在生活分類頁面（如 `/en/life`）點擊連結時，應導向 `/zh/life`（中文生活分類）
- 在全部文章頁面（如 `/ja/posts`）點擊連結時，應導向 `/zh/posts`（中文全部文章）
- 所有連結都必須包含明確的 `/zh/` 前綴
- 顯示的文章數量在分類頁面應該是該分類的中文文章數
- 顯示的文章數量在全部文章頁面應該是所有中文文章的總數

### AC-2: 標點符號正確性
- 在英文頁面檢視 LanguageNotice 時，應顯示英文句號 `.`
- 在日文頁面檢視時，應顯示全形句號 `。`
- 在中文頁面時，LanguageNotice 不應顯示（現有行為）

### AC-3: Locale 前綴一致性
- **所有內部連結**都必須包含明確的 locale 前綴，包括中文頁面
- 在中文頁面的所有連結都應包含 `/zh/` 前綴（例如：`/zh/about`、`/zh/tech`）
- 在日文和英文頁面的所有連結都應包含正確的 locale 前綴（`/ja/` 或 `/en/`）
- 點擊任何連結時不應經歷可見的重定向跳轉

### AC-4: LanguageSwitcher 路徑保持
- 在首頁（`/zh/`）切換語言時，應停留在目標語言的首頁（如 `/ja/`、`/en/`）
- 在 about 頁面（`/zh/about`）切換語言時，應停留在目標語言的 about 頁面（如 `/ja/about`）
- 在技術分類頁面（`/zh/tech`）切換語言時，應停留在目標語言的技術分類頁面（如 `/ja/tech`）
- 在生活分類頁面（`/zh/life`）切換語言時，應停留在目標語言的生活分類頁面（如 `/en/life`）
- 在文章詳情頁切換語言時，應導向目標語言的首頁
- **所有切換後的 URL 都應包含明確的 locale 前綴**，包括中文（`/zh/`）

### AC-5: 型別安全
- 所有修改的元件和函式都應該通過 TypeScript 型別檢查
- 不應出現型別錯誤或警告

### AC-6: 建構成功
- 執行 `npm run build` 應該成功完成
- 靜態頁面生成不應出現錯誤

## 開放問題

無。所有需要澄清的問題都已在研究階段解決。

## 參考資料

### 研究文件
- [docs/research/2025-10-11-explicit-locale-in-links.md](../../research/2025-10-11-explicit-locale-in-links.md) - 完整的問題分析、技術調研和解決方案評估

### 相關程式碼
- `components/LanguageNotice.tsx` - 需要修改的主要元件
- `components/LanguageSwitcher.tsx` - 需要增強的語言切換器
- `components/pages/CategoryPage.tsx` - 使用 LanguageNotice 的分類頁面
- `components/pages/PostsPage.tsx` - 使用 LanguageNotice 的文章列表頁面
- `lib/posts.ts` - 文章資料處理邏輯
- `lib/i18n/translations.ts` - 翻譯文字定義
- `lib/i18n/locales.ts` - Locale 型別定義

### 技術參考
- Next.js App Router - [Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- React TypeScript - [Optional Props Best Practices](https://dev.to/fullstackchris/react-with-typescript-optional-props-with-default-values-33nc)
