# 文章歸檔機制與目錄結構重組研究

**日期：** 2026-02-07
**狀態：** 完成

## 1. 執行摘要

本研究針對部落格在長達 26 年（2000-2026）累積了 1,486 篇文章後所面臨的兩個管理問題進行分析：一是品質參差不齊的舊文章淹沒了優質內容，需要一個歸檔機制來區分；二是 `public/posts/` 目錄下有近 1,500 個子目錄平鋪，造成日常管理上的困難。

經過深入分析現有架構後，研究發現這兩個需求可以透過一個巧妙的「分組目錄」機制同時解決——在 `public/posts/` 下增加一層可任意命名的分組目錄（如 `2026/`、`archives/`），讓程式在讀取時自動略過這一層。這個方案的核心優勢是：文章的 URL 完全不受影響，程式改動極小，而且能同時達成歸檔分類和目錄管理兩個目標。

## 2. 背景與脈絡

### 專案概況

這是一個基於 Next.js 15 的靜態部落格，採用 App Router 架構，以 `output: "export"` 模式產生純靜態網站。文章以 Markdown 格式存放在 `public/posts/` 目錄下，每篇文章一個目錄，支援繁體中文、日文、英文三種語言。

### 現有目錄結構

```
public/posts/
├── 2000-02-04_2007春季留言板/
│   └── index.md
├── 2004-01-08_freebsd-ports/
│   └── index.md
├── ...（中間省略約 1,484 個目錄）...
├── 2026-02-03_point-card-belonging/
│   ├── index.md
│   ├── index.ja.md
│   └── index.en.md
└── 2026-02-06_the-door-opened-by-openclaw/
    ├── index.md
    ├── index.ja.md
    └── index.en.md
```

### 面臨的問題

**管理上的痛苦：** 1,486 個目錄全部平鋪在 `public/posts/` 下，在編輯器或檔案管理器中展開時，需要在漫長的清單中尋找目標文章。這對日常新增和編輯文章造成了明顯的效率問題。

**內容品質問題：** 26 年間的文章品質自然有高有低。早期的文章很多只是簡短的筆記或者已經過時的技術內容，與近年精心撰寫的長文混在同一個列表中，降低了整體閱讀體驗。

## 3. 研究問題與發現過程

### 初始需求

使用者提出了兩個獨立但相關的需求：

1. **歸檔機制：** 將品質較差的舊文章從主列表移除，放到獨立的 Archives 頁面
2. **目錄重組：** 在 `public/posts/` 下增加年份目錄層，減少單一目錄的子目錄數量

### 需求釐清

經過討論後，明確了以下關鍵決策：

- **歸檔策略：** 以年份為基準切分，2019 年（含）以前的文章歸入 Archives
- **歸檔呈現：** 獨立的 `/archives` 頁面，從主列表底部提供入口連結
- **URL 穩定性：** 所有文章的 URL 必須維持不變（`/posts/{slug}` 格式不能改）
- **目錄分組概念：** 使用者提出了一個很好的想法——分組目錄可以是任意名稱（如 `2026`、`archives`），程式讀取時會自動略過這一層。這樣既能用來做年份分組，也能用來做歸檔分組

### 文章數量分佈

統計各年份的文章數量後，歸檔切分的影響如下：

| 分組 | 年份範圍 | 文章數 | 佔比 |
|------|---------|--------|------|
| **Archives** | 2000–2019 | 1,396 篇 | 94% |
| **主列表** | 2020–2026 | 90 篇 | 6% |

各年度細目（2019 年以前）：

| 年份 | 篇數 | 年份 | 篇數 |
|------|------|------|------|
| 2000 | 1 | 2010 | 65 |
| 2003 | 4 | 2011 | 24 |
| 2004 | 105 | 2012 | 19 |
| 2005 | 327 | 2013 | 8 |
| 2006 | 269 | 2014 | 8 |
| 2007 | 286 | 2015 | 19 |
| 2008 | 91 | 2016 | 31 |
| 2009 | 87 | 2017 | 17 |
| | | 2018 | 23 |
| | | 2019 | 12 |

各年度細目（2020 年以後，留在主列表）：

| 年份 | 篇數 |
|------|------|
| 2020 | 17 |
| 2021 | 8 |
| 2022 | 8 |
| 2023 | 28 |
| 2024 | 14 |
| 2025 | 11 |
| 2026 | 4 |

歸檔後主列表只剩 90 篇文章，瀏覽體驗會大幅改善。2004–2007 年間的文章最為密集（共 987 篇，佔總量的 66%），這些應該是早期密集紀錄的時期，也最適合歸檔。

## 4. 技術分析

### 4.1 現有文章讀取機制

目前 `lib/posts.ts` 中的 `getAllPostMetadata()` 函式是整個系統的核心。它的讀取邏輯非常直接：

