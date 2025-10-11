# 連結明確傳入 Locale 參數研究報告

## 執行摘要

本研究針對部落格系統中的國際化路由問題進行深入分析，目標是消除不必要的重定向跳轉，改善使用者體驗和 SEO 表現。經過全面的程式碼審查和技術調研，我們識別出四個關鍵問題需要處理：

1. **LanguageNotice 元件缺少上下文感知**：硬編碼連結到 `/posts`，未考慮當前瀏覽的分類（tech 或 life），且顯示的文章數量總是中文文章總數，而非該分類的文章數
2. **LanguageNotice 連結缺少 locale 前綴**：使用了不含 locale 的路徑，導致額外的重定向
3. **英文翻譯的標點符號錯誤**：使用了中文全形句號而非英文句號
4. **LanguageSwitcher 缺少路徑保持機制**：切換語言時無法停留在相同類型的頁面（除了文章詳情頁）

這些問題雖然不影響功能運作，但會降低使用者體驗，並可能對 SEO 產生負面影響。透過適當的修正，可以提供更流暢、更精確的多語言瀏覽體驗。

## 背景與脈絡

本專案是一個使用 Next.js 15 App Router 建構的多語言部落格系統，支援繁體中文（zh）、日文（ja）和英文（en）三種語言。系統採用基於 URL 的國際化路由策略，透過動態路由 `[locale]` 來處理不同語言版本。

專案的路由架構採用了混合模式：中文作為預設語言，可以透過根路徑（如 `/posts`）直接訪問，而其他語言則需要明確的 locale 前綴（如 `/ja/posts`、`/en/posts`）。為了支援這種混合模式，專案在根目錄下保留了一些重定向頁面（如 `app/posts/page.tsx`），這些頁面會自動重定向到對應的中文版本。

目前的實作中，大部分元件都已經正確處理了 locale 參數，透過 `prefix` 變數動態生成帶有正確 locale 的連結。例如 Navbar、HomePage、PostsList 等元件都遵循了這個模式：

```typescript
const prefix = locale === 'zh' ? '' : `/${locale}`;
<Link href={`${prefix}/posts`}>...</Link>
```

然而在實際使用中發現，仍有部分連結未能正確處理 locale 參數，導致使用者在特定情境下會經歷不必要的頁面跳轉。這不僅影響了使用者體驗，也可能對搜尋引擎優化（SEO）產生負面影響，因為額外的重定向會增加頁面載入時間。

## 研究問題與發現過程

使用者最初提出的需求是：「當我在 `/zh` 頁面的時候，如果我想點『生活』這頁，連結應該直接是 `/zh/life`，而不是先連到 `/life` 再跳轉到 `/zh/life`」。

在深入探討後，我們透過一系列釐清問題，逐步明確了完整的需求範圍：

1. **LanguageSwitcher 的行為調整**：原本切換語言時會直接跳到目標語言的首頁，使用者希望能保持在相同的路徑類型（例如從 `/zh/life` 切換到 `/ja/life`），但文章詳情頁除外，因為可能存在翻譯缺失的問題。

2. **LanguageNotice 的多重問題**：
   - 硬編碼的 `/posts` 連結沒有考慮當前的 locale 環境
   - 更重要的是，使用者希望連結能針對當前瀏覽的分類（tech 或 life）直接導向該分類的中文版本
   - 顯示的文章數量應該是該分類的中文文章數，而非所有文章的總數

3. **翻譯內容的標點符號問題**：使用者指出英文翻譯中使用了中文的全形句號（。），而非英文句號（.）。

4. **實作範圍確認**：主要影響的元件包括 Navbar、LanguageNotice、LanguageSwitcher 和 HomePage。

透過這個釐清過程，我們將問題從單純的「避免重定向」擴展到更全面的「改善多語言導航體驗」，並發現 LanguageNotice 需要更精細的上下文感知能力。

## 技術分析：深入理解問題

### 程式碼庫現況探索

專案採用了 Next.js 15 的 App Router 架構，透過 `[locale]` 動態路由實現國際化。讓我們先了解當前的路由結構：

