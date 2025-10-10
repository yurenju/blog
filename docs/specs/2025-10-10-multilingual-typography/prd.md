# PRD: 多語言排版設計系統

## 簡介/概述

本 PRD 定義了多語言部落格的排版設計系統實作需求,目的是建立一套支援繁體中文、英文、日文的排版系統,同時注重閱讀體驗和視覺美感。

基於 `docs/research/2025-10-10-multilingual-typography-design-system.md` 中的研究發現,我們採用以下核心策略:
- **混合字型策略**:正文使用非襯線字體(Noto Sans 系列),標題與署名使用襯線字體(Noto Serif 系列)
- **語言特定微調**:每種語言有不同的行距、字距、字體大小設定
- **基於 Tailwind CSS**:使用 `@tailwindcss/typography` 和 `tailwindcss-localized` 插件
- **與 shadcn/ui 整合**:保持與現有 UI 元件的一致性

此設計系統將為部落格提供專業、易讀、美觀的排版基礎,同時確保三種語言都有最佳的閱讀體驗。

## 目標

1. **建立完整的多語言排版系統**:支援繁體中文、英文、日文,每種語言有適合的排版參數
2. **實現混合字型策略**:正文非襯線、標題襯線,創造視覺層次
3. **確保優秀的閱讀體驗**:基於研究的行距、字距、字體大小設定
4. **保持技術可維護性**:配置集中管理,易於調整參數
5. **確保效能表現**:字型載入優化,CSS 檔案大小控制
6. **完全整合到現有架構**:與 Next.js App Router、shadcn/ui、next-themes 無縫整合

## 使用者故事

### 故事 1: 讀者閱讀中文文章
**身份**: 繁體中文讀者
**需求**: 我想要閱讀技術文章
**目的**: 以便舒適地理解內容,不會因為排版問題造成閱讀疲勞

**驗收標準**:
- 正文使用 Noto Sans TC,字體大小 18px
- 行距為 200%,提供充足的垂直空間
- 字距為 0.05em,字元間有適當間隔
- 標題使用 Noto Serif TC,與正文形成對比
- 應用 `font-feature-settings: 'palt'` 優化標點符號間距
- 程式碼區塊使用等寬字體,與正文明確區隔

### 故事 2: 讀者閱讀日文文章
**身份**: 日文讀者
**需求**: 我想要閱讀部落格文章
**目的**: 以便享受舒適的閱讀體驗,符合日文排版慣例

**驗收標準**:
- 正文使用 Noto Sans JP,字體大小 16px(比中文小約 11%)
- 行距為 185%,適合日文字元密度
- 字距為 0.02em
- 標題使用 Noto Serif JP
- 應用 `font-feature-settings: 'palt'` 實現比例間距

### 故事 3: 讀者閱讀英文文章
**身份**: 英文讀者
**需求**: 我想要閱讀技術部落格
**目的**: 以便快速理解技術內容

**驗收標準**:
- 正文使用 Noto Sans,字體大小 16px
- 行距為 175%,符合英文閱讀習慣
- 字距為 0.01em
- 標題使用 Noto Serif
- 行長控制在 65 字元左右

### 故事 4: 讀者切換語言
**身份**: 多語言讀者
**需求**: 我想要在不同語言版本間切換
**目的**: 以便用我偏好的語言閱讀同一篇文章

**驗收標準**:
- 切換語言後,排版參數自動調整
- 字型自動切換到對應語言的字型
- 視覺風格保持一致(都是非襯線正文+襯線標題)
- 不需要重新載入頁面

### 故事 5: 讀者使用深色模式
**身份**: 偏好深色介面的讀者
**需求**: 我想要在深色模式下閱讀文章
**目的**: 以便在夜間或低光環境下舒適閱讀

**驗收標準**:
- 深色模式下文字顏色自動反轉
- 所有排版參數保持不變
- 對比度符合 WCAG 標準
- 標題、正文、署名在深色模式下都清晰可讀

