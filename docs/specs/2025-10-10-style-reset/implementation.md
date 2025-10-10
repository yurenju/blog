# 實作計畫

## PRD 參考

**PRD 文件路徑:** `docs/specs/2025-10-10-style-reset/prd.md`
**相關研究文件:** `docs/research/2025-10-10-style-reset-for-redesign.md`

> **重要提醒:** 實作過程中請經常參考上述文件以了解:
>
> - 功能的商業目標和用戶價值:為極簡風格重新設計建立乾淨基礎
> - 完整的用戶故事和使用場景:確保基本功能和閱讀體驗不受影響
> - 非功能性需求:保留語法高亮、YouTube 嵌入響應式布局
> - 系統架構和技術決策的背景脈絡:區分結構性樣式和裝飾性樣式
> - 研究文件中的深入分析和建議:深色模式問題根源、樣式分散問題

## 相關檔案

### 需要修改的檔案

- `app/globals.css` - 全域樣式檔案,需移除自定義樣式並保留必要部分
- `components/PostsList.tsx` - 文章列表元件,需移除硬編碼顏色和裝飾性樣式
- `components/pages/HomePage.tsx` - 首頁元件,需移除排版和顏色樣式
- `components/pages/PostDetailPage.tsx` - 文章詳細頁元件,需移除文章樣式和裝飾
- `components/Navbar.tsx` - 導航列元件,需簡化樣式
- `components/RootLayoutContent.tsx` - 多語言布局元件,需移除排版樣式
- `app/layout.tsx` - 根布局元件,需移除排版樣式

### 參考檔案

- `tailwind.config.ts` - Tailwind 配置,確認 shadcn/ui 顏色變數(無需修改)
- `components/pages/CategoryPage.tsx` - 分類頁元件(可能也需要檢視)
- `components/pages/PostsPage.tsx` - 文章列表頁元件(可能也需要檢視)

### 驗收測試

- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [x] 1. 建立功能分支
  - 1.1 已在 `feat/theme` 分支上
  - 1.2 工作目錄乾淨,準備開始實作

- [x] 2. 重置 globals.css 自定義樣式
  - 2.1 移除第 67-68 行的 body 字型設定 `font-family: var(--font-noto-sans-tc), sans-serif;`
  - 2.2 移除第 70-76 行的 homepage 特殊字型設定 (`h1.homepage-title` 和 `p.homepage-description`)
  - 2.3 移除第 78-122 行所有 `.article` 相關樣式 (strong, p, article-title, blockquote, h2-h4, ul, ol, a)
  - 2.4 調整第 194-205 行 YouTube 嵌入樣式,移除 `my-6`,保留響應式布局結構
  - 2.5 確認第 124-193 行語法高亮樣式完整保留
  - 2.6 確認第 1-3 行 @tailwind 指令、第 5-59 行 shadcn/ui 顏色變數、第 62-66 行基礎設定都已保留

- [x] 3. 重置 PostsList.tsx 元件樣式
  - 3.1 第 68 行: 移除 `hover:bg-gray-100 dark:hover:bg-gray-700 p-1 pl-3 mb-2 rounded-lg transition-colors`,保留 `flex items-center gap-1`
  - 3.2 第 74 行: 移除 `text-gray-500 dark:text-gray-400 text-sm text-center`,保留 `min-w-[80px]`
  - 3.3 第 77 行: 移除 `text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300`
  - 3.4 第 62 行: 移除 `text-xl font-semibold mb-4`
  - 3.5 第 63 行: 移除 `text-lg`

- [x] 4. 重置 HomePage.tsx 元件樣式
  - 4.1 第 13 行: 移除 `text-xl tracking-wide`,保留 `container mx-auto`
  - 4.2 第 14 行: 移除 `gap-4 mt-20 mb-4`,保留 `flex flex-col items-center max-w-sm mx-auto`
  - 4.3 第 23-24 行: 移除 `mt-4 text-4xl font-bold` 和 `homepage-title` class
  - 4.4 第 26 行: 移除 `text-gray-700 dark:text-gray-400 mb-4 leading-9 font-medium md:font-normal` 和 `homepage-description` class
  - 4.5 第 32 行: 移除 `gap-2 text-md`,保留 `flex items-center justify-center`

