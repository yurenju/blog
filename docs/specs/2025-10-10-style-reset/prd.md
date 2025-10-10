# PRD: 部落格樣式重置

## 簡介/概述

本 PRD 定義了多語言部落格的樣式重置需求,目的是將所有自定義樣式移除,回到 Tailwind CSS 和 shadcn/ui 的預設狀態,為未來的極簡風格重新設計建立乾淨的基礎。

基於 `docs/research/2025-10-10-style-reset-for-redesign.md` 中的研究發現,目前的樣式系統存在以下問題:
- 混用硬編碼顏色和語意化顏色,導致深色模式表現不一致
- 樣式分散在 CSS 檔案和元件中,缺乏統一管理
- 未針對多語言閱讀體驗進行整體規劃

此次重置將完全移除自定義樣式,僅保留必要的功能性樣式(如語法高亮和 YouTube 嵌入的響應式布局),讓網站回到框架的預設狀態。

## 目標

1. **完全重置自定義樣式**:移除所有 `globals.css` 和元件中的自定義樣式設定
2. **保留框架預設行為**:確保 Tailwind CSS 和 shadcn/ui 的預設樣式正常運作
3. **維持核心功能**:所有功能(導航、語言切換、主題切換、文章顯示)保持正常運作
4. **保留必要樣式**:語法高亮樣式和 YouTube 嵌入響應式布局必須保留
5. **建立重新設計基礎**:為後續的極簡風格重新設計提供乾淨的起點

## 使用者故事

### 故事 1: 開發者準備重新設計
**身份**: 部落格維護者
**需求**: 我想要移除所有自定義樣式
**目的**: 以便從乾淨的狀態開始重新設計,避免舊樣式的干擾

**驗收標準**:
- 所有 `globals.css` 中的自定義樣式已移除
- 所有元件中的硬編碼樣式 class 已移除
- 網站回到 Tailwind 和 shadcn/ui 預設狀態

### 故事 2: 使用者瀏覽基本狀態的網站
**身份**: 部落格讀者
**需求**: 我想要在樣式重置後仍能正常瀏覽文章
**目的**: 確保基本功能不受影響

**驗收標準**:
- 能夠正常瀏覽文章內容(雖然樣式最小化)
- 深色/淺色模式切換功能正常
- 語言切換功能正常
- 導航功能正常
- 程式碼區塊正常顯示且有語法高亮

### 故事 3: 開發者驗證深色模式
**身份**: 部落格維護者
**需求**: 我想要確認深色模式回到預設狀態
**目的**: 確保沒有硬編碼顏色造成深色模式顯示異常

**驗收標準**:
- 切換到深色模式時,所有元素使用 shadcn/ui 的深色模式顏色變數
- 沒有元素出現淺色模式的顏色(如研究報告中提到的 hover 問題)
- 文字顏色、背景顏色都正確對應深色主題

## 功能需求

### FR-1: 重置 globals.css 自定義樣式

**FR-1.1**: 移除 body 字型設定(第 67-68 行)
- 移除 `font-family: var(--font-noto-sans-tc), sans-serif;`
- 讓字型回到 Tailwind 預設

**FR-1.2**: 移除 homepage 特殊字型設定(第 70-76 行)
- 移除 `h1.homepage-title` 的字型設定
- 移除 `p.homepage-description` 的字型設定

**FR-1.3**: 移除所有 .article 相關樣式(第 78-122 行)
- 移除 `.article strong` 樣式
- 移除 `.article p` 及其變體的樣式
- 移除 `.article-title` 字型設定
- 移除 `.article blockquote` 樣式
- 移除 `.article h2, h3, h4` 樣式
- 移除 `.article ul, ol` 樣式
- 移除 `.article a` 樣式

**FR-1.4**: 移除 YouTube 嵌入自定義樣式,保留響應式布局(第 194-205 行)
- 移除 `.youtube-embed` 的自定義樣式(my-6)
- 保留響應式容器結構(relative, padding-bottom: 56.25%, overflow: hidden)
- 保留 iframe 的響應式定位(absolute, top-0, left-0, w-full, h-full)

**FR-1.5**: 完整保留語法高亮樣式(第 124-193 行)
- 保留所有與 rehype-pretty-code 相關的樣式
- 包含: pre code 樣式、inline code 樣式、Shiki 主題變數、行高亮、字元高亮、行號顯示

**FR-1.6**: 保留框架核心設定
- 保留 @tailwind 指令(第 1-3 行)
- 保留 shadcn/ui 顏色變數定義(第 5-59 行)
- 保留基礎 border 和 body 設定(第 62-66 行)

