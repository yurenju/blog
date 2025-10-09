# Next.js 部落格多語言功能實作研究

## 執行摘要

本研究針對為現有 Next.js 15 靜態導出部落格加入多語言功能進行深入分析。經過全面調查後，我們發現了幾個關鍵議題需要優先處理。

首先，Next.js 的內建國際化路由功能無法與靜態導出（`output: 'export'`）整合，這是實作多語言功能的主要技術限制。其次，部落格目前採用基於日期的 slug 命名方式（`YYYY-MM-DD_title`），需要設計一套機制來關聯不同語言版本的文章。第三，由於部落格主要以繁體中文為主，其他語言為翻譯文章，需要在文章列表頁面提供適當的使用者提示，說明中文版擁有更多內容。

研究發現，在靜態導出環境下實作多語言功能主要有三種方案：使用 `next-intl` 函式庫、採用輕量級自訂實作、或使用專門支援靜態導出的 `next-export-i18n` 函式庫。每種方案都有其適用場景和取捨。本研究建議採用自訂實作方案，因為它最符合專案的簡潔架構原則，能夠完全掌控實作細節，且不會引入額外的複雜性。

## 背景與脈絡

Yuren's Blog 是一個採用 Next.js 15 App Router 架構的靜態部落格，專注於繁體中文內容創作。部落格使用 markdown 檔案作為內容來源，透過 `output: "export"` 配置產生完全靜態的網站，並部署在靜態託管平台上。

目前的技術架構相當簡潔明瞭：文章以日期為基礎的 slug 格式（`YYYY-MM-DD_title`）組織在 `public/posts/` 目錄下，每篇文章都有獨立的資料夾包含 markdown 檔案和相關圖片。核心邏輯集中在 `lib/posts.ts` 中，負責文章的讀取、快取和分類。文章透過 frontmatter 定義標題、日期和分類等中繼資料，系統會自動從 markdown 內容中提取描述和封面圖片。

隨著部落格內容的擴展，有了將部分文章翻譯成日文和英文的需求。然而這並非要建立一個完整的多語言網站，而是一個以繁體中文為主、輔以少量翻譯文章的混合模式。具體來說，網站上可能有一百篇中文文章，其中僅有三篇翻譯成日文，一篇翻譯成英文。當使用者切換到日文版時，應該只看到這三篇日文文章，而非空蕩蕩的頁面。同時，系統需要提示使用者中文版有更多內容可供閱讀，讓他們理解本網站的內容分布特性。

這個需求帶來了幾個技術挑戰：如何在靜態導出環境下實作語言路由、如何組織和關聯不同語言版本的文章檔案、如何過濾特定語言的文章列表、以及如何為每個語言版本生成獨立的 RSS feed。

## 研究問題與發現過程

使用者最初提出的需求包含兩個核心要點：網站文字需要翻譯，以及文章列表要能夠依據選擇的語言只顯示該語言的文章。經過初步了解後，透過釐清問題的過程，我們進一步確認了以下關鍵需求：

1. **文章組織方式**：同一個目錄內應包含多個語言版本的檔案，例如 `index.md`（中文）、`index.ja.md`（日文）、`index.en.md`（英文）
2. **URL 路由結構**：採用語言前綴路徑，如 `/ja/posts/...`、`/en/posts/...`，繁體中文為預設路徑 `/posts/...`
3. **UI 翻譯範圍**：所有介面元素都需要翻譯，包括導航選單、頁面標題、日期格式和提示訊息
4. **語言切換功能**：在導航列顯示語言選擇器，文章頁面顯示其他可用的語言版本，但不自動偵測瀏覽器語言
5. **SEO 與靜態導出**：每個語言版本需要獨立的 RSS feed

基於這些明確的需求，研究的核心問題逐漸清晰：如何在 Next.js 15 的靜態導出環境下，實作一個以繁體中文為主、支援部分文章翻譯的多語言部落格系統？

## 技術分析：深入理解問題

### 程式碼庫現況探索