- [x] 5. 重置 PostDetailPage.tsx、Navbar.tsx 和 Layout 元件樣式
  - 5.1 PostDetailPage.tsx 第 28 行: 移除 `mb-48`,保留 `container mx-auto p-4`
  - 5.2 PostDetailPage.tsx 第 29 行: 移除 `mb-6` 和 `article-title` class,保留基本樣式
  - 5.3 PostDetailPage.tsx 第 38 行: 移除 `font-light text-lg leading-10 md:leading-relaxed text-justify`,保留 `article` class
  - 5.4 PostDetailPage.tsx 第 42 行: 移除 `text-gray-400 dark:text-gray-500 text-right mt-6` 和字型 class
  - 5.5 Navbar.tsx 第 15 行: 將 `border-b-2` 改為 `border-b`,保留 `border-border`
  - 5.6 Navbar.tsx 第 16 行: 移除 `gap-4`,保留其他布局樣式
  - 5.7 Navbar.tsx 第 22 行: 移除 `gap-1`,保留 `flex items-center`
  - 5.8 RootLayoutContent.tsx 和 layout.tsx: 移除 body 的所有自定義樣式,包括 `text-base leading-relaxed tracking-wide md:tracking-wide md:leading-8` 和字型變數 `${notoSansTC.variable} ${notoSerifTC.variable}`,只保留 `antialiased`

- [ ] 6. 本地測試與驗證
  - 6.1 啟動開發伺服器 `npm run dev`,檢視網站外觀
  - 6.2 測試淺色模式:檢視首頁、文章列表、文章詳細頁、分類頁
  - 6.3 測試深色模式:切換主題並檢視相同頁面,確認無淺色元素出現
  - 6.4 測試三種語言切換 (zh/en/ja),確認都能正常顯示
  - 6.5 測試導航功能,確認所有連結可用
  - 6.6 檢視文章內容,確認程式碼區塊有語法高亮
  - 6.7 確認 YouTube 嵌入影片保持響應式比例(如有)

- [ ] 7. 執行驗收測試
  - 7.1 使用 AI 讀取 `acceptance.feature` 檔案
  - 7.2 透過 MCP 瀏覽器操作執行每個場景
  - 7.3 驗證所有場景通過並記錄結果
  - 7.4 如有失敗場景,修復問題並重新測試

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑:** `docs/research/2025-10-10-style-reset-for-redesign.md`

**深色模式問題根源:**
- PostsList.tsx 的 hover 問題是使用了硬編碼的 `gray-100` 和 `gray-700`,應該使用語意化的顏色如 `hover:bg-accent`
- 研究指出:深色模式下,按鈕是深色時 hover 應該變淺才會明顯
- shadcn/ui 的顏色系統會自動處理深淺色模式,使用 CSS 變數定義的語意化顏色

**樣式分類原則:**
- **結構性樣式**(保留): `flex`, `grid`, `container`, `mx-auto`, `p-4`, `gap-*`, `w-full`, `h-full`
- **裝飾性樣式**(移除): 硬編碼顏色、排版設定、裝飾性間距、效果(rounded, transition)

**業界最佳實踐:**
- 極簡設計:充足留白、限制字型數量(不超過三種)、清晰的視覺層次
- 閱讀體驗:字型大小 16-20pt(桌面)、行距 120%、左對齊、文字寬度 600-700px
- 深色模式:避免純白配純黑、使用柔和顏色、明確的互動反饋

### 來自 PRD 的實作細節
> **文件路徑:** `docs/specs/2025-10-10-style-reset/prd.md`

**YouTube 嵌入響應式布局保留:**
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

**shadcn/ui 顏色系統:**
重置後所有顏色將使用 globals.css 定義的 CSS 變數:
- `--background`, `--foreground` (背景和前景)
- `--primary`, `--secondary` (主要和次要)
- `--muted`, `--accent` (靜音和強調)
- `--border`, `--input`, `--ring` (邊框、輸入框、焦點環)

這些變數在 `:root` 和 `.dark` 中有不同的值,確保主題切換正常。

**字型回退機制:**
移除自定義字型設定後:
1. 使用 Tailwind 預設字型堆疊
2. 瀏覽器預設系統字型
3. 中文內容會自動選擇合適字型 (Microsoft JhengHei, PingFang TC 等)

### 關鍵技術決策

**1. 完全重置策略:**
- 選擇完全移除而非選擇性保留,避免遺留問題
- 為多語言優化提供最大彈性
- 符合極簡設計理念

**2. 區分結構性和裝飾性樣式:**
- 保留結構性樣式確保布局不崩潰
- 移除裝飾性樣式回到預設狀態
- 這是重置的核心判斷標準

**3. 保留功能性樣式:**
- 語法高亮:與 rehype-pretty-code 功能直接相關
- YouTube 嵌入:響應式布局是必要功能

**4. 深色模式處理:**
- 移除所有硬編碼顏色
- 依賴 shadcn/ui 的顏色變數系統
- 確保主題切換時自動適應

**5. 測試策略:**
- 視覺測試:檢視兩種主題、三種語言
- 功能測試:路由、切換、導航
- Build 測試:確認靜態匯出正常

**注意事項:**
- 重置後網站會回到非常基本的狀態,這是預期行為
- 此重置在功能分支進行,不影響正式環境
- 後續會基於這個乾淨基礎重新設計樣式