**路由架構**：
```
app/
├── page.tsx                    # 重定向到 /zh/
├── life/page.tsx              # 重定向到 /zh/life
├── tech/page.tsx              # 重定向到 /zh/tech
├── posts/page.tsx             # 重定向到 /zh/posts
├── about/page.tsx             # 重定向到 /zh/about
├── subscription/page.tsx      # 重定向到 /zh/subscription
└── [locale]/
    ├── page.tsx               # 實際的首頁
    ├── life/page.tsx          # 實際的生活分類頁
    ├── tech/page.tsx          # 實際的技術分類頁
    ├── posts/page.tsx         # 實際的文章列表頁
    ├── about/page.tsx         # 實際的關於頁面
    └── subscription/page.tsx  # 實際的訂閱頁面
```

這種混合路由模式是為了讓中文（預設語言）可以使用更簡潔的 URL，同時為其他語言提供明確的 locale 前綴。

**當前 Locale 處理模式**：

大部分元件已經正確實作了 locale 處理機制。讓我們以 Navbar 為例：

```typescript
// components/Navbar.tsx (lines 16-18)
const t = getTranslation(locale);
const prefix = locale === 'zh' ? '' : `/${locale}`;
```

這個模式被廣泛應用於：
- `Navbar.tsx` - 導航列的所有連結
- `HomePage.tsx` - 首頁的分類連結
- `PostsList.tsx` - 文章列表中的文章連結

然而，我們發現了一些不一致和缺少上下文感知的地方：

1. **LanguageNotice 缺少分類上下文**（`components/LanguageNotice.tsx:7-34`）：

當前實作接收兩個 props：
```typescript
export function LanguageNotice({
  locale,
  chinesePostCount,
}: {
  locale: Locale;
  chinesePostCount: number;
})
```

但檢視使用情境發現，此元件同時被用於：
- `PostsPage.tsx` - 全部文章列表頁面
- `CategoryPage.tsx` - 特定分類頁面（tech 或 life）

在 CategoryPage 中的使用方式（`components/pages/CategoryPage.tsx:16-25`）：
```typescript
const posts = await fetchCategoryPosts(category, locale);
const chinesePostCount = await getPostCountByLocale('zh');  // 取得所有中文文章數

<LanguageNotice locale={locale} chinesePostCount={chinesePostCount} />
```

**問題識別**：
- 元件不知道當前是在哪個分類頁面
- 連結硬編碼為 `/posts`，應該根據分類導向 `/tech` 或 `/life`
- 顯示的數量是所有中文文章總數，應該是該分類的中文文章數量
- 連結缺少 locale 前綴，會導致重定向

2. **LanguageSwitcher 的簡化設計**（`components/LanguageSwitcher.tsx:28-29`）：
```typescript
<Link
  href={`/${lang}`}
  className={locale === lang ? "font-bold" : ""}
>
```
當前實作只是簡單地切換到目標語言的首頁，沒有考慮保持當前的路徑類型。

### 問題根源追蹤

經過深入分析，我們識別出以下根本問題：

**問題 1：LanguageNotice 缺少分類上下文感知**

LanguageNotice 元件原本設計為通用的語言提示元件，但實際使用情境更複雜。元件同時用於：
- 全部文章列表頁（`/posts`）- 應導向 `/zh/posts` 並顯示所有中文文章數
- Tech 分類頁（`/tech`）- 應導向 `/zh/tech` 並顯示 tech 分類的中文文章數
- Life 分類頁（`/life`）- 應導向 `/zh/life` 並顯示 life 分類的中文文章數

**根本原因**：
- 元件設計時未考慮到需要感知當前的瀏覽上下文
- Props 介面不包含 `category` 參數，無法區分不同的使用情境
- 硬編碼的連結和計數邏輯無法適應多種使用場景

**影響範圍**：
- 當使用者在 `/ja/tech` 查看技術文章列表時，點擊「切換到中文版」會導向全部文章列表而非技術分類
- 顯示的文章數量不準確，使用者看到的是所有文章數，而非當前分類的文章數
- 會經歷一次不必要的 301/302 重定向（因為缺少 locale 前綴）
- 使用者體驗不連貫，失去了瀏覽的上下文

**設計缺陷**：
- 缺少可選的 `category` prop 來指示當前上下文
- 未提供針對不同情境計算文章數量的機制
- 沒有動態生成連結的邏輯

**問題 2：語言切換缺少上下文保持**

LanguageSwitcher 採用了最簡單的實作方式：直接切換到目標語言的首頁。這在許多情境下並不理想：
- 使用者在瀏覽 `/zh/life` 分類時切換到日文，期望看到 `/ja/life`，而不是 `/ja/`
- 使用者在閱讀 about 頁面時切換語言，期望停留在 about 頁面的對應語言版本