```typescript
const postsDirectory = path.join(process.cwd(), "public/posts");

async function getAllPostMetadata() {
  const entries = await fs.promises.readdir(postsDirectory, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory());
  // 直接將每個子目錄當作一篇文章來處理
}
```

這個邏輯目前假設 `public/posts/` 下的每個子目錄都是一篇文章。要支援分組目錄，需要改為遞迴掃描或兩層掃描。

### 4.2 Slug 與 URL 的獨立性

一個關鍵的好消息是：文章的 slug（也就是 URL 中的識別符）與目錄的物理路徑是完全獨立的。Slug 的來源優先順序是：

1. Frontmatter 中的 `slug` 欄位
2. 中文主檔案的 `slug` 欄位
3. 目錄名稱本身

這意味著，即使我們把文章從 `public/posts/2024-01-01_title/` 移到 `public/posts/2024/2024-01-01_title/`，只要目錄名稱 `2024-01-01_title` 不變，slug 就不會改變，URL 也就不會改變。

### 4.3 靜態匯出與路由

`generateStaticParams()` 依賴 `getSingletonPostMetadata()` 來產生所有文章的靜態路由參數。只要 metadata 收集邏輯正確掃描到所有文章，路由產生就不會受影響。

### 4.4 相關聯的系統

以下系統會受到文章讀取邏輯變更的影響，需要一併檢查：

- **RSS 產生器** (`scripts/generate-rss.ts`)：使用相同的 `posts.ts` 模組
- **封面圖片路由** (`app/posts/[slug]/cover.*/`)：使用 `getSingletonPostMetadata()`
- **分類頁面** (`fetchCategoryPosts()`)：基於 `getSingletonPostMetadata()`
- **文章計數** (`getPostCountByLocale()`)：基於 `getPostsByLocale()`

由於這些系統都依賴同一個底層函式 `getAllPostMetadata()`，只要這個函式正確改動，上游所有功能都會自動正確運作。

## 5. 解決方案

### 方案概述：分組目錄 + 歸檔機制

這個方案的核心概念是在 `public/posts/` 下引入一層「分組目錄」，程式會自動遍歷這些分組目錄來找到實際的文章目錄。分組目錄的名稱可以是任意的——年份、`archives`、或任何有意義的名稱。

#### 目標目錄結構

```
public/posts/
├── archives/                          # 歸檔文章（2019 年及以前，共 1,396 篇）
│   ├── 2000-02-04_2007春季留言板/
│   ├── 2004-01-08_freebsd-ports/
│   └── ...
├── 2020/                              # 2020 年文章（17 篇）
├── 2021/                              # 2021 年文章（8 篇）
├── 2022/                              # 2022 年文章（8 篇）
├── 2023/                              # 2023 年文章（28 篇）
├── 2024/                              # 2024 年文章（14 篇）
├── 2025/                              # 2025 年文章（11 篇）
└── 2026/                              # 2026 年文章（4 篇）
    ├── 2026-02-03_point-card-belonging/
    └── 2026-02-06_the-door-opened-by-openclaw/
```

#### 程式變更：`lib/posts.ts`

`getAllPostMetadata()` 函式需要改為兩層掃描：

```typescript
async function getAllPostMetadata(): Promise<Record<string, PostMetadata>> {
  const groupEntries = await fs.promises.readdir(postsDirectory, {
    withFileTypes: true,
  });
  const groupDirs = groupEntries.filter((entry) => entry.isDirectory());

  const posts: Record<string, PostMetadata> = {};

  await Promise.all(
    groupDirs.map(async (groupDir) => {
      const groupPath = path.join(postsDirectory, groupDir.name);
      const postEntries = await fs.promises.readdir(groupPath, {
        withFileTypes: true,
      });
      const postDirs = postEntries.filter((entry) => entry.isDirectory());

      await Promise.all(
        postDirs.map(async (postDir) => {
          const dirPath = path.join(groupPath, postDir.name);
          // ... 現有的文章處理邏輯保持不變 ...
        })
      );
    })
  );

  return posts;
}
```

關鍵的改動只有一個：原本直接掃描 `public/posts/` 下的目錄，改為先掃描分組目錄，再掃描各分組目錄下的文章目錄。文章目錄內部的處理邏輯完全不變。

#### 新增：歸檔資訊的攜帶

為了讓前端知道哪些文章是歸檔的，需要在 metadata 中攜帶分組資訊：

```typescript
interface PostMetadata {
  slug: string;
  filePath: string;
  group: string;  // 新增：分組目錄名稱，如 "2026"、"archives"
}
```

同時在 `PostData` 型別中也加入：

```typescript
export type PostData = {
  // ... 現有欄位 ...
  archived: boolean;  // 新增：是否為歸檔文章
};
```

判斷是否為歸檔的邏輯可以基於分組目錄名稱。例如，`archives` 目錄下的文章標記為 `archived: true`。

#### 文章列表頁面的改動

**主列表 (`PostsPage`)：** 過濾掉 `archived: true` 的文章，只顯示非歸檔文章。在列表底部加上「查看歸檔文章」的連結。