經過程式碼審查，我們發現專案採用了 Next.js 15 App Router 架構搭配靜態導出模式，這個選擇在建立高效能部落格時是合理的，因為靜態網站提供了最快的載入速度和最低的託管成本。然而，隨著多語言需求的演進，這個架構開始出現一個關鍵限制：Next.js 的內建國際化路由功能（`i18n` config）無法與 `output: 'export'` 模式整合。

目前的核心架構特點包括：

- **文章管理系統**：`lib/posts.ts` 使用單例模式快取所有文章中繼資料，透過檔案系統讀取 `public/posts/` 目錄下的 markdown 檔案
- **Slug 命名規範**：日期為基礎的格式 `YYYY-MM-DD_title`，在開發環境會進行 URL 編碼
- **分類系統**：透過 frontmatter 的 `categories` 欄位定義，支援 `tech`、`life`、`shorts` 三種分類
- **靜態頁面產生**：所有頁面在建置時透過 `generateStaticParams` 預先渲染
- **RSS 產生**：在建置前階段（prebuild）執行 `scripts/generate-rss.ts`，為每個分類產生獨立的 RSS feed

現有的檔案結構非常簡潔：

```
public/posts/
├── 2003-08-29_Gentoo Linux 2003,6,27 安裝小技巧/
│   └── index.md
├── 2025-09-27_牆上紙膠帶貼出的畫框/
│   ├── 牆上紙膠帶貼出的畫框.md
│   ├── frame.jpg
│   └── painting.jpg
```

這個結構需要擴展以支援多語言檔案，同時保持向後相容性。

### 問題根源追蹤

經過深入分析，我們發現實作多語言功能的核心挑戰來自於幾個層面：

**技術架構限制**：
- Next.js 內建的 `i18n` 路由配置明確不支援靜態導出模式
- Middleware 在靜態導出時不會執行，因此無法用於語言偵測或重新導向
- 需要手動實作所有語言路由邏輯

**文章組織與關聯**：
- 需要設計一套機制來識別哪些檔案是同一篇文章的不同語言版本
- 現有的 slug 系統需要擴展以支援語言資訊
- frontmatter 需要新增欄位來儲存語言和翻譯關聯資訊

**使用者體驗設計**：
- 如何在文章列表中清楚標示可用語言數量
- 如何提示使用者切換到中文版可以看到更多內容
- 如何在文章頁面顯示其他可用的語言版本

**建置與效能考量**：
- 每增加一個語言版本，需要產生的靜態頁面數量會倍增
- RSS feed 需要按語言和分類的組合產生多個版本
- 需要確保建置時間不會因為多語言支援而大幅增加

### 業界智慧與最佳實踐

調研發現，靜態網站產生器（如 Hugo、Jekyll）在處理多語言內容時，主要採用兩種檔案組織方式：

**語言後綴法**：在檔案名稱加入語言代碼作為後綴，例如 `about.md`（預設語言）、`about.en.md`（英文）、`about.ja.md`（日文）。這個方法的核心原理是透過檔案名稱的模式匹配來識別語言版本，相同路徑和基礎檔名的檔案會被視為同一內容的翻譯版本。這個方法適合我們的需求，因為它保持了檔案組織的簡潔性，且易於實作。

**目錄分離法**：為每個語言建立獨立的內容目錄，例如 `content/en/`、`content/ja/`、`content/zh/`。這個方法適合完全多語言的網站，但對於以單一語言為主的部落格來說可能過於複雜。

在 Next.js 生態系統中，針對靜態導出的多語言解決方案主要包括：

**next-intl**：最受歡迎的 Next.js 國際化函式庫，每週下載量超過 93 萬次。它提供完整的 App Router 支援，可以在靜態導出模式下運作，但需要在每個頁面和 layout 中呼叫 `setRequestLocale` 來啟用靜態渲染。核心功能包括翻譯訊息管理、語言路由、Server Components 支援等。

**next-export-i18n**：專門為靜態導出設計的函式庫，完全在客戶端運作。它的設計理念是繞過 Next.js 的伺服器端路由限制，適合純靜態網站。然而，它需要在所有元件中使用 `"use client"` 指令，這與現代 Next.js 鼓勵使用 Server Components 的方向不符。

