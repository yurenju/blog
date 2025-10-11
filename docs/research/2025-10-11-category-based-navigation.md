# 網站導覽動線調整研究：基於讀者類別偏好的情境式導覽

## 執行摘要

本研究針對部落格導覽動線進行深入分析,探討如何根據讀者的類別偏好優化導覽體驗。主要發現包括:

- **讀者分群明確**: 觀察到讀者傾向專注於單一類別(科技或生活),很少跨類別閱讀
- **多分類文章**: 發現 14 篇文章同時屬於兩個分類,需要在實施前進行分類決策
- **情境式導覽**: 提議根據當前頁面情境動態調整導覽列,在文章頁面顯示對應類別的連結

這項調整能夠提供更符合讀者需求的導覽體驗,減少不相關的導覽選項,但同時也需要權衡一些使用者體驗和技術複雜度的考量。

## 背景與脈絡

Yurenju Blog 是一個採用 Next.js 15 靜態匯出的多語系部落格,主要使用繁體中文撰寫,並提供部分文章的日文和英文翻譯。目前網站擁有超過 1,400 篇文章,分為「科技」和「生活」兩大類別。

從網站架構來看,目前的導覽系統提供了四個主要入口:
- **首頁** (`/`): 展示網站簡介,並提供「科技」和「生活」兩個類別按鈕
- **全部文章** (`/posts`): 列出所有文章,不分類別
- **科技** (`/tech`): 僅顯示科技類別文章
- **生活** (`/life`): 僅顯示生活類別文章

