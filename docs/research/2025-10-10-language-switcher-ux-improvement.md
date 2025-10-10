# 語言切換器使用者體驗改善研究報告

## 執行摘要

本研究針對部落格的語言切換功能進行深入分析，主要解決當文章缺少特定語言翻譯時，使用者點擊語言切換器會導致 404 錯誤的問題。經過全面調查後，我們識別出兩個關鍵改善方向：

1. **Navbar 語言切換器**：簡化為全站級別的語言切換，導向目標語言的首頁，避免 404 錯誤
2. **ArticleLanguageIndicator**：強化文章內的語言切換指示器，清楚顯示翻譯狀態

這個雙層設計符合 UX 最佳實踐，既保持全站導航的簡潔性，又在文章層級提供精確的翻譯狀態資訊。

## 背景與脈絡

這個部落格採用 Next.js 15 靜態生成架構，支援三種語言（繁體中文、日文、英文）。文章以 Markdown 格式撰寫，儲存在 `public/posts/` 目錄下，每篇文章可以有多個語言版本。

### 當前多語言架構

專案使用以下檔案命名規則來區分不同語言版本：
- 繁體中文（主要語言）：`index.md` 或 `原文標題.md`
- 日文翻譯：`index.ja.md`
- 英文翻譯：`index.en.md`

路由結構採用 Next.js App Router 的動態路由：
- 繁體中文：`/posts/[slug]`（無語言前綴）
- 其他語言：`/[locale]/posts/[slug]`（例如 `/ja/posts/[slug]`）

### 問題的具體表現

使用者在瀏覽文章時，Navbar 右上角有一個語言切換器（LanguageSwitcher 元件）。當使用者在某篇文章頁面點擊切換語言時：

**有翻譯的情況**（例如 `2025-09-27_牆上紙膠帶貼出的畫框`）：
- 目錄下有 `index.ja.md` 和 `index.en.md`
- 切換到日文版成功顯示：`/ja/posts/2025-09-27_牆上紙膠帶貼出的畫框`

**無翻譯的情況**（例如 `2024-12-31_完美的答案蘊含疑問`）：
- 目錄下只有中文版 `《言葉之庭》與《我的完美日常》之間的疑問與解答.md`
- 切換到日文版導致 404：`/ja/posts/2024-12-31_完美的答案蘊含疑問`

這個問題源於當前的 LanguageSwitcher 實作，它會嘗試將當前路徑的語言前綴替換為目標語言，但不檢查目標頁面是否存在。

## 研究問題與發現過程

### 初始問題定義

使用者最初描述的問題是：「在沒有日文翻譯的文章點擊語言切換器會 404」。這是一個表面問題，背後涉及更深層的 UX 設計考量。

### 問題釐清過程

透過與使用者討論，我們釐清了幾個關鍵決策：

1. **使用者期望的行為**：希望語言選項能顯示翻譯狀態（disable 或提示文字）
2. **視覺反饋方式**：將缺少翻譯的語言選項設為 disabled，並用目標語言標示「尚未翻譯」
3. **網站翻譯策略**：主要為新文章提供翻譯，大量舊文章不會翻譯
4. **錯誤處理偏好**：不需要特別處理 404，保持預設行為即可

### 關鍵洞察

在討論過程中，使用者提出了一個重要觀點：「文章內部已經有 ArticleLanguageIndicator 了」。這個洞察引導我們重新思考設計：

**分層的語言切換策略**：
- Navbar 的語言切換器應該是**全站級別**的功能，主要用途是切換網站的語言環境
- 文章內的 ArticleLanguageIndicator 負責**文章級別**的語言切換，顯示該文章的翻譯狀態

這個分層設計不僅解決了 404 問題，也更符合使用者的認知模型。

## 技術分析：深入理解問題

### 程式碼庫現況探索

當前的語言切換實作分散在幾個關鍵元件中：

**LanguageSwitcher 元件**（[components/LanguageSwitcher.tsx](../components/LanguageSwitcher.tsx)）：
- 使用 `usePathname()` 取得當前路徑
- 透過字串替換來切換語言前綴（`/zh/posts/...` → `/ja/posts/...`）
- 不檢查目標頁面是否存在，直接產生連結