### FR-2: 重置元件內嵌樣式

**FR-2.1**: 重置 PostsList.tsx 樣式
- 第 68 行: 移除 `hover:bg-gray-100 dark:hover:bg-gray-700 p-1 pl-3 mb-2 rounded-lg transition-colors`
- 第 74 行: 移除 `text-gray-500 dark:text-gray-400 text-sm min-w-[80px] text-center`
- 第 77 行: 移除 `text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300`
- 保留結構性樣式: `flex items-center gap-1`, `min-w-[80px]`

**FR-2.2**: 重置 HomePage.tsx 樣式
- 第 13 行: 移除 `text-xl tracking-wide`
- 第 14 行: 移除 `gap-4 mt-20 mb-4`
- 第 23-24 行: 移除 `mt-4 text-4xl font-bold`,移除 `homepage-title` class
- 第 26 行: 移除 `text-gray-700 dark:text-gray-400 mb-4 leading-9 font-medium md:font-normal`,移除 `homepage-description` class
- 第 32 行: 移除 `gap-2 text-md`
- 保留結構性樣式: 布局相關的 `flex`, `items-center`, `justify-center` 等

**FR-2.3**: 重置 PostDetailPage.tsx 樣式
- 第 28 行: 移除 `mb-48`
- 第 29 行: 移除 `mb-6`,移除 `article-title` class
- 第 38 行: 移除 `font-light text-lg leading-10 md:leading-relaxed text-justify`
- 第 42 行: 移除 `text-gray-400 dark:text-gray-500 text-right mt-6`,移除字型 class
- 保留結構性樣式: `container mx-auto p-4`

**FR-2.4**: 重置 Navbar.tsx 樣式
- 第 15 行: 移除 `border-b-2`,保留 `border-b border-border`
- 第 16 行: 移除 `gap-4`
- 第 22 行: 移除 `gap-1`
- 保留結構性樣式: 布局和定位相關樣式

**FR-2.5**: 重置 RootLayoutContent.tsx 和 layout.tsx 樣式
- 移除 body 上的所有排版樣式: `text-base leading-relaxed tracking-wide md:tracking-wide md:leading-8`
- 保留字型變數注入: `${notoSansTC.variable} ${notoSerifTC.variable}`
- 保留 `antialiased`

### FR-3: 驗證與測試

**FR-3.1**: 功能驗證
- 所有頁面路由正常運作(首頁、文章列表、文章詳細頁、分類頁、靜態頁面)
- 語言切換功能正常,三種語言都能正常顯示
- 深色/淺色模式切換功能正常
- 導航連結全部可用

**FR-3.2**: 樣式驗證
- 深色模式下沒有出現淺色模式的顏色
- 淺色模式下沒有出現深色模式的顏色
- 程式碼區塊的語法高亮正常運作
- YouTube 嵌入影片保持響應式比例

**FR-3.3**: 內容可讀性驗證
- 文章內容雖然樣式最小化,但仍可正常閱讀
- 標題、段落、列表等基本元素能正常顯示
- 連結可點擊且有基本的視覺區分

## 非目標(超出範圍)

本次樣式重置**不包含**以下項目:

1. **不實施新設計**: 不加入任何新的視覺設計或樣式
2. **不優化多語言字型**: 不針對不同語言設定不同字型或間距
3. **不調整布局結構**: 不修改元件的 DOM 結構或版面配置
4. **不修改功能邏輯**: 不改變任何 JavaScript/TypeScript 邏輯
5. **不更改 shadcn/ui 元件**: 不修改 `components/ui/` 下的元件
6. **不調整 Tailwind 配置**: 不修改 `tailwind.config.ts` 的設定
7. **不改進語法高亮**: 不調整程式碼高亮的配色或樣式
8. **不優化效能**: 不進行任何效能優化或程式碼重構

## 設計考量

### 保留的結構性樣式

以下類型的 Tailwind class 應該保留,因為它們是結構性的,不是裝飾性的:

- **布局**: `flex`, `grid`, `container`, `mx-auto`
- **定位**: `relative`, `absolute`, `fixed`, `top-0`, `left-0`
- **尺寸**: `w-full`, `h-full`, `max-w-3xl`, `min-w-[80px]`
- **間距(結構性)**: `p-4`(容器基本間距), `gap-*`(Flexbox/Grid 間距)
- **顯示**: `hidden`, `block`, `inline-block`

### 移除的裝飾性樣式

以下類型的樣式應該移除:

- **顏色**: 所有硬編碼的顏色 class(`text-gray-500`, `bg-blue-600` 等)
- **排版**: `text-xl`, `font-bold`, `leading-relaxed`, `tracking-wide`
- **間距(裝飾性)**: `mt-20`, `mb-48`, `pl-3`
- **效果**: `rounded-lg`, `transition-colors`
- **特殊字型 class**: `homepage-title`, `article-title`, `homepage-description`

### YouTube 嵌入處理

保留響應式布局的核心樣式:

```css
.youtube-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.youtube-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

## 技術考量

### 字型回退機制

移除自定義字型設定後,瀏覽器將使用以下回退順序:
1. Tailwind 的預設字型堆疊
2. 瀏覽器預設的系統字型

對於中文內容,現代瀏覽器通常會自動選擇合適的中文字型(如 Microsoft JhengHei, PingFang TC 等)。

### shadcn/ui 預設顏色系統

重置後,所有顏色將使用 `globals.css` 第 5-59 行定義的 CSS 變數:
- `--background`, `--foreground`
- `--primary`, `--secondary`
- `--muted`, `--accent`
- 等等

這些變數在淺色和深色模式下有不同的值,確保主題切換正常運作。

### 依賴關係

此重置不影響以下依賴:
- Next.js 15 框架
- Tailwind CSS 3.4.16
- shadcn/ui 元件
- next-themes
- rehype-pretty-code(語法高亮)

### 測試建議

建議在以下環境測試:
1. **瀏覽器**: Chrome, Firefox, Safari, Edge
2. **主題**: 淺色模式和深色模式
3. **語言**: 繁體中文(zh)、英文(en)、日文(ja)
4. **頁面**: 首頁、文章列表、文章詳細頁、分類頁、靜態頁面

## 驗收標準

### 主要驗收標準

1. ✅ **globals.css 重置完成**
   - 已移除 body 字型設定
   - 已移除 homepage 字型設定
   - 已移除所有 .article 樣式
   - 已調整 YouTube 嵌入樣式(移除裝飾,保留結構)
   - 已完整保留語法高亮樣式
   - 已保留 shadcn/ui 顏色變數

2. ✅ **元件樣式重置完成**
   - PostsList.tsx: 已移除所有裝飾性樣式,保留結構
   - HomePage.tsx: 已移除所有裝飾性樣式,保留結構
   - PostDetailPage.tsx: 已移除所有裝飾性樣式,保留結構
   - Navbar.tsx: 已移除裝飾性樣式,保留結構
   - Layout 檔案: 已移除排版樣式,保留字型變數

3. ✅ **功能驗證通過**
   - 所有頁面路由正常
   - 語言切換正常(zh/en/ja)
   - 深色/淺色模式切換正常
   - 導航功能正常

4. ✅ **深色模式驗證通過**
   - 深色模式下沒有出現淺色元素
   - 所有文字顏色正確
   - 背景顏色正確
   - Hover 狀態使用 shadcn/ui 預設行為

5. ✅ **內容顯示驗證通過**
   - 文章內容可正常閱讀
   - 程式碼區塊有語法高亮
   - YouTube 影片保持響應式比例
   - 圖片正常顯示

### 回歸測試

以下功能必須保持正常運作:
- ✅ RSS feed 生成
- ✅ 靜態匯出 build
- ✅ Markdown 渲染
- ✅ 圖片優化
- ✅ 多語言路由
- ✅ SEO metadata

## 實施步驟建議

建議按以下順序實施:

1. **建立功能分支**: `git checkout -b feature/style-reset`
2. **重置 globals.css**: 依照 FR-1 執行
3. **重置元件樣式**: 依照 FR-2 執行
4. **本地測試**: 運行開發伺服器,驗證基本功能
5. **深色模式測試**: 切換主題,確認無顏色異常
6. **多語言測試**: 測試三種語言的顯示
7. **Build 測試**: 執行 `npm run build` 確認靜態匯出成功
8. **提交變更**: 建立 commit 並推送到遠端

## 開放問題

目前沒有開放問題。所有需求已明確定義。

## 參考資料

1. **研究文件**: `docs/research/2025-10-10-style-reset-for-redesign.md`
   - 提供詳細的現況分析和問題根源追蹤
   - 包含業界最佳實踐研究
   - 說明需要重置的樣式範圍

2. **技術文件**:
   - [Tailwind CSS 文件](https://tailwindcss.com/)
   - [shadcn/ui 文件](https://ui.shadcn.com/)
   - [Next.js App Router](https://nextjs.org/docs/app)

3. **專案文件**:
   - `CLAUDE.md`: 專案架構說明
   - `README.md`: 專案概述
