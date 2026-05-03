# 文章列表頁面 redesign 設計

## 目標

改善文章列表頁面（`/[locale]/life`、`/[locale]/tech`、`/zh/archives`）的視覺
與資訊密度，並順帶把全站基礎字級放大以改善手機閱讀體驗。三個頁面共用
`PostList.astro` 元件，本次 redesign 主要改這個元件與其資料來源；字級調整
則影響全站。

### 現況痛點

- 封面縮圖（120px 寬，原圖比例）把每行撐高，標題卻貼在頂端，視覺上失衡。
- 行與行之間沒有明確分隔，整頁看起來像散落的內容。
- 只有日期 + 標題 + 縮圖，讀者沒有額外資訊判斷是否要點進去。
- 手機上字級偏小，閱讀吃力。

## 範圍

**會修改：**

- `src/styles/global.css` — `html { font-size: 16px }` → `20px`（120%）
- `src/components/PostList.astro` — 改版面為「雜誌列」樣式
- `src/lib/posts.ts` — `PostMeta` 增加 `excerpt` 欄位
- `src/lib/excerpt.ts`（新檔）— 從 markdown body 萃取摘要的 helper

**不會動：**

- 路由、URL、SEO、RSS
- 文章內容與 frontmatter schema（`description` 欄位本來就支援，沒人用而已）
- 其他元件用 rem 寫死的數值不動 —— 它們會自動跟著 base 放大
- 字型族系、色票

## 全站字級調整

`src/styles/global.css` 將 `html { font-size: 16px }` 改為 `20px`，
所有以 rem 為單位的尺寸（全站絕大多數樣式都是）自動同比例放大。

> 註：mockup 階段嘗試的是 120%（19.2px），落地改為 20px —— 視覺上幾乎無感，
> 但 1rem = 20px 對開發者更友善。

不需個別調整其他元件 —— 它們的 rem 數值維持原樣即可。視覺驗證階段
若發現某些區塊在新字級下顯得過大或破版（例如 nav 換行），再於該元件內
微調。

## 版面設計

### 排版規格（桌面）

每一篇文章為一個橫向 row：

- **左**：縮圖框（`<div class="thumb-frame">` 包 `<img>`）
  - 固定尺寸 `140 × 105`（4:3）
  - `border-radius: 6px`，`overflow: hidden`
  - 背景色 `var(--color-border)`（載入中 / 無圖時的視覺基底）
  - `<img>` 在框內 `width: 100%; height: 100%; object-fit: cover; display: block` —— 永遠裁切、絕不拉伸
- **右**：`<div class="body">` 垂直堆疊三段
  - 日期（`MM-DD`，serif，`0.78rem`，`color: var(--color-text-subtle)`）
  - 標題（`1.1rem`，`color: var(--color-text)`，`line-height: 1.4`）
  - 摘要（`0.85rem`，`color: var(--color-text-muted)`，`line-height: 1.6`，限 2 行 `-webkit-line-clamp: 2`）
  - body gap `0.4rem`
- **row 整體**：`display: flex`，`align-items: center`，`gap: 1.25rem`，`padding: 1.15rem 0`
- **分隔**：`border-bottom: 1px solid var(--color-border)`，`:last-child` 不加底線

年份 heading（`<h2>`）維持現況：serif，`1.5rem`，muted 色，下方 `1.5rem` 空白。

### 為什麼固定尺寸 + 垂直置中

縮圖大小若隨 row 內容長短伸縮，每篇 row 的視覺重量會不一致，整頁
看起來不齊。固定 4:3 桌面 / 1:1 手機的尺寸保證每 row 一致；當文字
高度（2 / 3 行）與縮圖高度不完全相等時，用 `align-items: center`
讓兩者垂直對齊，不會出現「文字貼縮圖頂端、底部空一截」或反之。

### 無封面 / 無摘要的退化

- **無封面**：仍渲染 `thumb-frame`（同尺寸），但內容換成 placeholder ——
  斜紋背景：
  ```css
  .thumb-frame.thumb-placeholder {
    background: repeating-linear-gradient(
      45deg,
      var(--color-border) 0 8px,
      var(--color-bg-elevated) 8px 16px
    );
  }
  ```
  斜紋的視覺意圖是「沒有圖」而非「圖載入失敗」。每 row 的縮圖位置
  維持一致，標題不會跳回靠左破壞節奏。
- **無摘要**（body 清理後為空、且無 `frontmatter.description`）：摘要那行不
  渲染，row 高度自然壓縮為日期 + 標題；縮圖尺寸不變、垂直置中。

### 響應式

mobile 寬度（`max-width: 640px`）下：