```typescript
const getLanguageUrl = (targetLocale: Locale) => {
  // 簡單的路徑前綴替換邏輯
  const pathWithoutLocale = pathname.replace(/^\/(zh|ja|en)/, '');
  return targetLocale === 'zh' ? pathWithoutLocale || '/' : `/${targetLocale}${pathWithoutLocale || ''}`;
};
```

**ArticleLanguageIndicator 元件**（[components/ArticleLanguageIndicator.tsx](../components/ArticleLanguageIndicator.tsx)）：
- 接收 `availableLocales` 參數，知道哪些語言有翻譯
- 只顯示其他可用的語言版本（排除當前語言）
- 如果沒有其他語言版本，完全不顯示

**文章頁面資料載入**（[app/\[locale\]/posts/\[slug\]/page.tsx](../app/[locale]/posts/[slug]/page.tsx)）：
- 透過 `generateStaticParams()` 預先產生所有文章的靜態路徑
- 只為實際存在的語言版本產生路徑
- 如果訪問未產生的路徑，會出現 404

### 問題根源追蹤

404 錯誤的根本原因是：

1. **靜態路徑產生的限制**：Next.js 的靜態生成只會為存在的檔案建立路徑，未翻譯的文章不會產生對應語言的路徑
2. **元件狀態不同步**：LanguageSwitcher 元件無法知道當前文章是否有特定語言的翻譯
3. **架構層級的問題**：LanguageSwitcher 是全站共用元件，很難針對不同頁面類型（文章頁、列表頁、靜態頁）做客製化處理

相關的技術限制：
- Next.js 靜態生成不支援 404 後的自動 fallback（在 `output: 'export'` 模式下）
- 在客戶端元件中取得伺服器端資料（如文章的 `availableLocales`）需要額外的狀態管理
- 無法在建構時預先知道所有文章的翻譯狀態並注入到客戶端

### 業界智慧與最佳實踐

根據 UX 最佳實踐研究，業界對於多語言網站的語言切換器有以下共識：

**永遠顯示所有語言選項**：
即使當前頁面沒有某個語言的翻譯，也應該顯示該語言選項。這避免使用者誤以為整個網站都不支援該語言。

**清楚標示缺少翻譯**：
當頁面沒有特定語言版本時，應該透過以下方式之一告知使用者：
- 將該語言選項設為 disabled（灰色）
- 在語言名稱後加上「未翻譯」標籤
- 使用圖示（如禁止符號）標示

**點擊行為的兩種主流做法**：

1. **導向首頁**：將使用者導向目標語言的首頁或文章列表
   - 優點：簡單直接，不會造成 404
   - 缺點：使用者會失去當前的頁面情境

2. **顯示提示後導向**：彈出對話框告知「此頁面無該語言翻譯」，詢問是否要前往該語言的首頁
   - 優點：使用者體驗更友善，有明確的操作引導
   - 缺點：需要額外的互動步驟，增加實作複雜度

**實際案例**：
- **Wikipedia**：語言切換器會顯示所有語言，但只有存在翻譯的語言可以點擊
- **MDN Web Docs**：顯示所有語言，缺少翻譯的語言會顯示在不同區塊，點擊後導向英文版
- **GitLab 文檔**：語言切換器只顯示當前頁面可用的語言版本

## 解決方案探索與評估

基於使用者的需求和技術分析，我們評估了三種主要解決方案：

### 方案一：Navbar 語言切換器導向首頁（推薦）

**核心概念**：
將 Navbar 的 LanguageSwitcher 重新定位為「全站語言切換」功能，點擊後永遠導向目標語言的首頁，不管當前在哪個頁面。

**實作方式**：
修改 LanguageSwitcher 的 `getLanguageUrl()` 函式，直接返回目標語言的首頁路徑：

```typescript
const getLanguageUrl = (targetLocale: Locale) => {
  return targetLocale === 'zh' ? '/' : `/${targetLocale}`;
};
```