**自訂實作**：有開發者分享了不使用外部函式庫的自訂實作經驗，主要包括定義支援的語言、產生翻譯訊息、建立翻譯 Provider、以及使用 `[locale]` 動態路由來處理語言路徑。這個方法提供最大的彈性和控制權，且可以根據專案需求精簡實作。

關於文章翻譯連結的最佳實踐，業界建議：
- 在 URL 中包含語言標示，例如 `example.com/en/welcome.html` 和 `example.com/fr/accueil.html`
- 逐頁提供跨語言連結，讓使用者可以手動選擇偏好的語言
- 使用 `rel="alternate" hreflang="x"` 標籤配合 `rel="canonical"` 來改善 SEO
- 每個語言版本使用獨立的 URL，不要使用 cookies 來顯示翻譯版本

## 解決方案探索與評估

基於研究發現，我們評估了三種主要實作方案，每種方案都有其適用場景和取捨。

### 方案一：使用 next-intl 函式庫

next-intl 是 Next.js 生態系統中最成熟的國際化解決方案，提供完整的功能集和活躍的社群支援。它的核心理念是提供一個統一的 API 來處理翻譯訊息、語言路由和本地化格式，同時與 Next.js App Router 深度整合。

**主要功能與實作方式**：
- 建立 `app/[locale]/` 目錄結構來處理語言前綴路由
- 使用 `messages/zh.json`、`messages/ja.json` 等檔案來管理 UI 翻譯
- 在 `i18n/request.ts` 中配置語言和訊息載入邏輯
- 每個頁面和 layout 需要呼叫 `setRequestLocale(locale)` 來啟用靜態渲染
- 透過 `generateStaticParams()` 產生所有語言版本的靜態頁面
- 使用 `useTranslations()` 和 `getTranslations()` 來存取翻譯訊息

**在我們專案環境中的考量**：
- 提供完整的功能集，包括日期格式化、數字格式化、複數規則等
- 與 App Router 整合良好，提供 Server Components 支援
- 需要引入額外的依賴和學習曲線
- 對於主要功能（文章過濾和 UI 翻譯）來說可能過於複雜
- 需要在每個頁面加入 `setRequestLocale` 呼叫，增加模板程式碼

**評估總結**：
- **實作複雜度**：中等 - 初始設定需要建立多個配置檔案，但之後的使用較為直觀
- **維護影響**：需要持續維護翻譯檔案，且函式庫更新可能帶來 breaking changes
- **效能影響**：增加約 20-30KB 的 bundle size
- **風險等級**：低 - 成熟的函式庫，但可能引入不必要的複雜性

### 方案二：輕量級自訂實作

採用自訂實作的核心理念是只實作專案實際需要的功能，避免引入額外的複雜性。這個方案充分利用 Next.js App Router 的原生功能，透過動態路由和簡單的翻譯字典來實作多語言支援。

**主要功能與實作方式**：
- 使用 `app/[locale]/` 動態路由來處理語言前綴
- 建立簡單的翻譯字典物件（如 `lib/i18n/translations.ts`）來管理 UI 文字
- 擴展 `lib/posts.ts` 來支援語言後綴檔案（`index.md`、`index.ja.md`）
- 實作 `getPostsByLocale()` 函式來過濾特定語言的文章
- 在 frontmatter 中加入 `locale` 和 `translations` 欄位來建立文章關聯
- 擴展 RSS 產生腳本以支援多語言版本

**在我們專案環境中的考量**：
- 完全掌控實作細節，可以根據需求精確調整
- 不引入額外依賴，保持專案的簡潔性
- 與現有的程式碼風格和架構完全一致
- 需要自行處理邊界情況和錯誤處理
- 適合功能需求明確且相對簡單的場景

**核心實作要點**：

1. **文章語言識別**：
```typescript
// 從檔案名稱提取語言資訊
// index.md -> 'zh' (預設)
// index.ja.md -> 'ja'
// index.en.md -> 'en'
```

2. **翻譯字典結構**：
```typescript
const translations = {
  zh: { home: '首頁', tech: '技術', ... },
  ja: { home: 'ホーム', tech: '技術', ... },
  en: { home: 'Home', tech: 'Tech', ... }
}
```

3. **文章過濾邏輯**：
```typescript
// 只返回匹配指定語言的文章
// 提供統計資訊（如：中文版有 100 篇文章）
```