- 縮圖框改為 **`105 × 105`（1:1，正方形）** —— 縮圖比例與桌面不同，
  目的是讓 row 高度與 2 行摘要的文字塊匹配（手機字級在 row 中佔的
  比例較高）
- 標題降為 `1rem`，`line-height: 1.35`
- 摘要降為 `0.82rem`，`line-height: 1.55`
- row gap `0.85rem`，padding `0.95rem 0`
- body gap `0.3rem`

> 由於全站 base 已是 20px，這些 rem 數值在手機上的絕對 px 比舊版本更大，
> 整體可讀性提升。

## 摘要萃取

新增 `src/lib/excerpt.ts`，輸出 `extractExcerpt(body: string, description?: string): string`。

### 來源優先序

1. 如果 `frontmatter.description` 有值，直接使用（仍套用截斷）
2. 否則從 markdown body 萃取首段

### 清理規則

從 body 取段落前依序剝除：

1. Fenced code block：` ``` ... ``` `
2. Obsidian wiki link：`![[...]]`
3. Markdown image：`![alt](url)`
4. Markdown link 保留文字：`[text](url)` → `text`
5. 標題行：以 `#` 開頭的整行（整段被視為空）
6. HTML tag：`<...>`
7. 段內多餘空白合併為單一空白，trim

### 段落串接

清理後從第一個非空段落開始累積，直到總長度達到 SOFT_LIMIT (80) 為止；
段落之間以單一半形空白接合。這避免「首段是一句短對話」時摘要過於簡短
（例如以引號開頭的問句或單行回答），讓後段更具資訊量的內容也能進入摘要。
若首段已達或超過 SOFT_LIMIT，後段不會被讀取。

### 截斷規則

定義句點集合：`。．.！？!?`

依下列順序決定截斷位置：

1. 在前 80 字內，找最後一個句點，於該句點後切斷（保留句點）
2. 若 80 字內沒有句點，往後找到 100 字內的句點切斷
3. 若 100 字內仍沒有句點，硬切到 80 字並附 `⋯`

回傳結果不再附句點以外的標點修飾。

### 邊界情況

- 空 body → 回傳空字串
- 純圖文章 → 回傳空字串
- 全部都是 code block → 回傳空字串（清理後為空）
- 字數計算以 JavaScript 字串長度為準（CJK 一字一單位、surrogate pair 算 2，足夠用）

## 資料層改動

### `PostMeta`（`src/lib/posts.ts`）

```ts
export interface PostMeta {
  // ... existing fields
  excerpt: string;  // 新增；空字串代表無摘要
}
```

### `toMeta()`

於回傳前加上：

```ts
const excerpt = extractExcerpt(entry.body ?? '', entry.data.description);
```

`entry.body` 是 Astro Content Collection 的原始 markdown 字串，build 時可用，
不需額外 IO。

### 翻譯繼承

目前 `getAllPosts()` 末段有「翻譯檔繼承 zh sibling 的 category / slug」邏輯。
**摘要不繼承** —— 各 locale 的 body 各自萃取，因為翻譯檔內容是該語言的。
若翻譯檔沒有 body（罕見）會得到空字串，UI 會自然不渲染摘要行。

## 實作順序建議

1. 寫 `extractExcerpt` + 單元測試（vitest）
2. 在 `PostMeta` / `toMeta` 接上
3. 改 `global.css` 的 base font-size
4. 改 `PostList.astro` 版面（含 stretch 對齊與 mobile 響應）
5. 視覺驗證（dev server，三個頁面 × 三個 locale × 桌面/手機都看一輪）

## 測試

### 單元測試（`src/lib/excerpt.test.ts`）

涵蓋情境：

- 純文字 body，首段短於 80 字 → 整段回傳
- 首段長且含句點 → 在句點處切
- 首段 80 字內無句點，100 字內有 → 在 100 字內句點切
- 完全沒有句點 → 80 字硬切 + `⋯`
- 含 wiki link / markdown image / heading → 正確剝除
- 空 body → 空字串
- 純 code block → 空字串
- frontmatter `description` 優先於 body
- 英文句號正確識別（`.` 後面有空格）

### 視覺驗證

啟動 dev server，逐一檢查：

- `/zh/life`、`/zh/tech`、`/zh/archives`
- `/ja/life`、`/ja/tech`
- `/en/life`、`/en/tech`
- 桌面寬度與 375px 手機寬度都看
- 確認：摘要正確截斷、無封面時 placeholder 顯示斜紋且 row 對齊一致、
  img 沒有變形、所有 row 縮圖尺寸一致、全站字級放大後其他頁面
  （首頁、文章內頁、Header、Footer）也仍然正常

## 不在範圍內

- 不重新設計首頁
- 不調整文章內頁
- 不加 tag / 搜尋 / 分頁等新功能
- 不改 frontmatter schema
- 不改色票或字型