### 故事 6: 開發者調整排版參數
**身份**: 部落格維護者
**需求**: 我想要微調某種語言的行距
**目的**: 以便根據使用者反饋優化閱讀體驗

**驗收標準**:
- 所有排版參數集中在 `tailwind.config.ts` 中
- 修改配置後執行 build 即可生效
- 參數命名清楚,易於理解
- 有註解說明每個參數的用途

## 功能需求

### FR-1: 字型系統設定

**FR-1.1**: 載入 Noto 字型家族
- 從 Google Fonts 載入以下字型:
  - Noto Sans (英文,權重: 400, 500, 600)
  - Noto Sans TC (繁體中文,權重: 400, 500, 600)
  - Noto Sans JP (日文,權重: 400, 500, 600)
  - Noto Serif (英文,權重: 400, 600, 700)
  - Noto Serif TC (繁體中文,權重: 400, 600, 700)
  - Noto Serif JP (日文,權重: 400, 600, 700)
  - Noto Sans Mono (程式碼,權重: 400, 600)
- 使用 `display: 'swap'` 避免阻塞渲染
- 將字型定義為 CSS 變數

**FR-1.2**: 配置 Tailwind 字型家族
- 定義 `font-sans`:包含所有 Noto Sans 變體
- 定義 `font-serif`:包含所有 Noto Serif 變體
- 定義 `font-mono`:程式碼專用字型
- 設定適當的回退字型(system-ui, Georgia, monospace)

**FR-1.3**: 在根 layout 注入字型變數
- 在 `app/layout.tsx` 的 `<body>` 上注入所有字型 CSS 變數
- 預設使用 `font-sans`
- 保留 `antialiased` class

### FR-2: 多語言樣式配置

**FR-2.1**: 安裝並配置 tailwindcss-localized 插件
- 安裝 `tailwindcss-localized` 套件
- 配置語言映射:
  ```javascript
  languages: {
    en: 'en',           // 對應 htmlLangMap['en']
    zh: 'zh-Hant-TW',   // 對應 htmlLangMap['zh']
    ja: 'ja',           // 對應 htmlLangMap['ja']
  }
  ```
- 啟用 localized 變體: fontSize, lineHeight, letterSpacing, fontFamily

**FR-2.2**: 在 locale layout 設定 lang 屬性
- 修改 `app/[locale]/layout.tsx`
- 在根 `<div>` 上加入 `lang={htmlLangMap[locale]}`
- 確保所有頁面內容都在此 div 內

**FR-2.3**: 配置語言特定的 CSS 變數(可選,作為備用方案)
- 在 `globals.css` 中定義語言特定的 CSS 變數
- 使用 `[lang="xx"]` 選擇器設定不同值
- 至少包含: `--typography-base`, `--typography-line-height`, `--letter-spacing`

### FR-3: Typography 排版系統

**FR-3.1**: 安裝並配置 @tailwindcss/typography 插件
- 安裝 `@tailwindcss/typography` 套件
- 定義 DEFAULT prose 樣式(英文)
- 定義 zh prose 變體(繁體中文)
- 定義 ja prose 變體(日文)

**FR-3.2**: 配置英文排版參數(DEFAULT)
- 字體大小: 1rem (16px)
- 行距: 1.75 (175%)
- 字距: 0.01em
- 最大寬度: 65ch
- H1: 2.25rem, 行距 1.2, 字重 700, 使用 font-serif
- H2: 1.875rem, 行距 1.3, 字重 700, 使用 font-serif
- H3: 1.5rem, 行距 1.4, 字重 600, 使用 font-serif
- H4: 1.25rem, 行距 1.4, 字重 600, 使用 font-serif
- 段落間距: 上下 1.25em
- 連結: 使用 primary 顏色, 有底線, 字重 500
- 引用: 左邊框 4px, 內距 1em, 間距上下 1.6em
- 程式碼: font-mono, 0.875em