**評估總結**：
- **實作複雜度**：中等 - 需要仔細設計資料結構和過濾邏輯，但範圍可控
- **維護影響**：低 - 程式碼完全在我們掌控之中，易於調整和擴展
- **效能影響**：最小 - 不引入額外依賴，bundle size 增加少於 5KB
- **風險等級**：低 - 實作範圍明確，測試相對容易

### 方案三：使用 next-export-i18n

next-export-i18n 是專門為 Next.js 靜態導出設計的國際化函式庫，它的核心理念是完全在客戶端運作，繞過靜態導出模式下的伺服器端限制。

**主要功能與實作方式**：
- 所有元件需要使用 `"use client"` 指令
- 透過客戶端路由來處理語言切換
- 提供 hooks 來存取翻譯訊息和語言狀態
- 支援 App Router（版本 3.x）

**在我們專案環境中的考量**：
- 專門針對靜態導出優化，理論上最適合我們的場景
- 需要將大部分元件轉換為 Client Components
- 與 Next.js 鼓勵使用 Server Components 的方向不符
- 可能影響 SEO，因為內容在客戶端渲染
- 文件相對不完整，社群規模較小

**評估總結**：
- **實作複雜度**：高 - 需要重構現有的 Server Components
- **維護影響**：高 - 違背了現代 Next.js 的最佳實踐
- **效能影響**：負面 - 增加客戶端 JavaScript，可能影響首次載入速度
- **風險等級**：高 - 可能影響 SEO 和使用者體驗

## 建議與決策指引

基於全面的分析結果，我建議採用**方案二：輕量級自訂實作**。主要考量包括：專案的多語言需求相對簡單且明確、現有架構已經非常簡潔優雅、以及團隊對程式碼庫有完全的掌控權。相比引入外部函式庫（無論是 next-intl 或 next-export-i18n），自訂實作更能保持專案的簡潔性，同時提供足夠的彈性來應對未來的需求變化。

這個方案特別適合您的部落格，因為：

1. **需求匹配度高**：您需要的核心功能（文章語言過濾、UI 翻譯、語言切換）都可以透過簡單的實作達成，不需要複雜的國際化函式庫
2. **保持架構簡潔**：不引入額外依賴，與現有的程式碼風格完全一致
3. **完全掌控**：所有邏輯都在您的掌控之中，易於理解、調整和除錯
4. **效能最佳**：不增加不必要的 bundle size，保持最快的載入速度
5. **易於測試**：實作範圍明確，測試覆蓋相對容易

如果未來需求變得更複雜（例如需要支援 ICU 訊息格式、複雜的複數規則、或大量的翻譯內容管理），可以考慮逐步遷移到 next-intl。但在目前階段，自訂實作是最合適的選擇。

### 實施指引

**第一階段：核心多語言架構（1-2 天）**
- 建立 `app/[locale]/` 路由結構
- 實作語言前綴處理和預設語言重新導向
- 建立簡單的翻譯字典系統
- 擴展 `lib/posts.ts` 以支援語言後綴檔案識別

**第二階段：文章語言支援（1-2 天）**
- 實作文章語言過濾邏輯（`getPostsByLocale`）
- 修改 frontmatter 結構以支援 `locale` 和 `translations` 欄位
- 更新文章列表頁面以顯示語言特定內容
- 加入文章統計提示（例如：「中文版有 100 篇文章」）

**第三階段：UI 多語言化（1 天）**
- 翻譯所有 UI 元素（導航、標題、日期格式）
- 實作語言切換器元件
- 在文章頁面顯示其他可用語言版本

**第四階段：RSS 與 SEO（1 天）**
- 擴展 RSS 產生腳本以支援多語言
- 加入 `hreflang` 標籤以改善 SEO
- 測試所有語言版本的靜態導出

**風險監控要點**：
- 確保建置時間不會因為語言版本增加而大幅上升
- 測試所有語言的路由是否正確產生靜態頁面
- 驗證 RSS feed 的語言過濾邏輯正確性
- 檢查 SEO 標籤（特別是 `hreflang`）是否正確設定

