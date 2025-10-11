# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-10-11-category-based-navigation/prd.md`
**相關研究文件：** `docs/research/2025-10-11-category-based-navigation.md`

> **重要提醒：** 實作過程中請經常參考上述文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 非功能性需求（性能、安全性等）
> - 系統架構和技術決策的背景脈絡
> - 研究文件中的深入分析和建議

## 相關檔案

- `components/Navbar.tsx` - 導覽列元件,需要重構為 props 驅動的 presentational component
- `app/[locale]/layout.tsx` - Layout 檔案,需要移除 Navbar 的渲染
- `components/pages/PostDetailPage.tsx` - 文章詳細頁元件,需要加入 Navbar 並傳入主要類別
- `components/pages/CategoryPage.tsx` - 類別頁面元件,需要加入 Navbar 並傳入類別參數
- `components/pages/HomePage.tsx` - 首頁元件,需要加入 Navbar 並傳入 null
- `components/pages/StaticMarkdownPage.tsx` - 靜態頁面元件(關於/訂閱),需要加入 Navbar 並傳入 null
- `components/pages/PostsPage.tsx` - 全部文章頁面元件,需要加入 Navbar 並傳入 null
- `lib/i18n/translations.ts` - 翻譯檔案,需要新增類別連結的翻譯文字
- `lib/posts.ts` - 文章邏輯,用於取得 Category 型別定義
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [x] 1. 新增多語系翻譯文字
  - 1.1 在 `lib/i18n/translations.ts` 的每個語系 `nav` 物件中新增 `allTechPosts` 和 `allLifePosts` 鍵
  - 1.2 繁體中文 (`zh`): `allTechPosts: '所有科技文章'`, `allLifePosts: '所有生活記事'`
  - 1.3 日文 (`ja`): `allTechPosts: 'すべての技術記事'`, `allLifePosts: 'すべての生活記事'`
  - 1.4 英文 (`en`): `allTechPosts: 'All Tech Posts'`, `allLifePosts: 'All Life Posts'`
  - 1.5 保留現有的 `allPosts` 翻譯鍵(供 PostsPage 使用)
  - 1.6 確認 TypeScript 類型定義 `Translations` 介面也更新了 `nav` 部分的型別

- [x] 2. 重構 Navbar 元件
  - 2.1 修改 `NavbarProps` 介面,將 `locale` 改為必填,新增 `category: Category | null` 必填參數
  - 2.2 移除 `usePathname` 的 import(如果有使用)
  - 2.3 移除所有基於 URL 路徑的判斷邏輯
  - 2.4 實作基於 `category` prop 的條件渲染邏輯:
    - 當 `category === null` 時,不顯示類別連結
    - 當 `category === 'tech'` 時,顯示 `t.nav.allTechPosts` 連結,指向 `${prefix}/tech`
    - 當 `category === 'life'` 時,顯示 `t.nav.allLifePosts` 連結,指向 `${prefix}/life`
  - 2.5 移除「全部文章」連結的渲染(原本的 `/posts` 連結)
  - 2.6 保持其他導覽項目不變:首頁、關於、訂閱、主題切換、語言切換器
  - 2.7 保持現有的樣式和結構(`max-w-7xl mx-auto px-4`, `variant="ghost"` 等)

- [ ] 3. 調整 Layout 架構
  - 3.1 開啟 `app/[locale]/layout.tsx`
  - 3.2 移除 `<Navbar locale={locale} />` 這一行
  - 3.3 保持 `<div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">` 的包裝結構
  - 3.4 確認 `{children}` 直接渲染在 div 中,不再包含 Navbar

- [ ] 4. 更新文章詳細頁元件
  - 4.1 在 `components/pages/PostDetailPage.tsx` 頂部 import Navbar: `import Navbar from "@/components/Navbar"`
  - 4.2 從 `postData.categories[0]` 取得主要類別,如果不存在則使用 `null`: `const mainCategory = postData.categories[0] || null`
  - 4.3 在 return 的 JSX 最頂部(在 `<div className="container...">` 之前)加入 `<Navbar locale={locale} category={mainCategory} />`
  - 4.4 將原本的 div 包裝在 React Fragment (`<>...</>`) 中,確保 Navbar 和內容都被返回

- [ ] 5. 更新類別頁面元件
  - 5.1 在 `components/pages/CategoryPage.tsx` 頂部 import Navbar: `import Navbar from "@/components/Navbar"`
  - 5.2 在 return 的 JSX 最頂部加入 `<Navbar locale={locale} category={category} />`
  - 5.3 使用 React Fragment 包裝 Navbar 和現有的內容 div
  - 5.4 `category` 參數直接使用元件 props 傳入的值