**評估**：
- **實作複雜度**：★☆☆☆☆（非常簡單）- 只需要修改一個函式
- **維護影響**：★☆☆☆☆（極低）- 邏輯簡單，不會增加技術債
- **使用者體驗**：★★★★☆（優良）- 清楚明確，不會產生 404
- **風險等級**：★☆☆☆☆（極低）- 不會影響現有功能

**優點**：
- 完全避免 404 錯誤
- 符合「全站語言切換」的語義
- 實作和維護成本極低
- 與 ArticleLanguageIndicator 形成清楚的功能分工

**缺點**：
- 使用者會失去當前的頁面情境（但這符合全站切換的預期）

### 方案二：檢測翻譯狀態並 disable 選項

**核心概念**：
LanguageSwitcher 檢測當前頁面是否有各語言的翻譯，將缺少翻譯的語言選項設為 disabled，並顯示「尚未翻譯」提示。

**實作方式**：
1. 透過 URL pattern 判斷當前是否在文章頁面
2. 如果在文章頁，從伺服器載入該文章的 `availableLocales`
3. 根據 `availableLocales` 設定每個語言選項的 disabled 狀態

**評估**：
- **實作複雜度**：★★★★☆（複雜）- 需要客戶端資料載入和狀態管理
- **維護影響**：★★★☆☆（中等）- 增加邏輯複雜度，需要處理載入狀態和錯誤
- **使用者體驗**：★★★★★（優秀）- 清楚顯示翻譯狀態
- **風險等級**：★★★☆☆（中等）- API 呼叫可能失敗，影響使用者體驗

**優點**：
- 清楚告知使用者哪些語言有翻譯
- 使用者不會點擊到無效的連結
- 符合使用者的初始需求

**缺點**：
- 需要額外的 API 端點或資料載入機制
- 增加客戶端的複雜度和載入時間
- 只適用於文章頁，其他頁面（如靜態頁）可能沒有翻譯狀態
- 與方案一矛盾（如果導向首頁，就不需要 disable）

### 方案三：混合方案 - 依頁面類型調整行為

**核心概念**：
根據不同的頁面類型，採用不同的語言切換策略：
- 文章頁：維持當前的路徑替換邏輯，但在 ArticleLanguageIndicator 中清楚標示
- 其他頁面：導向目標語言的對應頁面或首頁

**實作方式**：
1. 修改 LanguageSwitcher 以偵測頁面類型
2. 為文章頁保留原有行為（允許 404）
3. 強化 ArticleLanguageIndicator 的顯示，包含「只有這些語言」的明確提示

**評估**：
- **實作複雜度**：★★★☆☆（中等偏高）- 需要頁面類型判斷和分支邏輯
- **維護影響**：★★★☆☆（中等）- 邏輯分支增加維護負擔
- **使用者體驗**：★★★☆☆（中等）- 不同頁面行為不一致，可能造成困惑
- **風險等級**：★★☆☆☆（中低）- 複雜邏輯增加 bug 風險

**優點**：
- 針對不同情境提供最佳體驗
- 保留文章頁的語言切換彈性

**缺點**：
- 不一致的行為可能讓使用者困惑
- 實作和維護成本較高
- 文章頁仍然可能出現 404（只是透過 ArticleLanguageIndicator 降低發生機率）

## 建議與決策指引

基於使用者需求、技術分析和業界最佳實踐，我強烈推薦採用**方案一：Navbar 語言切換器導向首頁**，並同時優化 ArticleLanguageIndicator。

### 推薦方案的理由

**符合使用者的設計洞察**：
使用者提出「文章內部已經有 ArticleLanguageIndicator」的觀點非常關鍵。這引導我們建立清楚的功能分層：
- Navbar 語言切換器 = 全站語言環境切換
- ArticleLanguageIndicator = 文章特定的語言版本切換

**技術實作最簡單**：
只需要修改 LanguageSwitcher 的 `getLanguageUrl()` 函式，改為返回目標語言的首頁路徑。這個改動風險極低，不會影響其他功能。

**完全解決 404 問題**：
因為永遠導向首頁，不會出現文章不存在的情況。首頁是所有語言都有的頁面，保證不會 404。

**符合 UX 最佳實踐**：
業界建議「永遠顯示所有語言選項」，並在無翻譯時「導向目標語言的首頁」。這正是方案一的做法。