**FR-3.3**: 配置繁體中文排版參數(zh)
- 字體大小: 1.125rem (18px)
- 行距: 2 (200%)
- 字距: 0.05em
- 最大寬度: 65ch
- H1: 2.5rem, 行距 1.3, 字距 0.02em, 使用 font-serif
- H2: 2rem, 行距 1.4, 字距 0.02em, 使用 font-serif
- H3: 1.625rem, 行距 1.5, 字距 0.02em, 使用 font-serif
- H4: 1.375rem, 行距 1.5, 字距 0.02em, 使用 font-serif
- 段落間距: 上下 1.5em
- 連結、引用、程式碼: 繼承 DEFAULT 設定

**FR-3.4**: 配置日文排版參數(ja)
- 字體大小: 1rem (16px, 比中文小約 11%)
- 行距: 1.85 (185%)
- 字距: 0.02em
- 最大寬度: 65ch
- H1: 2.25rem, 行距 1.3, 字距 0.01em, 使用 font-serif
- H2: 1.875rem, 行距 1.4, 字距 0.01em, 使用 font-serif
- H3: 1.5rem, 行距 1.5, 字距 0.01em, 使用 font-serif
- H4: 1.25rem, 行距 1.5, 字距 0.01em, 使用 font-serif
- 段落間距: 上下 1.4em
- 連結、引用、程式碼: 繼承 DEFAULT 設定

**FR-3.5**: 應用 OpenType 字型特性
- 在 `globals.css` 中為日文和中文設定 `font-feature-settings: 'palt' 1`
- 使用 `[lang="ja"]` 選擇器套用到日文
- 使用 `[lang="zh-Hant-TW"]` 選擇器套用到繁體中文
- `palt` 特性用於優化 CJK 標點符號的比例間距
- 程式碼區塊(`pre`, `code`)不套用字型特性

### FR-4: 元件應用

**FR-4.1**: 更新文章詳細頁面
- 文章標題使用 `font-serif`
- 文章內容使用 `prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none`
- 署名區塊使用 `font-serif text-sm text-muted-foreground text-right`
- 保持現有的 container 和 padding

**FR-4.2**: 確保其他頁面相容
- 首頁、文章列表頁、分類頁使用預設 font-sans
- 如有特殊標題,可選擇性加上 font-serif
- 不影響 Navbar、Footer 等 UI 元件

**FR-4.3**: 保持 shadcn/ui 元件不變
- 所有 `components/ui/` 下的元件不修改
- Button、Card、Dialog 等元件保持原樣
- 只修改內容區域的排版

### FR-5: 深色模式支援

**FR-5.1**: 配置 prose 深色模式
- 使用 `dark:prose-invert` class
- 確保標題、正文、連結、引用在深色模式下清晰可讀
- 使用 shadcn/ui 的顏色變數(foreground, muted-foreground 等)

**FR-5.2**: 測試深色模式顏色對比
- 文字與背景對比度符合 WCAG AA 標準
- 連結顏色在深色模式下有足夠對比
- 引用邊框在深色模式下可見

### FR-6: 效能優化

**FR-6.1**: 字型載入優化
- 使用 `display: 'swap'` 避免 FOIT (Flash of Invisible Text)
- 只載入需要的字重(不載入 100-900 全部字重)
- 考慮使用 `preload` 提示(可選)

**FR-6.2**: CSS 檔案大小控制
- 確認 Tailwind purge 正常運作
- 移除未使用的 prose 變體
- 檢查最終 CSS 檔案大小在合理範圍內(< 50KB gzipped)

**FR-6.3**: 建置時靜態生成
- 所有語言版本在 build time 生成靜態頁面
- 不需要 runtime 計算排版參數
- 確保 `generateStaticParams` 正確運作

## 非目標(超出範圍)

本次排版系統實作**不包含**以下項目:

1. **UI 元件重新設計**: 不修改 Navbar、Footer、Button、Card 等 shadcn/ui 元件的樣式
2. **進階排版功能**: 不實作標點擠壓、中英文自動空格等進階功能(如 heti 提供的功能)
3. **字型 Subset 優化**: 不進行字型檔案的 subset 切割(未來可考慮)
4. **效能深度優化**: 不進行字型預載入、Critical CSS 等深度效能優化
5. **無障礙性專項改善**: 不進行無障礙性專項測試和改善(但需符合基本標準)
6. **動畫或互動效果**: 不添加文字動畫、hover 效果等互動設計
7. **垂直韻律系統**: 不實作完整的 vertical rhythm 系統
8. **內容遷移**: 不修改現有 Markdown 文章內容
9. **圖片排版**: 不處理圖片的排版和優化
10. **響應式進階調整**: 不針對不同螢幕尺寸進行精細的排版調整(使用 prose-lg 等預設即可)

## 設計考量

### 視覺層次

通過混合字型策略創造清晰的視覺層次:
- **最高層次**: 文章標題 (H1) - 襯線、最大字體、粗字重
- **次級層次**: 章節標題 (H2-H4) - 襯線、漸進字體大小
- **正文層次**: 段落、列表 - 非襯線、適中字體
- **輔助層次**: 署名、註解 - 襯線、較小字體、較細字重
- **特殊層次**: 程式碼 - 等寬、與正文區隔

### 顏色使用

使用 shadcn/ui 的語意化顏色變數:
- 正文: `foreground`
- 標題: `foreground` (可使用更深/更淺的變體)
- 連結: `primary`
- 靜音文字(署名): `muted-foreground`
- 引用邊框: `border`

### 響應式設計

使用 `prose-lg` 在大螢幕提供更大的字體:
- 手機: 使用 prose (預設)
- 平板以上: 使用 prose-lg
- 不需要針對每個語言定義不同的響應式變體

### 字型回退機制

確保在字型載入失敗時有適當的回退:
- Sans Serif: system-ui → -apple-system → sans-serif
- Serif: Georgia → serif
- Mono: Consolas → Monaco → monospace

## 技術考量

### Next.js App Router 整合

- **字型變數**: 在根 layout 注入,所有子頁面可用
- **Lang 屬性**: 在 `[locale]/layout.tsx` 設定,不在根 `<html>` 設定
- **靜態生成**: 確保 `generateStaticParams` 為所有 locale 生成頁面

### Tailwind CSS 配置

- **插件順序**: 先 `@tailwindcss/typography`,再 `tailwindcss-localized`
- **變體順序**: `responsive` → `localized` → `dark`
- **Theme 擴展**: 使用 `extend` 避免覆蓋預設值

### CSS 選擇器優先級

- `[lang="xx"]` 選擇器比 class 優先級高
- 確保 localized 變體能覆蓋預設樣式
- 深色模式變體應能覆蓋 localized 樣式

### 字型檔案載入

- **檔案大小**: Noto CJK 字型檔案較大(可能 > 1MB)
- **載入策略**: 使用 Google Fonts CDN,利用瀏覽器快取
- **字重選擇**: 只載入必要字重,減少檔案大小

### 瀏覽器相容性

- **目標瀏覽器**: Chrome, Firefox, Safari, Edge (最新兩個版本)
- **Font Feature Settings**: 現代瀏覽器都支援 `palt` 特性
- **CSS 變數**: 現代瀏覽器都支援
- **不支援 IE11**: 專案使用 Next.js 15,已不支援 IE

### 效能指標

- **LCP (Largest Contentful Paint)**: 字型載入不應顯著影響 LCP
- **CLS (Cumulative Layout Shift)**: 使用 font-display: swap 避免 layout shift
- **FCP (First Contentful Paint)**: 確保文字在字型載入前就顯示(使用回退字型)

## 驗收標準

### 主要驗收標準

1. ✅ **字型系統完整設定**
   - 已載入所有 7 個 Noto 字型(3 Sans + 3 Serif + 1 Mono)
   - 字型變數正確注入到根 layout
   - Tailwind config 中正確定義 font-sans, font-serif, font-mono

2. ✅ **多語言樣式正確運作**
   - 已安裝 tailwindcss-localized 插件
   - `[locale]/layout.tsx` 的根 div 有 `lang` 屬性
   - 切換語言後,排版參數自動變化(字體大小、行距、字距)