然而，這個問題也有其複雜性：
- 文章詳情頁可能不是所有語言都有翻譯版本
- 某些動態內容可能在不同語言中有不同的可用性

**技術限制**：
- Next.js App Router 不像 Pages Router 那樣內建 i18n 路由支援
- 無法使用 `usePathname` 和 `useRouter` 等客戶端 hook，因為 LanguageSwitcher 是 client component
- 需要手動追蹤當前路徑並構建新的 locale 路徑

**問題 3：翻譯內容的標點符號混用**

在 `lib/i18n/translations.ts` 中，翻譯內容本身是正確的，但在 LanguageNotice 元件中組合時出現問題。

元件中的組合邏輯（`components/LanguageNotice.tsx:24-30`）：
```typescript
<AlertDescription>
  {t.languageNotice.mainlyInChinese}。
  {t.languageNotice.currentlyHas} {chinesePostCount} {t.languageNotice.articles}。
  <Link href="/posts" className="underline ml-1">
    {t.languageNotice.switchToChinese}
  </Link>
  。
</AlertDescription>
```

產生的英文輸出：
```
"This site is mainly written in Traditional Chinese。Currently there are 1479 articles。Switch to the Chinese version to browse all content。"
```

**問題來源**：
- 元件在組合翻譯字串時，硬編碼了中文全形句號「。」
- 未根據 locale 動態選擇正確的標點符號
- 這是元件層級的問題，而非翻譯檔案的問題

**影響**：
- 英文和日文介面中出現中文標點符號，看起來不專業
- 可能會被認為是字串處理錯誤或本地化不完整
- 影響非中文使用者的閱讀體驗和品牌專業度

### 業界智慧與最佳實踐

透過調研 Next.js 15 App Router 的國際化最佳實踐，我們發現了幾個關鍵的解決模式：

**1. 使用 next-intl 或 next-i18n-router 套件**

業界主流的解決方案通常會採用成熟的 i18n 套件，如 next-intl。這些套件提供了：
- 輕量級的導航 API 封裝（Link、useRouter、usePathname）
- 自動處理 locale 前綴和路徑轉換
- 內建的 locale 偵測和路由中介軟體

**核心實作模式**（來自 next-intl）：
```typescript
'use client';
import { usePathname, useRouter } from '@/i18n/navigation';

const pathname = usePathname(); // 回傳不含 locale 的路徑
const router = useRouter();

// 切換 locale 時保持相同路徑
router.replace(pathname, { locale: 'ja' });
```

**2. 客戶端路徑追蹤策略**

如果不使用完整的 i18n 套件，可以採用以下輕量級策略：
- 使用 Next.js 原生的 `usePathname()` hook 取得當前路徑
- 手動解析和替換路徑中的 locale 部分
- 透過 `useRouter().push()` 進行導航

**實作範例**：
```typescript
'use client';
import { usePathname, useRouter } from 'next/navigation';

const currentPathname = usePathname(); // 例如：'/zh/life'
const router = useRouter();

// 切換到新 locale
const switchLocale = (newLocale: string) => {
  // 移除當前 locale 前綴，加上新的 locale
  const pathWithoutLocale = currentPathname.replace(/^\/[a-z]{2}/, '');
  const newPath = `/${newLocale}${pathWithoutLocale}`;
  router.push(newPath);
};
```

**3. Cookie 持久化策略**

許多實作會使用 cookie 來記住使用者的語言偏好：
```typescript
document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;
```

這個策略的優點：
- 使用者下次訪問時自動導向偏好的語言
- 可以透過 middleware 在伺服器端處理
- 符合使用者期望的「記住我的選擇」行為

**4. 標點符號的國際化處理**

專業的多語言應用會將標點符號也納入國際化考量：
- 將標點符號作為翻譯字串的一部分
- 使用完整的句子而非片段組合
- 或者將標點符號本身也作為可翻譯的元素

**最佳實踐建議**：
```typescript
// 方案 A：完整句子
en: {
  languageNotice: {
    fullMessage: 'This site is mainly written in Traditional Chinese. Currently there are {count} articles. Switch to the Chinese version to browse all content.'
  }
}

// 方案 B：標點符號國際化
en: {
  punctuation: {
    period: '.',
    comma: ','
  }
}
```