**維護成本最低**：
邏輯簡單明確，未來不需要額外維護或處理邊界情況。

### 額外的 ArticleLanguageIndicator 優化建議

雖然現有的 ArticleLanguageIndicator 已經顯示可用的語言版本，但可以進一步優化：

1. **更明確的文案**：
   - 目前：「Also available in: 日本語 English」
   - 建議：「本文提供以下語言版本：日本語 English」（繁體中文情境）
   - 或是：「この記事は以下の言語でもご利用いただけます：繁體中文 English」（日文情境）

2. **顯示「僅此語言」的提示**（可選）：
   - 當 `availableLocales` 只有當前語言時，可以顯示：「本文僅提供繁體中文版本」
   - 這有助於使用者理解為什麼沒有其他語言選項

3. **視覺強化**：
   - 目前使用 Badge 元件已經很清楚
   - 可以考慮在切換後使用 scroll-to-top，確保使用者知道頁面已切換

## 下一步行動計畫

### 立即行動（核心功能）

1. **修改 LanguageSwitcher 元件**
   - 檔案：[components/LanguageSwitcher.tsx](../components/LanguageSwitcher.tsx)
   - 修改 `getLanguageUrl()` 函式，返回目標語言的首頁路徑
   - 預估時間：5 分鐘

2. **測試語言切換行為**
   - 在不同頁面（首頁、文章頁、關於頁）測試語言切換
   - 確認都能正確導向目標語言的首頁
   - 預估時間：10 分鐘

### 中期優化（使用者體驗提升）

3. **優化 ArticleLanguageIndicator 文案**（可選）
   - 檔案：[lib/i18n/translations.ts](../lib/i18n/translations.ts)
   - 更新 `post.alsoAvailableIn` 翻譯文案，讓語義更清楚
   - 預估時間：5 分鐘

4. **新增「僅此語言」提示**（可選）
   - 檔案：[components/ArticleLanguageIndicator.tsx](../components/ArticleLanguageIndicator.tsx)
   - 當只有一種語言時，顯示「本文僅提供 X 語言版本」
   - 預估時間：15 分鐘

### PRD 需求

這個改善不需要撰寫 PRD。原因如下：

1. **範圍小且明確**：只修改一個函式，邏輯清楚
2. **技術風險低**：不涉及新功能或架構變更
3. **立即可實作**：不需要額外的需求分析或設計

如果你希望進行更深入的多語言 UX 優化（例如自動語言偵測、翻譯進度指示器等），那時再考慮撰寫 PRD。

### 額外考量

**未來的翻譯策略**：
- 如果未來計劃增加更多語言，當前的架構可以直接擴展
- 如果希望追蹤翻譯進度，可以考慮建立翻譯狀態儀表板（但這超出當前需求範圍）

**SEO 考量**：
- 確保每篇文章的 `hreflang` 標籤正確設定（目前已經在 [app/\[locale\]/posts/\[slug\]/page.tsx](../app/[locale]/posts/[slug]/page.tsx:56-60) 中實作）
- 未翻譯的文章不會出現在其他語言的 sitemap 中（因為 `generateStaticParams()` 不會產生路徑）

## 參考資料

### UX 最佳實踐
- [UX Stack Exchange - Language selector for pages without translation](https://ux.stackexchange.com/questions/120914/if-there-is-no-translation-for-page-how-to-display-language-selector)
- [Language switching UI/UX on multilingual sites](https://www.robertjelenic.com/language-switching-ui-ux-on-multilingual-sites/)
- [Smartling - Language selector best practices](https://www.smartling.com/blog/language-selector-best-practices)

### 技術實作
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- 專案現有實作：[lib/posts.ts](../lib/posts.ts)、[lib/i18n/locales.ts](../lib/i18n/locales.ts)

### 相關元件
- [components/LanguageSwitcher.tsx](../components/LanguageSwitcher.tsx) - 需要修改
- [components/ArticleLanguageIndicator.tsx](../components/ArticleLanguageIndicator.tsx) - 可選優化
- [lib/i18n/translations.ts](../lib/i18n/translations.ts) - 可選文案更新