3. ✅ **Typography 配置完成**
   - 已配置 DEFAULT, zh, ja 三種 prose 變體
   - 每種變體的參數符合研究報告建議
   - 標題(H1-H4)都使用 font-serif
   - 正文使用 font-sans

4. ✅ **OpenType 字型特性應用**
   - 日文和中文應用了 `font-feature-settings: 'palt' 1`
   - 程式碼區塊不套用字型特性

5. ✅ **元件正確應用樣式**
   - PostDetailPage 使用 prose 並正確套用語言變體
   - 文章標題使用 font-serif
   - 署名使用 font-serif
   - 其他頁面保持 font-sans

6. ✅ **深色模式正確運作**
   - 使用 `dark:prose-invert`
   - 所有文字在深色模式下清晰可讀
   - 顏色對比符合 WCAG AA 標準

7. ✅ **效能符合標準**
   - 字型使用 `display: swap`
   - CSS 檔案大小合理(< 50KB gzipped)
   - 靜態生成成功,所有語言版本都有 HTML 檔案

### 視覺驗收標準

使用者(開發者)應在以下情境測試並確認視覺效果:

1. **繁體中文文章**
   - [ ] 正文字體大小明顯比英文大
   - [ ] 行距寬鬆,閱讀舒適
   - [ ] 標題使用襯線字體,與正文有明顯對比
   - [ ] 署名使用襯線字體,有文學氣息

2. **日文文章**
   - [ ] 正文字體大小與英文相近,比中文小
   - [ ] 行距適中,不會過於擁擠
   - [ ] 標點符號間距合理(應用 palt 特性)

3. **英文文章**
   - [ ] 正文易讀,行距適中
   - [ ] 標題襯線字體優雅
   - [ ] 整體排版專業

4. **切換語言**
   - [ ] 切換後排版立即變化
   - [ ] 視覺風格保持一致
   - [ ] 無明顯的 layout shift

5. **深色模式**
   - [ ] 所有文字清晰可讀
   - [ ] 顏色對比足夠
   - [ ] 引用邊框可見

6. **不同螢幕尺寸**
   - [ ] 手機上文字不會太小
   - [ ] 桌面上行長適中(65ch 左右)
   - [ ] 平板上排版舒適

### 技術驗收標準

1. ✅ **Build 成功**
   - `npm run build` 無錯誤
   - 生成所有語言的靜態 HTML
   - 無 TypeScript 錯誤

2. ✅ **開發環境正常**
   - `npm run dev` 正常啟動
   - Hot reload 正常運作
   - 無 console 錯誤或警告

3. ✅ **配置檔案正確**
   - `tailwind.config.ts` 語法正確
   - `globals.css` 無語法錯誤
   - Font variables 正確定義

4. ✅ **HTML 輸出正確**
   - `<div lang="zh-Hant-TW">` 存在於中文頁面
   - `<div lang="ja">` 存在於日文頁面
   - `<div lang="en">` 存在於英文頁面

5. ✅ **CSS 類別生成正確**
   - `zh:text-lg` 等 localized 類別可用
   - `prose-zh`, `prose-ja` 類別存在
   - `dark:prose-invert` 正常運作

## 測試計畫

### 單元測試(非必要,可選)

- 驗證 `htmlLangMap` 正確對應
- 驗證 locale 參數正確傳遞

### 視覺測試(必要,由使用者執行)

**測試步驟:**

1. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

2. **測試繁體中文頁面**
   - 開啟 `http://localhost:3000/zh/posts/[任一文章]`
   - 檢查字體大小、行距、字距
   - 檢查標題是否使用襯線字體
   - 檢查署名是否使用襯線字體
   - 切換深色模式,檢查可讀性

3. **測試日文頁面**
   - 開啟 `http://localhost:3000/ja/posts/[任一文章]`
   - 檢查字體大小是否比中文小
   - 檢查標點符號間距
   - 切換深色模式