對於本專案而言，由於只有 LanguageNotice 元件有這個問題，最簡單的解決方案是調整元件中的標點符號，針對不同 locale 使用不同的標點。

**5. React 元件的可選 Props 最佳實踐**

針對 LanguageNotice 需要支援多種使用情境（全部文章、特定分類）的需求，調研了 TypeScript + React 的可選 props 處理模式：

**核心原則**：
- 使用 `?` 標記可選屬性
- 在解構時提供預設值
- 明確處理可選值不存在的情況

**推薦實作模式**：
```typescript
interface LanguageNoticeProps {
  locale: Locale;
  chinesePostCount: number;
  category?: Category;  // 可選：undefined 表示全部文章頁面
}

export function LanguageNotice({
  locale,
  chinesePostCount,
  category = undefined  // 明確的預設值
}: LanguageNoticeProps) {
  // 根據 category 決定連結路徑
  const targetPath = category ? `/${category}` : '/posts';
  // ...
}
```

**避免的反模式**：
- 過度使用可選 props 導致元件行為不確定
- 不提供預設值或不處理 undefined 情況
- 使用魔術值（如空字串）代替 undefined

**設計考量**：
- 可選 prop 應該有清晰的語義（undefined 代表全部文章）
- 元件內部邏輯要明確處理所有可能的值
- 型別系統能協助確保正確使用

**資料獲取策略**：

針對需要根據 category 取得不同計數的需求，`lib/posts.ts` 已提供基礎函式，但需要新增分類計數函式：

```typescript
// 現有：取得特定 locale 的所有文章數
export async function getPostCountByLocale(locale: Locale): Promise<number>

// 需要：取得特定 locale 和 category 的文章數
export async function getPostCountByCategoryAndLocale(
  category: Category,
  locale: Locale
): Promise<number> {
  const posts = await fetchCategoryPosts(category, locale);
  return posts.length;
}
```

這個新函式可以重用現有的 `fetchCategoryPosts`，保持程式碼的一致性。

## 解決方案探索與評估

基於上述分析，我們評估了幾種可能的解決方案。

### 方案 A：引入 next-intl 或類似的 i18n 套件

這是業界標準做法，提供了完整的國際化解決方案。

**優點**：
- 提供完整的導航 API，自動處理 locale 切換
- 內建路徑保持機制，無需手動處理
- 成熟穩定，有良好的文件和社群支援
- 可以處理更複雜的國際化需求（如訊息格式化、日期時間處理等）

**缺點**：
- 需要大規模重構現有程式碼
- 增加專案依賴和打包體積
- 學習曲線，需要理解套件的概念和 API
- 對於當前的簡單需求來說可能是過度設計

**實作複雜度**：高 - 需要重構所有路由和導航相關程式碼
**維護影響**：中 - 長期來說可能更容易維護，但短期需要適應新的模式
**風險等級**：中 - 大規模重構可能引入新的問題

### 方案 B：輕量級修正，使用 Next.js 原生 API

這是最小改動方案，只修正當前識別出的問題。

**優點**：
- 改動範圍小，容易理解和實作
- 不引入新的依賴
- 保持現有架構不變
- 可以快速驗證和部署

**缺點**：
- 需要在 LanguageSwitcher 中手動處理路徑解析
- 可能需要為文章詳情頁添加特殊處理邏輯
- 未來如果需要更複雜的國際化功能，可能需要再次重構

**核心改動**：

1. **LanguageNotice 元件修正與增強**：
   - 新增可選的 `category?: Category` prop
   - 根據 category 動態生成連結路徑（`/tech`、`/life` 或 `/posts`）
   - 連結加入 locale 前綴（使用 `prefix` 模式）
   - 調整標點符號處理，針對不同 locale 使用對應的標點

2. **資料層新增函式**（`lib/posts.ts`）：
   - 新增 `getPostCountByCategoryAndLocale` 函式
   - 用於取得特定分類和語言的文章數量

3. **頁面元件更新**：
   - `CategoryPage.tsx` - 傳遞 `category` prop 給 LanguageNotice
   - 使用新的計數函式取得該分類的中文文章數
   - `PostsPage.tsx` - 維持原有呼叫方式（不傳 category）

4. **LanguageSwitcher 增強**：
   - 使用 `usePathname()` 取得當前路徑
   - 解析當前路徑的路由段（segments）
   - 為文章詳情頁保持原有行為（跳到首頁）
   - 為其他頁面構建對應的 locale 路徑