**歸檔頁面（新增 `/archives`）：** 建立一個新的 Archives 頁面，只顯示 `archived: true` 的文章。這個頁面的渲染邏輯可以複用現有的 `PostsList` 元件。

#### 分類頁面的改動

`/tech` 和 `/life` 分類頁面也需要排除歸檔文章，以維持一致性。可以在 `fetchCategoryPosts()` 中加入過濾。

### 方案評估

- **實作複雜度：低** — 核心改動只在 `getAllPostMetadata()` 函式，增加一層目錄遍歷
- **URL 影響：無** — slug 來自目錄名稱或 frontmatter，與分組目錄無關
- **向後相容性：高** — 只要遷移腳本正確執行，所有現有功能都不受影響
- **靈活性：高** — 分組目錄名稱自由，可以是年份、`archives`、或任何名稱
- **風險：低** — 由於是靜態匯出，建置時就能驗證所有頁面是否正確產生

### 需要注意的邊緣情況

1. **圖片路徑：** Markdown 中引用的相對圖片路徑（如 `./assets/photo.jpg`）不會受影響，因為它們是相對於 Markdown 文件的位置。但如果有文章使用絕對路徑引用圖片（如 `/posts/2024-01-01_title/images/photo.jpg`），加入分組目錄層後這些路徑會斷掉。需要檢查是否存在這類引用。

2. **RSS feed：** `scripts/generate-rss.ts` 如果也使用 `posts.ts` 的函式，則會自動正確運作。如果它有自己的文章掃描邏輯，需要一併更新。

3. **建置時間：** 多一層目錄掃描對建置時間的影響微乎其微。

4. **文章目錄中的子目錄：** 部分文章目錄下有 `assets/` 子目錄存放圖片。兩層掃描邏輯需要確保不會把 `assets/` 誤認為文章目錄。目前的檢查機制（要求目錄內有 `.md` 文件）已經能防止這個問題，但加入分組目錄後，掃描第二層時也需要這個檢查，或者更好的做法是：在第二層掃描時，如果一個子目錄下有 `.md` 檔案就當作文章目錄，否則跳過它。

5. **空分組目錄：** 如果某個分組目錄（如 `2027/`）是空的，程式應該能正常處理而不報錯。

### 遷移計畫

遷移腳本的行為：

1. 在 `public/posts/` 下建立分組目錄：`archives/`、`2020/`、`2021/`、`2022/`、`2023/`、`2024/`、`2025/`、`2026/`
2. 掃描所有文章目錄，根據日期前綴判斷年份：
   - 2019 年（含）以前 → 移入 `archives/`（共 1,396 篇）
   - 2020 年（含）以後 → 移入對應年份目錄（共 90 篇）
3. 更新 `lib/posts.ts` 的讀取邏輯
4. 新增 Archives 頁面
5. 執行完整建置驗證

## 6. 建議與決策指引

基於以上分析，建議採用「分組目錄」方案。這個方案最大的優勢是它的簡潔性和靈活性——只需要改動一個函式的目錄掃描邏輯，就能同時解決歸檔和目錄管理兩個問題。

歸檔切分年份確定為 **2019 年（含）以前**。這個切分點將 94% 的文章（1,396 篇）歸入 Archives，主列表只保留 90 篇近年文章，瀏覽體驗會有質的飛躍。

2020 年以後的文章則按年份分入各自的年度目錄（`2020/` ~ `2026/`），每個目錄最多 28 篇（2023 年），管理上非常輕鬆。

## 7. 下一步行動計畫

實施建議分為兩個階段進行：

**第一階段：核心功能實作**
1. 修改 `lib/posts.ts` 的 `getAllPostMetadata()`，支援兩層目錄結構
2. 在 `PostData` 中加入 `archived` 欄位
3. 修改文章列表頁面，過濾歸檔文章
4. 新增 `/archives` 頁面
5. 在主列表底部加入 Archives 入口連結
6. 撰寫遷移腳本，將文章搬入分組目錄
7. 執行建置驗證

**第二階段：優化與收尾**
1. 確認所有圖片路徑正確
2. 確認 RSS feed 正確運作（可能需要決定歸檔文章是否出現在 RSS 中）
3. 確認 SEO 相關設定（sitemap 等）

### PRD 建議

由於這個需求涉及目錄結構變更、新增頁面、修改多個元件，建議撰寫一個 PRD 來定義具體的實作規格，特別是：
- Archives 頁面的設計細節（標題、入口連結的文案與位置）
- 遷移腳本的具體行為與驗證方式
- 分類頁面（tech/life）是否也要排除歸檔文章

## 8. 參考資料

- **Next.js 靜態匯出文件：** [Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- **現有程式碼：** `lib/posts.ts`（核心文章管理）、`components/PostsList.tsx`（列表渲染）、`components/pages/PostsPage.tsx`（列表頁面）