- [ ] 6. 更新首頁、靜態頁面和全部文章頁面元件
  - 6.1 在 `components/pages/HomePage.tsx` 加入 `import Navbar from "@/components/Navbar"` 和 `<Navbar locale={locale} category={null} />`
  - 6.2 在 `components/pages/StaticMarkdownPage.tsx` 加入 `import Navbar from "@/components/Navbar"` 和 `<Navbar locale={locale} category={null} />`
  - 6.3 在 `components/pages/PostsPage.tsx` 加入 `import Navbar from "@/components/Navbar"` 和 `<Navbar locale={locale} category={null} />`
  - 6.4 確認每個頁面的 Navbar 都放在 JSX 的最頂部,使用 React Fragment 包裝

- [ ] 7. 檢視並準備多分類文章調整(手動任務)
  - 7.1 **注意**:這個任務不是由 AI 自動執行,而是提示使用者自行檢視和調整
  - 7.2 建立一個檢查清單,列出 14 篇多分類文章的路徑(從研究文件中取得)
  - 7.3 提供調整指引:檢視每篇文章的內容,決定哪個類別應該作為主要類別(放在 categories 陣列的第一個位置)
  - 7.4 決策原則:
    - 文章的主要內容焦點(技術實作 vs. 生活應用)
    - 目標讀者群(技術從業者 vs. 一般讀者)
    - 文章中技術細節的比例
  - 7.5 使用者可以選擇保持現有順序或手動調整 frontmatter 中 categories 的順序

- [ ] 8. 測試與驗證
  - 8.1 執行 `npm run dev` 啟動開發伺服器
  - 8.2 手動測試所有頁面類型:
    - 訪問 `/zh/tech` 和 `/zh/life`,確認導覽顯示對應的類別連結
    - 訪問科技和生活類別的文章,確認導覽基於主要類別顯示
    - 訪問首頁、關於、訂閱頁面,確認不顯示類別連結
    - 訪問 `/zh/posts`,確認頁面正常且導覽不顯示類別連結
  - 8.3 測試多語系:切換到日文和英文,確認導覽文字正確翻譯
  - 8.4 測試響應式設計:在不同螢幕尺寸下檢查導覽列
  - 8.5 檢查 console 是否有錯誤或警告

- [ ] 9. 建置與型別檢查
  - 9.1 執行 `npm run build` 進行生產環境建置
  - 9.2 確認沒有 TypeScript 型別錯誤
  - 9.3 確認靜態匯出成功生成所有頁面
  - 9.4 檢查生成的 HTML 檔案是否包含正確的 Navbar 結構

- [ ] 10. 執行驗收測試
  - 10.1 使用 AI 讀取 `acceptance.feature` 檔案
  - 10.2 透過 MCP 瀏覽器操作執行每個場景
  - 10.3 驗證所有場景通過並記錄結果
  - 10.4 如有失敗場景,記錄詳細的錯誤資訊並修正

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑：** `docs/research/2025-10-11-category-based-navigation.md`

**方案五的核心優勢**:
- 每個頁面明確控制自己的 Navbar,完全符合 React 的組合模式
- Navbar 變成純 props 驅動,不需要複雜的 URL 判斷或 context
- TypeScript 在編譯時就能檢查 category 參數是否正確
- 易於維護:未來新增頁面時,清楚知道要傳什麼參數

**架構決策**:
1. **架構清晰**: 遵循 React 的「元件組合」哲學,每個頁面明確聲明自己需要的 UI
2. **避免隱式依賴**: 不依賴 URL 路徑、context 或其他隱式資訊
3. **符合 Next.js 模式**: App Router 鼓勵在各層級明確控制 layout 和 UI
4. **易於理解**: 新加入的開發者一眼就能看出每個頁面有哪些 UI 元素

**主要類別邏輯**:
- 維持多分類結構,不強制改為單一分類
- 但明確將 `categories[0]` 作為「主要類別」
- 在導覽和其他需要單一類別的情境使用主要類別
- 在文章列表和搜尋等情境,仍然支援多分類顯示

**14 篇多分類文章**:
1. `2014-11-09_1129-割闌尾-v-計畫背後` (life, tech)
2. `2016-07-13_開發勞基法計算機才知道的荒謬` (life, tech)
3. `2016-10-18_遠距工作一年多的經驗` (tech, life)
4. `2017-08-12_vectr-的奇幻旅程` (life, tech)
5. `2018-06-17_getting-things-done-番茄鐘時間管理` (tech, life)
6. `2019-02-06_數位書寫工具探索之旅` (life, tech)
7. `2020-03-09_旅行每日背包資訊整理` (life, tech)
8. `2020-04-21_getting-things-done-番茄鐘時間管理2020-年更新` (tech, life)
9. `2021-12-02_選擇權簡介` (tech, life)
10. `2022-01-23_如何梳理我的待辦事項魔改子彈筆記法` (tech, life)
11. `2022-03-30_如何組織與吸收知識魔改-zettelkasten-筆記法` (life, tech)
12. `2022-05-23_用散步來消化腦中的思考殘渣` (life, tech)
13. `2022-06-05_吸收知識的手段撰寫筆記作為你的黃色小鴨` (life, tech)
14. `2022-10-24_less-is-more-精簡每日待辦事項` (tech, life)