4. **測試英文頁面**
   - 開啟 `http://localhost:3000/en/posts/[任一文章]`
   - 檢查排版是否專業
   - 切換深色模式

5. **測試語言切換**
   - 在同一篇文章的不同語言版本間切換
   - 觀察排版變化是否平滑

6. **測試不同裝置**
   - 使用 DevTools 模擬手機(375px)
   - 使用 DevTools 模擬平板(768px)
   - 使用桌面瀏覽器(1280px+)

7. **提供反饋**
   - 記錄任何視覺問題
   - 記錄閱讀體驗的主觀感受
   - 建議調整參數(如果需要)

### 效能測試

1. **字型載入檢查**
   - 使用 Network tab 檢查字型檔案大小
   - 確認字型來自 Google Fonts CDN
   - 檢查是否有不必要的字重載入

2. **CSS 檔案大小**
   - Build 後檢查 `_next/static/css/` 下的檔案
   - 確認 gzipped 後 < 50KB

3. **Lighthouse 分數**
   - 執行 Lighthouse 測試
   - 確認 Performance > 90
   - 確認 Accessibility > 90

### 跨瀏覽器測試

測試以下瀏覽器的最新版本:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (Mac)
- [ ] Edge

## 實施建議順序

建議按以下順序實作,確保每個階段都經過測試:

### 第一階段:基礎設定(預計 2-3 小時)
1. 安裝依賴套件
2. 配置 Tailwind config
3. 載入字型到根 layout
4. 修改 locale layout 加入 lang 屬性
5. 測試字型是否正確載入

### 第二階段:Typography 配置(預計 3-4 小時)
1. 配置 DEFAULT prose 樣式
2. 配置 zh prose 變體
3. 配置 ja prose 變體
4. 測試三種語言的排版效果
5. 根據視覺效果微調參數

### 第三階段:元件應用(預計 1-2 小時)
1. 更新 PostDetailPage
2. 測試文章頁面效果
3. 檢查其他頁面是否受影響
4. 修復任何佈局問題

### 第四階段:OpenType 與深色模式(預計 1 小時)
1. 在 globals.css 加入 font-feature-settings
2. 測試 palt 特性效果
3. 測試深色模式
4. 調整深色模式顏色(如需要)

### 第五階段:最終測試與優化(預計 2-3 小時)
1. 執行完整的視覺測試
2. 執行跨瀏覽器測試
3. 執行效能測試
4. 根據測試結果調整
5. 執行 build 並檢查靜態輸出

**總預估時間: 9-13 小時**

## 開放問題

目前沒有開放問題。所有技術決策已在研究階段明確。

**未來可能考慮的增強功能**(不在本 PRD 範圍內):
- 中英文自動空格
- 標點符號擠壓
- 字型 subset 優化
- 更細緻的響應式調整
- 垂直韻律系統

## 參考資料

1. **研究文件**: `docs/research/2025-10-10-multilingual-typography-design-system.md`
   - 提供完整的技術分析和設計決策依據
   - 包含中文、日文、英文排版最佳實踐研究
   - 說明 Tailwind CSS 多語言樣式組織架構
   - 分析字型選擇策略和 OpenType 特性

2. **技術文件**:
   - [Tailwind CSS Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
   - [tailwindcss-localized](https://github.com/hdodov/tailwindcss-localized)
   - [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
   - [Google Fonts - Noto](https://fonts.google.com/noto)

3. **專案文件**:
   - `CLAUDE.md`: 專案架構說明
   - `lib/i18n/locales.ts`: 多語言配置
   - `docs/specs/2025-10-10-style-reset/prd.md`: 樣式重置 PRD(前置工作)

4. **排版研究參考**:
   - [Han.css](https://github.com/ethantw/Han) - 中文排版參考
   - [heti](https://github.com/sivan/heti) - 中文排版增強
   - [Seven rules for perfect Japanese typography](https://www.aqworks.com/blog/perfect-japanese-typography)
   - [日本數位廳設計系統](https://design.digital.go.jp/foundations/typography/)