**實作複雜度**：低到中 - 需要修改 4-5 個檔案（元件 + 頁面 + 資料層）
**維護影響**：低 - 保持現有架構，新增的邏輯清晰且符合現有模式
**風險等級**：低 - 改動範圍明確，容易測試和回滾

### 方案 C：混合方案，選擇性引入工具函式

介於方案 A 和 B 之間，建立一些可重用的工具函式。

**優點**：
- 建立統一的連結生成邏輯，確保一致性
- 可以逐步演進，不需要一次性大規模重構
- 提供更好的可測試性
- 為未來可能的進一步優化奠定基礎

**缺點**：
- 比方案 B 稍微複雜一些
- 需要定義清晰的工具函式 API

**關鍵工具函式設計**：
```typescript
// lib/i18n/routing.ts
export function getLocalizedPath(
  locale: Locale,
  path: string
): string {
  const prefix = locale === 'zh' ? '' : `/${locale}`;
  return `${prefix}${path}`;
}

export function switchLocaleInPath(
  currentPath: string,
  fromLocale: Locale,
  toLocale: Locale
): string {
  // 移除當前 locale，加上新 locale
  const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '');
  return getLocalizedPath(toLocale, pathWithoutLocale || '/');
}
```

**實作複雜度**：中 - 需要設計和測試工具函式，並更新元件
**維護影響**：中 - 引入新的抽象層，但提高了一致性
**風險等級**：低 - 可以逐步採用，容易回滾

## 建議與決策指引

基於分析結果和專案當前的需求，我們建議採用**方案 B：輕量級修正**作為首選方案。

**推薦理由**：

1. **需求匹配度高**：當前的問題範圍清晰且有限，方案 B 可以完全滿足需求
2. **風險可控**：改動範圍小，容易測試和驗證
3. **實施效率高**：可以快速完成並部署，不需要大規模重構
4. **保持架構一致性**：不引入新的概念或依賴，與現有程式碼風格一致
5. **可演進性**：如果未來需要更複雜的國際化功能，可以基於這次的改動逐步演進

**實施優先級**：

高優先級（立即修正）：
- **LanguageNotice 分類上下文感知**：這是最關鍵的問題，影響使用者在分類頁面的導航體驗
- **LanguageNotice locale 前綴**：消除不必要的重定向
- **英文標點符號錯誤**：影響專業度和使用者體驗

中優先級（短期內完成）：
- **LanguageSwitcher 路徑保持**：這是功能增強，可以顯著改善使用者體驗

**風險監控重點**：

1. **可選 prop 的型別安全**：確保 TypeScript 型別定義正確，避免執行時錯誤
2. **CategoryPage 和 PostsPage 的一致性**：確保兩種使用情境都正確處理
3. **文章數量計算效能**：新增的函式會查詢文章，需要確認不會影響頁面載入效能
4. **文章詳情頁的特殊處理**：LanguageSwitcher 需要確保當文章沒有對應語言版本時，有適當的容錯機制
5. **路徑解析邏輯**：需要測試各種路徑組合，確保邊界情況正確處理
6. **中文預設語言的特殊性**：需要確保 locale 為 `zh` 時，路徑不包含 `/zh` 前綴

## 下一步行動計畫

根據分析結果，建議按以下順序執行實作：

**第一階段：資料層準備**（建議立即執行）

1. **新增分類計數函式**（`lib/posts.ts`）：
   - 新增 `getPostCountByCategoryAndLocale` 函式
   - 重用現有的 `fetchCategoryPosts` 函式
   - 預估時間：10 分鐘
   - 測試重點：確認函式正確回傳分類文章數

**第二階段：元件修正與增強**（緊接著執行）

2. **增強 LanguageNotice 元件**：
   - 更新型別定義，新增 `category?: Category` prop
   - 實作動態連結生成邏輯（根據 category 和 locale）
   - 調整標點符號處理，根據 locale 使用對應的標點
   - 預估時間：20-25 分鐘
   - 測試重點：
     - 在分類頁面測試連結導向正確的分類
     - 在全部文章頁面測試連結導向 `/posts`
     - 確認不同 locale 使用正確的標點符號

3. **更新頁面元件**：
   - `CategoryPage.tsx`：傳遞 `category` prop，使用新的計數函式
   - `PostsPage.tsx`：確認維持原有行為（不傳 category）
   - 預估時間：15 分鐘
   - 測試重點：
     - 在 `/ja/tech` 測試顯示正確的 tech 文章數
     - 在 `/en/life` 測試顯示正確的 life 文章數
     - 在 `/ja/posts` 測試顯示所有文章數