目前的導覽列([Navbar.tsx](components/Navbar.tsx#L14-L38))在所有頁面都固定顯示相同的連結:「首頁」、「關於」、「訂閱」、「全部文章」,加上主題切換和語言切換功能。

近期觀察發現,讀者在閱讀行為上呈現明顯的類別偏好,大多數讀者要不是科技內容的追蹤者,就是生活記事的讀者,很少有人同時對兩種類別都感興趣。這個觀察引發了對導覽動線的重新思考:是否應該提供更符合讀者閱讀情境的導覽選項?

## 研究問題與發現過程

### 初始需求

使用者希望調整導覽動線,讓讀者在閱讀特定類別文章時,能夠更方便地探索同類別的其他文章,而不是顯示所有文章的連結。具體需求包括:

1. 當讀者在「生活」類別文章時,右上角的「全部文章」改為「所有生活記事」
2. 當讀者在「科技」類別文章時,右上角的「全部文章」改為「所有科技文章」
3. 在其他頁面(首頁、訂閱、關於),不顯示「全部文章」連結
4. 保留 `/posts` 路徑,但不在導覽中顯示連結

### 關鍵發現

#### 1. 文章分類現況

透過自動化腳本分析([check-categories.js](check-categories.js)),發現:

**分類統計**:
- 科技文章: 648 篇
- 生活文章: 817 篇
- 沒有分類: 44 篇(主要是翻譯文章,會繼承主文章的分類)
- **多個分類: 14 篇**

**具有多個分類的文章**:
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

這些多分類文章大多與生產力工具、時間管理、個人成長等主題相關,橫跨技術工具應用和生活實踐兩個領域。

#### 2. 目前的導覽架構

程式碼分析顯示導覽系統的實作方式:

**Navbar 元件** ([Navbar.tsx](components/Navbar.tsx)):
- 使用 client component ("use client")
- 接收 `locale` 參數來支援多語系
- 固定顯示相同的導覽項目,不根據頁面情境調整

**頁面結構**:
- 所有頁面都使用 `LocaleLayout` ([app/[locale]/layout.tsx](app/[locale]/layout.tsx#L31-L46))
- Navbar 在 layout 層級渲染,對所有子頁面一致

**文章資料邏輯** ([lib/posts.ts](lib/posts.ts)):
- `categories` 欄位是陣列型態,支援多個分類
- `fetchCategoryPosts` 使用 `includes()` 方法,只要文章的 categories 包含指定類別就會顯示
- 這表示多分類文章會同時出現在兩個類別頁面

## 技術分析:深入理解問題

### 現況分析

當前的導覽系統採用「全域統一」的設計哲學,在所有頁面提供相同的導覽選項。這種設計的優點是一致性和可預測性,但在「讀者有明確類別偏好」的情況下,「全部文章」連結對於專注某一類別的讀者來說可能不是最有用的選項。

從使用者旅程來看:
1. **首頁**: 讀者看到網站簡介和兩個類別按鈕,已經暗示了「選擇類別」的設計意圖
2. **類別頁面** (`/tech` 或 `/life`): 讀者瀏覽特定類別的文章列表
3. **文章詳細頁**: 讀者閱讀單篇文章
4. **導覽列**: 提供「全部文章」,打破了「類別專注」的脈絡

這種設計上的不一致可能會導致:
- 讀者在閱讀科技文章時點擊「全部文章」,看到大量生活類文章,造成資訊過載
- 失去了「繼續探索同類別內容」的便利性
- 導覽提供的選項與讀者當下的閱讀情境不匹配

### 多分類文章的處理挑戰

14 篇多分類文章帶來了分類決策的挑戰:

**問題核心**: 目前的 `fetchCategoryPosts` 函式使用 `post.categories.includes(category)`,這表示:
- 一篇標記為 `[tech, life]` 的文章會同時出現在 `/tech` 和 `/life` 頁面
- 但文章本身只有一個「主要類別」的概念嗎?還是確實同時屬於兩個類別?

**影響範圍**:
- 如果採用「單一類別」策略,需要決定這 14 篇文章的主要分類
- 決策依據可能包括:文章主題、標籤、發布時間、閱讀量等
- 部分文章(如時間管理、生產力工具)確實橫跨兩個領域,強制分類可能失去語意

**建議方案**:
- **方案 A**: 維持多分類,但在導覽邏輯中引入「主要類別」概念
  - 文章 frontmatter 中第一個類別為主要類別
  - 導覽根據主要類別決定顯示「所有科技文章」或「所有生活記事」

- **方案 B**: 改為單一分類
  - 需要人工檢視 14 篇文章並決定主要類別
  - 較為明確,但失去了文章的多面向特性

### 導覽動態化的技術考量

**情境偵測邏輯**:

要實現「根據頁面情境調整導覽」,需要解決以下技術問題:

1. **如何判斷當前頁面的類別?**
   - 在文章詳細頁 (`/posts/[slug]`): 需要從文章資料中取得類別資訊
   - 在類別頁 (`/tech`, `/life`): 從路由路徑判斷
   - 在其他頁面 (首頁、關於、訂閱): 不顯示類別連結

2. **Navbar 元件如何取得頁面情境?**

   目前的架構:
   ```tsx
   // app/[locale]/layout.tsx
   <Navbar locale={locale} />
   ```

   可能的實作方向:

   **方向 A: 透過 URL 路徑判斷** (推薦)
   ```tsx
   // components/Navbar.tsx
   "use client"
   import { usePathname } from 'next/navigation'

   const Navbar = ({ locale }) => {
     const pathname = usePathname()
     // 從路徑判斷情境
     // /zh/tech -> showTechLink
     // /zh/life -> showLifeLink
     // /zh/posts/slug -> 需要額外資訊
   }
   ```

   **方向 B: 傳遞 category 參數**
   ```tsx
   // app/[locale]/posts/[slug]/page.tsx
   <Layout category={postData.categories[0]}>
     {children}
   </Layout>
   ```

   問題: Layout 是 server component,Navbar 是 client component,需要處理 props 傳遞

   **方向 C: 使用 Context API**
   - 建立 PageContext 來傳遞頁面資訊
   - 較為複雜,可能過度設計

3. **多分類文章的導覽顯示**

   假設採用方案 A(主要類別為第一個),則:
   ```tsx
   // 在文章頁面
   const mainCategory = postData.categories[0]
   // 顯示對應的類別連結
   ```

**URL 結構維持**:

根據需求,`/posts` 路徑要保留但不在導覽中顯示。這意味著:
- 搜尋引擎索引的 `/posts` 連結仍然有效(SEO 友善)
- 直接輸入 URL 仍可訪問
- 只是不在導覽列中提供入口

這是一個合理的設計,類似「隱藏但可訪問」的頁面。

## 解決方案探索與評估

### 方案一:URL 路徑判斷 + 主要類別邏輯(推薦)

**核心概念**:
在 Navbar 元件中使用 `usePathname()` 判斷當前路徑,根據不同情境顯示對應的導覽項目。對於文章詳細頁,透過 URL 中的路徑判斷(是從 `/tech` 還是 `/life` 進入),或是根據文章的主要類別(categories 陣列第一項)決定。

**實作要點**:
```tsx
// components/Navbar.tsx
const pathname = usePathname()
const prefix = locale === 'zh' ? '' : `/${locale}`

// 判斷情境
const isTechPage = pathname.includes('/tech')
const isLifePage = pathname.includes('/life')
const isPostPage = pathname.includes('/posts/') && !pathname.endsWith('/posts')
const isOtherPage = !isTechPage && !isLifePage && !isPostPage

// 動態顯示導覽項目
if (isPostPage) {
  // 需要額外邏輯判斷文章的類別,可能需要從 URL 或其他方式取得
  // 暫時可以根據 referrer 或其他機制
} else if (isTechPage) {
  <Link href={`${prefix}/tech`}>{t.categories.tech}</Link>
} else if (isLifePage) {
  <Link href={`${prefix}/life`}>{t.categories.life}</Link>
}
// isOtherPage 則不顯示
```

**優點**:
- ✅ 實作相對簡單,主要在 Navbar 元件中修改
- ✅ 不需要大幅改動架構
- ✅ 基於 URL 路徑,效能良好
- ✅ 對於類別頁面(`/tech`, `/life`)判斷明確

**缺點**:
- ❌ 文章詳細頁的類別判斷需要額外處理
- ❌ 如果使用者直接訪問文章 URL(而非從類別頁進入),難以判斷應該顯示哪個類別連結
- ❌ 多分類文章的導覽可能不一致

**實作複雜度**: ⭐⭐☆☆☆ (中低)
**維護影響**: 需要在 Navbar 加入情境判斷邏輯
**風險等級**: ⭐⭐☆☆☆ (中低,主要風險是文章頁面的類別判斷)

### 方案二:透過 Props 傳遞 Category 資訊

**核心概念**:
在各個頁面的 Layout 或 Page 元件中,明確傳遞 `category` 參數給 Navbar,讓 Navbar 根據接收到的資訊決定顯示內容。

**架構調整**:
```tsx
// app/[locale]/layout.tsx
interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
  category?: Category | null  // 新增
}

// app/[locale]/posts/[slug]/page.tsx
<Navbar locale={locale} category={postData.categories[0]} />
```

**問題**: Next.js App Router 的 Layout 是 Server Component,而 Navbar 需要是 Client Component(使用 usePathname 等 hooks)。這會導致 props 傳遞的複雜性。

**可能的解決方式**:
- 使用 Context API 在 server 和 client 之間傳遞資料
- 將 category 資訊編碼到 URL 或其他 client-accessible 的地方

**優點**:
- ✅ 資訊傳遞明確,不需要推測
- ✅ 多分類文章可以明確指定主要類別

**缺點**:
- ❌ 需要大幅修改架構
- ❌ Server/Client Component 之間的資料傳遞較為複雜
- ❌ 每個頁面都需要處理 category 傳遞

**實作複雜度**: ⭐⭐⭐⭐☆ (高)
**維護影響**: 多個檔案需要修改,架構變動較大
**風險等級**: ⭐⭐⭐☆☆ (中,複雜度增加導致潛在 bug)

### 方案三:混合方案 - URL 判斷 + 文章 Metadata

**核心概念**:
結合方案一和方案二的優點,主要使用 URL 路徑判斷,但在文章詳細頁使用 metadata 或 cookie 來記錄讀者的類別偏好。

**實作思路**:
1. 當讀者從 `/tech` 或 `/life` 點擊文章時,在 URL 加入 query parameter(如 `?from=tech`)或使用 cookie 記錄
2. 文章頁面的 Navbar 根據這個資訊顯示對應的類別連結
3. 如果沒有 from 資訊(直接訪問文章 URL),則使用文章的主要類別(categories[0])

**優點**:
- ✅ 結合兩種方案的優點
- ✅ 對於從類別頁進入的讀者,提供一致的體驗
- ✅ 直接訪問文章時,有 fallback 機制

**缺點**:
- ❌ 實作最為複雜
- ❌ 需要處理 URL query parameters 或 cookies
- ❌ 可能影響 SEO(如果使用 query parameters)

**實作複雜度**: ⭐⭐⭐⭐⭐ (非常高)
**維護影響**: 多處需要修改,包括連結生成邏輯
**風險等級**: ⭐⭐⭐⭐☆ (高,複雜度和潛在的 SEO 影響)

### 方案四:簡化版 - 僅在類別頁和首頁調整

**核心概念**:
退一步思考,或許不需要在文章詳細頁做特殊處理。主要調整:
1. 在 `/tech` 頁面,導覽顯示「所有科技文章」(連結到 `/tech`)
2. 在 `/life` 頁面,導覽顯示「所有生活記事」(連結到 `/life`)
3. 在文章詳細頁,**不顯示**類別連結,或維持「全部文章」
4. 在首頁、關於、訂閱,不顯示「全部文章」連結

**理由**:
- 讀者在文章詳細頁主要專注於閱讀內容
- 如果想探索更多同類文章,可以使用瀏覽器「返回」回到類別頁
- 或在文章底部加入「更多 [類別] 文章」的連結

**優點**:
- ✅ 實作非常簡單
- ✅ 避免了文章頁面類別判斷的複雜性
- ✅ 維持了類別頁面的一致性體驗

**缺點**:
- ❌ 文章頁面失去了「探索同類文章」的便利性
- ❌ 不完全符合原始需求

**實作複雜度**: ⭐☆☆☆☆ (非常低)
**維護影響**: 僅需修改 Navbar 的顯示邏輯
**風險等級**: ⭐☆☆☆☆ (非常低)

### 方案五:移除 Layout 的 Navbar,由各頁面自行渲染(最佳方案)

**核心概念**:
將 Navbar 從 `app/[locale]/layout.tsx` 移除,改為在各個頁面元件(CategoryPage, PostDetailPage, HomePage 等)中直接渲染 Navbar,並傳入對應的 category 參數。這樣每個頁面都能完全控制 Navbar 的顯示內容。

**架構調整**:

目前架構:
```tsx
// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return (
    <div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">
      <Navbar locale={locale} />  // ← 所有頁面共用
      {children}
    </div>
  );
}
```

調整後:
```tsx
// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return (
    <div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">
      {children}  // ← 不再包含 Navbar
    </div>
  );
}

// components/pages/PostDetailPage.tsx
export async function PostDetailPage({ slug, locale }) {
  const postData = await getPostData(/*...*/);
  const mainCategory = postData.categories[0];

  return (
    <>
      <Navbar locale={locale} category={mainCategory} />
      <div className="container mx-auto p-4">
        {/* 文章內容 */}
      </div>
    </>
  );
}

// components/pages/CategoryPage.tsx
export async function CategoryPage({ category, locale }) {
  return (
    <>
      <Navbar locale={locale} category={category} />
      <div className="container mx-auto p-4">
        {/* 類別頁面內容 */}
      </div>
    </>
  );
}

// components/pages/HomePage.tsx
export function HomePage({ locale }) {
  return (
    <>
      <Navbar locale={locale} category={null} />  // 首頁不顯示類別連結
      <div className="container mx-auto p-4">
        {/* 首頁內容 */}
      </div>
    </>
  );
}

// components/pages/StaticMarkdownPage.tsx (關於、訂閱)
export async function StaticMarkdownPage({ pageName, locale }) {
  return (
    <>
      <Navbar locale={locale} category={null} />  // 靜態頁面不顯示類別連結
      <MarkdownPage filepath={filepath} locale={locale} />
    </>
  );
}
```

**Navbar 元件簡化**:
```tsx
// components/Navbar.tsx
interface NavbarProps {
  locale: Locale;
  category: Category | null;  // null 表示不顯示類別連結
}

const Navbar = ({ locale, category }: NavbarProps) => {
  const t = getTranslation(locale);
  const prefix = locale === 'zh' ? '' : `/${locale}`;

  // 簡單直接,不需要 usePathname 或複雜的判斷邏輯
  const showCategoryLink = category !== null;
  const categoryLinkHref = category ? `${prefix}/${category}` : '';
  const categoryLinkText = category === 'tech'
    ? t.nav.allTechPosts
    : t.nav.allLifePosts;

  return (
    <nav className="top-0 left-0 right-0 h-16 border-b border-border">
      {/* ... */}
      {showCategoryLink && (
        <Button variant="ghost" asChild>
          <Link href={categoryLinkHref}>{categoryLinkText}</Link>
        </Button>
      )}
      {/* ... */}
    </nav>
  );
};
```

**需要調整的檔案**:
- `app/[locale]/layout.tsx` - 移除 Navbar
- `components/pages/PostDetailPage.tsx` - 加入 Navbar with category
- `components/pages/CategoryPage.tsx` - 加入 Navbar with category
- `components/pages/HomePage.tsx` - 加入 Navbar with null
- `components/pages/StaticMarkdownPage.tsx` - 加入 Navbar with null
- `components/pages/PostsPage.tsx` - 加入 Navbar (可能顯示「全部文章」或 null)
- `components/Navbar.tsx` - 簡化為純 props 驅動,移除 usePathname

**優點**:
- ✅ **最簡潔的實作**: 每個頁面明確控制自己的 Navbar,不需要複雜的判斷邏輯
- ✅ **類型安全**: category 參數明確傳遞,compile time 就能發現錯誤
- ✅ **易於測試**: Navbar 變成純 presentational component,容易測試
- ✅ **完全符合需求**: 每個頁面可以精確控制導覽顯示
- ✅ **Server Component 友善**: 不需要 client-side hooks,Navbar 可以保持為 server component(如果不需要 ThemeToggle 等 client features)
- ✅ **維護性高**: 未來新增頁面時,清楚知道要傳什麼參數給 Navbar

**缺點**:
- ⚠️ **程式碼重複**: 每個頁面元件都要加入 `<Navbar />`,但這是可接受的重複
- ⚠️ **檔案修改較多**: 需要修改所有頁面元件(約 5-6 個檔案)
- ⚠️ **可能的一致性風險**: 如果忘記在某個頁面加 Navbar,該頁面會沒有導覽(但這很容易發現)

**為何這是最佳方案**:
1. **架構清晰**: 遵循 React 的「元件組合」哲學,每個頁面明確聲明自己需要的 UI
2. **避免隱式依賴**: 不依賴 URL 路徑、context 或其他隱式資訊
3. **符合 Next.js 模式**: App Router 鼓勵在各層級明確控制 layout 和 UI
4. **易於理解**: 新加入的開發者一眼就能看出每個頁面有哪些 UI 元素

**實作複雜度**: ⭐⭐☆☆☆ (中低,檔案多但邏輯簡單)
**維護影響**: 多個頁面檔案需要修改,但每個修改都很簡單(加一行 Navbar)
**風險等級**: ⭐☆☆☆☆ (非常低,改動簡單且容易驗證)

### 方案比較總結

| 方案 | 實作複雜度 | 使用者體驗 | 維護成本 | 符合需求程度 | 程式碼清晰度 |
|------|----------|----------|---------|------------|------------|
| 方案一: URL 路徑判斷 | 中低 | 良好(文章頁需處理) | 中 | 高 | 中(需理解 URL 判斷邏輯) |
| 方案二: Props 傳遞 | 高 | 優秀 | 高 | 非常高 | 低(Server/Client 複雜) |
| 方案三: 混合方案 | 非常高 | 優秀 | 非常高 | 非常高 | 低(邏輯複雜) |
| 方案四: 簡化版 | 非常低 | 良好 | 低 | 中 | 高 |
| **方案五: 頁面自行渲染** | **中低** | **優秀** | **低** | **非常高** | **非常高** |

## 使用者體驗分析

### 優點分析

**1. 情境相關性提升**
當讀者專注於某個類別時,導覽提供的選項更符合當下需求,減少了認知負擔。例如:
- 科技讀者在瀏覽科技文章時,不會被生活類文章的資訊干擾
- 導覽成為「深入探索當前主題」的工具,而非「切換主題」的工具

**2. 資訊架構清晰化**
移除「全部文章」連結後,首頁的「選擇類別」設計意圖更加明確,強化了「部落格分為兩大主題」的訊息。

**3. 減少選擇疲勞**
對於已經確定閱讀偏好的讀者,不需要在每個頁面都看到「全部文章」這個選項,減少了無關選擇。

### 缺點與風險分析

**1. 失去「發現」的可能性**
- 部分讀者可能透過「全部文章」發現另一個類別的有趣內容
- 移除這個入口可能讓讀者的閱讀範圍變窄
- 特別是對於新訪客,可能不知道網站有兩種類別的內容

**2. 導覽不一致性**
- 在不同頁面看到不同的導覽項目,可能造成困惑
- 特別是如果實作方案一,文章頁的類別判斷不準確時,可能導致導覽項目跳動

**3. 多分類文章的困境**
- 14 篇橫跨兩個類別的文章,強制歸類可能失去語意
- 這些文章的讀者可能同時對兩個類別感興趣,反而不符合「單一類別讀者」的假設

**4. 直接訪問文章的體驗**
- 如果讀者透過搜尋引擎或社群媒體直接訪問文章,沒有「從類別頁進入」的脈絡
- 此時導覽要顯示什麼?如果根據文章主要類別,可能與讀者的興趣不符

**5. 缺乏「全覽」的入口**
- 雖然保留 `/posts` 路徑,但沒有導覽連結,部分想看「所有內容」的讀者可能找不到
- 可能需要在其他地方(如關於頁面、頁尾)提供這個連結

### 使用者旅程情境分析

**情境 A: 科技讀者從首頁進入**
1. 訪問首頁 → 看到「科技」和「生活」兩個按鈕
2. 點擊「科技」→ 進入 `/tech` 頁面
3. 導覽顯示「所有科技文章」→ ✅ 符合需求
4. 點擊某篇文章 → 進入文章頁
5. 導覽顯示「所有科技文章」→ ✅ 可以繼續探索

**情境 B: 透過搜尋引擎直接訪問文章**
1. Google 搜尋結果點擊 → 直接進入文章頁
2. 導覽顯示 ??? → ⚠️ 需要判斷邏輯
   - 如果根據文章主要類別顯示,可能 ✅
   - 如果無法判斷,可能 ❌ 體驗不佳

**情境 C: 想瀏覽所有文章的讀者**
1. 訪問首頁 → 沒有「全部文章」連結
2. 進入「科技」或「生活」→ 只看到單一類別
3. 想看全部?→ ❌ 沒有明顯的入口
4. 需要手動輸入 `/posts` URL → ⚠️ 可發現性差

**情境 D: 多分類文章的讀者**
1. 在「科技」分類看到「時間管理工具」文章
2. 點擊進入 → 文章同時屬於 `[tech, life]`
3. 導覽顯示「所有科技文章」→ ✅ 符合進入脈絡
4. 但這篇文章也在「生活」分類出現
5. 從「生活」進入同一篇文章 → 導覽應該顯示「所有生活記事」?
6. ⚠️ 同一篇文章在不同脈絡下有不同導覽

## 建議與決策指引

經過分析,我建議採用**方案五(頁面自行渲染 Navbar)**,這是最簡潔、易於維護且符合 React 架構哲學的方案。

### 推薦方案:頁面層級控制 Navbar + 改善可發現性

**核心實作**:

1. **架構調整**:
   - 從 `app/[locale]/layout.tsx` 移除 Navbar
   - 在每個頁面元件中直接渲染 Navbar,並傳入對應的 category 參數

2. **導覽邏輯** (透過明確的 props 傳遞):
   - **類別頁面** (`/tech`, `/life`): 傳入對應的 category
     ```tsx
     <Navbar locale={locale} category="tech" />
     <Navbar locale={locale} category="life" />
     ```

   - **文章詳細頁** (`/posts/[slug]`): 傳入文章的主要類別
     ```tsx
     <Navbar locale={locale} category={postData.categories[0]} />
     ```

   - **其他頁面** (首頁、關於、訂閱): 傳入 null,不顯示類別連結
     ```tsx
     <Navbar locale={locale} category={null} />
     ```

3. **多分類文章處理**:
   - 維持多分類結構,不強制改為單一分類
   - 但明確將 `categories[0]` 作為**主要類別**
   - 在導覽和其他需要單一類別的情境使用主要類別
   - 在文章列表和搜尋等情境,仍然支援多分類顯示

4. **改善「全覽」的可發現性**:
   - 在**頁尾**(Footer)加入「瀏覽全部文章」連結
   - 在**關於頁面**說明中提及 `/posts` 路徑
   - 或在類別頁面底部加入「也想看看其他類別?→ 瀏覽全部文章」

5. **14 篇多分類文章的分類決策**:
   - 建議保持第一個分類為主要類別
   - 若需要調整,可根據以下原則:
     - 文章的主要內容焦點(技術實作 vs. 生活應用)
     - 目標讀者群(技術從業者 vs. 一般讀者)
     - 文章中技術細節的比例

### 實施步驟

**立即行動**(Phase 1 - 核心功能):
1. **修改 Navbar 元件**:
   - 將 `category` 改為必填參數: `category: Category | null`
   - 移除 `usePathname` 和相關的 client-side 判斷邏輯
   - 簡化為純 props 驅動的 presentational component

2. **修改 Layout**:
   - 從 `app/[locale]/layout.tsx` 移除 `<Navbar />` 行

3. **更新所有頁面元件**:
   - `components/pages/PostDetailPage.tsx`: 加入 `<Navbar locale={locale} category={postData.categories[0]} />`
   - `components/pages/CategoryPage.tsx`: 加入 `<Navbar locale={locale} category={category} />`
   - `components/pages/HomePage.tsx`: 加入 `<Navbar locale={locale} category={null} />`
   - `components/pages/StaticMarkdownPage.tsx`: 加入 `<Navbar locale={locale} category={null} />`
   - `components/pages/PostsPage.tsx`: 加入 `<Navbar locale={locale} category={null} />` (或決定是否要顯示連結)

4. **更新翻譯檔案**:
   - 在 `lib/i18n/translations.ts` 加入 `allTechPosts` 和 `allLifePosts`

5. **測試**:
   - 本地測試所有頁面的導覽顯示
   - 確認多語系切換正常運作
   - 驗證類別連結的正確性

**中期調整**(Phase 2 - 改善體驗):
1. 檢視 14 篇多分類文章,確認主要分類是否合理
2. 如有需要,調整 frontmatter 中 categories 的順序
3. 建立 Footer 元件,加入「瀏覽全部文章」連結
4. 更新關於頁面,說明網站的內容架構

**監控與優化**(Phase 3 - 數據驅動):
1. 使用 GA 或其他分析工具,監控以下指標:
   - 從類別頁到文章頁的點擊率
   - 文章頁的跳出率(是否有變化)
   - `/posts` 頁面的訪問量(應該會下降,但不應完全消失)
2. 收集讀者回饋,了解新導覽的使用體驗
3. 根據數據調整導覽邏輯或加入其他輔助功能

### 替代方案:如果發現問題

如果實施後發現使用者體驗不佳,可以考慮以下調整:

**Plan B: 加入「切換類別」提示**
- 在文章底部加入「您可能也對 [另一個類別] 感興趣」
- 提供跨類別探索的可能性

**Plan C: 在文章頁維持「全部文章」**
- 僅在類別頁顯示類別連結
- 文章頁保持「全部文章」,降低導覽變動

**Plan D: 回退到原始設計**
- 如果數據顯示新設計導致負面影響(如跳出率上升、頁面瀏覽量下降)
- 可以快速回退到原本的「全部文章」導覽

### 風險監控

**需要特別注意**:
- ✅ 搜尋引擎流量是否受影響(直接進入文章的讀者體驗)
- ✅ 跨類別讀者的比例(可能被低估)
- ✅ 多分類文章的互動數據(讀者是否困惑)
- ✅ `/posts` 頁面的訪問來源(有多少是直接輸入 URL)

## 技術實作建議

### Navbar 元件修改範例(推薦方案五)

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

### 翻譯檔案更新

```typescript
// lib/i18n/translations.ts
nav: {
  home: '首頁',
  about: '關於',
  subscription: '訂閱',
  allPosts: '全部文章', // 保留,但不在導覽中使用
  allTechPosts: '所有科技文章', // 新增
  allLifePosts: '所有生活記事', // 新增
},
```

### Layout 修改

```tsx
// app/[locale]/layout.tsx
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  return (
    <div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">
      {/* 移除 <Navbar locale={locale} /> */}
      {children}
    </div>
  );
}
```

### 各頁面元件修改範例

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
        <h1 className="font-serif text-4xl font-bold mb-6">
          {postData.title}
        </h1>
        {/* ... 其他內容 */}
      </div>
    </>
  );
}

// components/pages/CategoryPage.tsx
import Navbar from "@/components/Navbar";

export async function CategoryPage({ category, locale }) {
  const posts = await fetchCategoryPosts(category, locale);
  const t = getTranslation(locale);
  const title = t.categories[category];

  return (
    <>
      <Navbar locale={locale} category={category} />
      <div className="container mx-auto p-4">
        <PostsList posts={posts} title={title} locale={locale} />
        {/* ... 其他內容 */}
      </div>
    </>
  );
}

// components/pages/HomePage.tsx
import Navbar from "@/components/Navbar";

export function HomePage({ locale }) {
  const t = getTranslation(locale);
  const prefix = locale === 'zh' ? '' : `/${locale}`;

  return (
    <>
      <Navbar locale={locale} category={null} />
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        {/* ... 首頁內容 */}
      </div>
    </>
  );
}

// components/pages/StaticMarkdownPage.tsx
import Navbar from "@/components/Navbar";

export async function StaticMarkdownPage({ pageName, locale }) {
  // ... 檔案路徑邏輯

  return (
    <>
      <Navbar locale={locale} category={null} />
      <MarkdownPage filepath={filepath} locale={locale} />
    </>
  );
}

// components/pages/PostsPage.tsx
import Navbar from "@/components/Navbar";

export async function PostsPage({ locale }) {
  const t = getTranslation(locale);
  const posts = await getPostsByLocale(locale);

  return (
    <>
      {/* 決定 /posts 頁面是否要顯示類別連結,或傳 null */}
      <Navbar locale={locale} category={null} />
      <div className="container mx-auto p-4">
        <PostsList posts={posts} title={t.nav.allPosts} locale={locale} />
        {/* ... 其他內容 */}
      </div>
    </>
  );
}
```

## 下一步行動計畫

### 立即決策事項

1. **確認是否要執行這個調整**
   - 評估「讀者類別專注」的假設是否足夠強烈
   - 考慮是否先進行小規模 A/B 測試

2. **選擇實作方案**
   - 推薦:方案一(URL 路徑判斷)+ 改良版
   - 評估技術可行性和維護成本

3. **決定多分類文章的處理方式**
   - 檢視 14 篇文章,確認主要類別
   - 或接受 categories[0] 作為主要類別

### 實施階段

**Phase 1: 核心功能** (預計 2-3 天)
- [ ] 修改 Navbar 元件,加入情境判斷邏輯
- [ ] 更新翻譯檔案,加入新的導覽文字
- [ ] 實作文章頁面的類別判斷機制
- [ ] 本地測試各種頁面的導覽顯示

**Phase 2: 改善可發現性** (預計 1-2 天)
- [ ] 建立 Footer 元件,加入「瀏覽全部文章」連結
- [ ] 更新關於頁面,說明網站架構
- [ ] 檢視多分類文章,調整 categories 順序(如需要)

**Phase 3: 部署與監控** (持續)
- [ ] 部署到生產環境
- [ ] 設定 GA 事件追蹤(如有使用)
- [ ] 監控關鍵指標:跳出率、頁面瀏覽量、類別頁流量
- [ ] 收集使用者回饋

### 需要進一步研究的問題

如果在實施過程中遇到以下問題,可能需要額外的技術研究:

1. **Next.js App Router 中 Server/Client Component 的資料傳遞**
   - 如何優雅地將文章類別資訊傳遞給 Navbar
   - 是否有更好的架構模式

2. **SEO 影響評估**
   - 移除「全部文章」連結是否影響 `/posts` 的索引
   - 是否需要在 sitemap 或其他地方特別處理

3. **多分類文章的最佳實踐**
   - 是否應該建立「主要類別」和「次要類別」的概念
   - 或完全移除多分類,強制單一分類

### 是否需要撰寫 PRD?

**建議**: 如果決定執行這個調整,**不一定需要完整的 PRD**,因為:
- 功能範圍明確,主要是 UI/UX 調整
- 技術實作方向已經在本研究中分析清楚
- 變動範圍有限(主要在 Navbar 元件)

但可以考慮撰寫一個**簡化版的實作規格文件**,包含:
- 導覽邏輯的明確規則(什麼頁面顯示什麼連結)
- UI/UX 的視覺規格(如有需要)
- 測試案例(各種頁面的導覽顯示驗證)

如果後續發現需要更大規模的功能擴展(例如:引入標籤系統、個人化推薦等),則建議撰寫完整的 PRD。

## 參考資料

### 技術文件
- [Next.js App Router - Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Next.js - usePathname Hook](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [React Server Components vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

### 實作參考
- 專案程式碼:
  - [components/Navbar.tsx](components/Navbar.tsx) - 當前導覽列實作
  - [lib/posts.ts](lib/posts.ts) - 文章資料處理邏輯
  - [app/[locale]/layout.tsx](app/[locale]/layout.tsx) - Layout 結構

### UX 設計考量
- [Information Architecture - Context-Sensitive Navigation](https://www.nngroup.com/articles/contextual-navigation/)
- [Navigation Design Patterns](https://ui-patterns.com/patterns/navigation)

### 延伸閱讀
- 考慮引入「標籤系統」作為分類的補充
- 研究「個人化推薦」功能,根據讀者行為調整內容
- 探索「相關文章」功能,在文章底部推薦同類別內容

---

**研究完成日期**: 2025-10-11
**研究者**: Claude (Sonnet 4.5)
**版本**: 1.0