## 下一步行動計畫

實施需要分階段進行，確保每個階段都能獨立測試和驗證。第一階段的重點是建立多語言路由基礎架構，這是整個系統的核心。第二階段則專注於文章內容的語言支援，這是使用者最關心的功能。第三階段處理使用者介面的翻譯，提升整體使用體驗。最後一個階段完善 RSS 和 SEO，確保多語言內容能夠被搜尋引擎正確索引。

### 立即行動

**建立專案結構**：
- 建立 `lib/i18n/` 目錄來存放多語言相關的邏輯
- 建立 `lib/i18n/locales.ts` 定義支援的語言清單和預設語言
- 建立 `lib/i18n/translations.ts` 定義 UI 翻譯字典
- 修改檔案結構以支援 `app/[locale]/` 路由

**擴展資料結構**：
- 在 `PostData` 型別中加入 `locale` 和 `availableLocales` 欄位
- 設計文章 frontmatter 的多語言欄位結構
- 規劃語言後綴檔案的命名規範

### 中期目標

**實作核心功能**：
- 完成文章語言識別和過濾邏輯
- 實作語言切換器和路由處理
- 翻譯所有 UI 元素
- 測試多語言文章的顯示和連結

**測試與優化**：
- 建立測試文章來驗證多語言功能
- 檢查建置輸出確保所有語言版本都正確產生
- 優化建置效能，避免不必要的重複處理

### PRD 需求

基於本研究的發現，建議撰寫一份 PRD（產品需求文件）來詳細規劃實作細節。PRD 應該涵蓋：

**功能需求**：
- 語言路由規則和 URL 結構
- 文章語言關聯機制
- UI 翻譯管理方式
- 語言切換器的使用者體驗
- 文章列表的語言過濾邏輯
- 多語言文章統計提示

**技術規格**：
- 檔案命名規範（例如：`index.md`、`index.ja.md`）
- frontmatter 結構定義
- 型別定義（TypeScript interfaces）
- API 函式簽章（`getPostsByLocale`、`getAvailableLocales` 等）

**測試計畫**：
- 單元測試範圍（語言識別、文章過濾）
- 整合測試場景（語言切換、路由）
- 建置驗證（靜態頁面產生、RSS feed）

**效能目標**：
- 建置時間限制（例如：不超過目前的 1.5 倍）
- Bundle size 增量限制（少於 10KB）
- 首次載入時間維持不變

## 參考資料

### 官方文件

**Next.js 國際化**：
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization) - Next.js 官方國際化指南
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports) - 靜態導出配置說明

**next-intl 文件**：
- [next-intl Getting Started](https://next-intl.dev/docs/getting-started/app-router) - next-intl App Router 入門
- [next-intl Static Rendering](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) - 靜態渲染配置指南

### 實作範例

**開源專案**：
- [azu/next-intl-example](https://github.com/azu/next-intl-example) - Next.js App Router + 靜態導出 + next-intl 完整範例
- [Hugo Multilingual Mode](https://gohugo.io/content-management/multilingual/) - Hugo 的多語言內容管理方式

**技術文章**：
- [Internationalize Your Next.js Static Site (with App Router)](https://medium.com/@ferlat.simon/internationalize-your-next-js-static-site-with-app-router-772f9f16e63) - 靜態網站國際化實作教學
- [Implementing Internationalization in Next.js Without External Libraries](https://medium.com/@wjdwoeotmd/implementing-internationalization-in-next-js-without-external-libraries-6b51304722b8) - 不使用外部函式庫的自訂實作經驗

### 最佳實踐

**SEO 與多語言**：
- [Google Search Central: Multilingual Websites](https://developers.google.com/search/blog/2010/03/working-with-multilingual-websites) - Google 對多語言網站的建議
- [hreflang Implementation Guide](https://developers.google.com/search/docs/specialty/international/localized-versions) - hreflang 標籤使用指南

**內容組織**：
- [Translation Keys: Naming Conventions and Organizing](https://lokalise.com/blog/translation-keys-naming-and-organizing/) - 翻譯鍵值的命名和組織
- [i18n Best Practices for Front-End Developers](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers) - Shopify 的國際化最佳實踐