**第三階段：增強語言切換功能**（建議短期內完成）

4. **增強 LanguageSwitcher 元件**：
   - 引入 `usePathname` hook 取得當前路徑
   - 實作路徑解析和 locale 替換邏輯
   - 為文章詳情頁添加特殊處理（回到首頁）
   - 預估時間：30-45 分鐘
   - 測試重點：
     - 在不同頁面（首頁、about、分類頁）測試語言切換
     - 確認文章詳情頁切換時回到首頁
     - 測試三種語言之間的切換

**測試計畫**：

建立一個完整的測試清單：

**LanguageNotice 元件測試**：
- [ ] 在 `/zh/tech` 測試 LanguageNotice 不顯示（中文頁面）
- [ ] 在 `/ja/tech` 測試連結導向 `/tech`（中文預設語言不含前綴）
- [ ] 在 `/en/life` 測試連結導向 `/life`
- [ ] 在 `/ja/posts` 測試連結導向 `/posts`
- [ ] 在 `/ja/tech` 測試顯示的數字是 tech 分類的中文文章數
- [ ] 在 `/en/life` 測試顯示的數字是 life 分類的中文文章數
- [ ] 在 `/ja/posts` 測試顯示的數字是所有中文文章數
- [ ] 在英文頁面檢查標點符號是 `.` 而非 `。`
- [ ] 在日文頁面檢查標點符號是 `。`

**Locale 前綴一致性測試**：
- [ ] 在 `/zh` 測試所有連結是否不包含 `/zh` 前綴
- [ ] 在 `/ja` 和 `/en` 測試所有連結是否包含正確的 locale 前綴

**LanguageSwitcher 測試**：
- [ ] 在各個頁面測試 LanguageSwitcher，確認停留在相同頁面類型
- [ ] 在文章詳情頁測試 LanguageSwitcher，確認回到首頁
- [ ] 測試三種語言之間的切換

**是否需要 PRD**：

對於這個任務，建議**直接進行實作，不需要撰寫正式的 PRD**，原因如下：
- 問題範圍清晰，已經透過本研究文件完整定義
- 實作改動範圍小，不涉及複雜的功能設計
- 本研究報告已經包含了足夠的技術細節和實作指引
- 快速修正可以更早改善使用者體驗

如果開發過程中發現需要更複雜的設計決策或功能擴展，可以根據實際情況再考慮是否需要補充 PRD。

## 參考資料

### 技術文件

- [Next.js App Router - Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization) - Next.js 官方 App Router 國際化指南
- [next-intl Documentation](https://next-intl.dev/docs/getting-started/app-router) - 主流 Next.js i18n 套件文件
- [Navigation APIs - next-intl](https://next-intl.dev/docs/routing/navigation) - 語言切換時保持路徑的實作方式

### 實作範例

- [Building a Language Switcher for Next.js](https://makerkit.dev/blog/tutorials/language-switcher-nextjs) - 語言切換器實作教學
- [Next.js 15 App Router with i18next](https://i18nexus.com/tutorials/nextjs/react-i18next) - App Router 國際化完整指南

### TypeScript 與 React 最佳實踐

- [React with TypeScript: Optional Props with Default Values](https://dev.to/fullstackchris/react-with-typescript-optional-props-with-default-values-33nc) - 可選 props 的實作模式
- [Optional props in TypeScript](https://www.meje.dev/blog/optional-props-in-typescript) - TypeScript 可選屬性處理
- [Defining Optional Props with TypeScript in React](https://medium.com/@haymap28/defining-optional-props-with-typescript-in-react-1659673081b2) - React 元件介面設計

### 延伸閱讀

- [Next.js change locale for the current path](https://stackoverflow.com/questions/70043343/next-js-change-locale-for-the-current-path-that-has-query-using-router) - Stack Overflow 社群討論
- [Implementing i18n in Next.js 15 (App) using i18next](https://www.azharzaman.com/blog/implementing-i18n-in-next-js-15-app-using-i18next) - 完整的 i18n 實作案例
- [I ruined my React components by using optional props](https://dev.to/lico/i-ruined-my-react-components-by-using-optional-props-3o64) - 避免過度使用可選 props 的經驗分享