### 來自 PRD 的實作細節
> **文件路徑：** `docs/specs/2025-10-11-category-based-navigation/prd.md`

**Navbar 元件重構範例**:
```tsx
// components/Navbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "./ThemeToggleButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/locales";
import type { Category } from "@/lib/posts";

interface NavbarProps {
  locale: Locale;
  category: Category | null;  // null = 不顯示類別連結
}

const Navbar = ({ locale, category }: NavbarProps) => {
  const t = getTranslation(locale);
  const prefix = locale === 'zh' ? '' : `/${locale}`;

  // 簡單直接的邏輯,完全由 props 驅動
  const showCategoryLink = category !== null;
  const categoryLinkHref = category ? `${prefix}/${category}` : '';
  const categoryLinkText = category === 'tech'
    ? t.nav.allTechPosts
    : t.nav.allLifePosts;

  return (
    <nav className="top-0 left-0 right-0 h-16 border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/`}>{t.nav.home}</Link>
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/about`}>{t.nav.about}</Link>
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button variant="ghost" asChild>
            <Link href={`${prefix}/subscription`}>{t.nav.subscription}</Link>
          </Button>
          {showCategoryLink && (
            <>
              <span className="text-muted-foreground">•</span>
              <Button variant="ghost" asChild>
                <Link href={categoryLinkHref}>{categoryLinkText}</Link>
              </Button>
            </>
          )}
          <ThemeToggleButton locale={locale} />
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

**頁面元件修改範例**:
```tsx
// components/pages/PostDetailPage.tsx
import Navbar from "@/components/Navbar";

export async function PostDetailPage({ slug, locale }) {
  const allPostMetadata = await getSingletonPostMetadata();
  const decodedSlug = decodeSlug(slug);
  const postKey = locale === 'zh' ? decodedSlug : `${decodedSlug}-${locale}`;
  const postData = await getPostData(allPostMetadata[postKey].filePath);

  const mainCategory = postData.categories[0] || null;

  return (
    <>
      <Navbar locale={locale} category={mainCategory} />
      <div className="container mx-auto p-4">
        {/* 現有內容 */}
      </div>
    </>
  );
}
```

**翻譯檔案新增內容**:
```typescript
// lib/i18n/translations.ts
nav: {
  home: '首頁',
  about: '關於',
  subscription: '訂閱',
  allPosts: '全部文章', // 保留
  allTechPosts: '所有科技文章', // 新增
  allLifePosts: '所有生活記事', // 新增
},
```

**Layout 修改**:
```tsx
// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">
      {/* 移除 <Navbar locale={locale} /> */}
      {children}
    </div>
  );
}
```

### 關鍵技術決策

1. **Props 驅動的設計**: Navbar 完全由 props 控制,不依賴任何隱式狀態或 context,提高可測試性和可維護性

2. **主要類別邏輯**: 使用 `categories[0]` 作為主要類別,保持多分類的靈活性同時簡化導覽邏輯

3. **React Fragment 模式**: 使用 `<>...</>` 包裝 Navbar 和頁面內容,保持 JSX 結構簡潔

4. **型別安全**: 透過 TypeScript 的 `Category | null` 型別,在編譯時期確保傳入正確的參數

5. **向後相容**: 保留 `/posts` 路徑和 `allPosts` 翻譯鍵,確保現有功能不受影響

6. **多語系一致性**: 所有三種語言(繁中、日文、英文)都提供對應的翻譯,確保國際使用者體驗

7. **手動調整多分類**: 將 14 篇多分類文章的調整作為使用者任務,而非 AI 自動處理,確保分類決策符合內容意圖

## 注意事項

- **不要遺漏頁面**: 確保所有 5 個頁面元件都加入了 Navbar
- **Fragment 包裝**: 每個頁面的 JSX 都需要用 `<>...</>` 包裝 Navbar 和內容
- **型別正確**: `category` 參數必須是 `Category | null` 型別,不要使用 `undefined`
- **保持樣式**: 不要修改現有的 Tailwind CSS 類別和結構
- **測試多語系**: 務必在三種語言下都測試過導覽顯示
- **手動調整提示**: 任務 7 是給使用者的提示,不是 AI 要執行的任務
