# 樣式重置研究報告:為多語言部落格重新設計做準備

## 執行摘要

本研究針對部落格樣式重置需求進行深入分析,目的是為即將進行的全面重新設計建立乾淨的基礎。經過全面調查後,我們發現了幾個關鍵議題需要優先處理:

- **深色模式問題**:文章列表的 hover 狀態在深色模式下使用了不當的顏色值,導致視覺體驗不佳
- **自定義樣式分散**:樣式分布在 `globals.css` 和各個 TSX 元件中,需要系統性地重置
- **多語言字型配置**:目前已配置 Noto Sans TC 和 Noto Serif TC,但缺少針對英文和日文的最佳化
- **重置範圍明確**:保留 shadcn/ui 元件原始樣式,移除所有自定義樣式,保持功能和布局結構

## 背景與脈絡

這是一個基於 Next.js 15 的多語言部落格,使用 App Router 和靜態匯出架構。部落格支援三種語言:繁體中文(zh)、英文(en)和日文(ja),內容以 Markdown 格式儲存在 `public/posts/` 目錄中。

目前的技術堆疊包括:
- **框架**:Next.js 15.1.6 with App Router
- **樣式**:Tailwind CSS 3.4.16 + tailwindcss-animate
- **UI 元件**:shadcn/ui (基於 Radix UI)
- **主題**:next-themes 實現深色/淺色模式切換
- **字型**:Google Fonts 的 Noto Sans TC 和 Noto Serif TC

專案已經發展了一段時間,累積了大量自定義樣式。隨著多語言功能的加入,現在需要重新思考整體設計策略,確保三種語言都能有良好的閱讀體驗。在重新設計之前,需要先將樣式重置到乾淨的狀態。

## 研究問題與發現過程

### 初始請求

使用者希望:
1. 刪除所有自定義樣式
2. 保留 Tailwind 和 shadcn/ui 的原始樣式
3. 保持現有功能和布局結構
4. 解決深色模式下的樣式錯誤
5. 為極簡風格的重新設計做準備

### 釐清過程

通過與使用者的對話,我們明確了以下重點:
- **保留範圍**:shadcn/ui 元件不需更改,但自定義包裝的元件需要重置樣式
- **布局策略**:保持現有布局結構,不修改架構
- **深色模式問題**:文章列表在深色模式下,hover 狀態顯示淺色風格
- **Tailwind 配置**:所有自定義配置都要重置
- **設計方向**:極簡風格,注重閱讀體驗,未來將針對不同語言使用不同字型和間距

## 技術分析:深入理解問題

### 程式碼庫現況探索

經過程式碼審查,我們發現專案採用了典型的 Next.js App Router 架構,這個選擇在建立靜態部落格時是合理的,因為能充分利用靜態生成的效能優勢。然而,隨著多語言功能的演進,樣式管理開始出現組織性問題。

#### 樣式檔案結構

**主要樣式檔案:**
- `app/globals.css`:包含所有全域樣式和自定義規則
- `tailwind.config.ts`:Tailwind 配置,包含 shadcn/ui 的顏色系統
- 各個元件檔案:內嵌的 Tailwind class 樣式

**元件樣式分布:**
- `PostsList.tsx`:自定義列表項目 hover 效果
- `HomePage.tsx`:首頁排版和間距
- `PostDetailPage.tsx`:文章詳細頁面樣式
- `Navbar.tsx`:導航列樣式
- `RootLayoutContent.tsx`:全域字型和間距設定

#### Tailwind 配置分析

`tailwind.config.ts` 目前使用 shadcn/ui 的標準配置:
- **顏色系統**:完整的語意化顏色變數 (background, foreground, primary, secondary, etc.)
- **圓角**:使用 CSS 變數定義 (--radius)
- **深色模式**:使用 class 策略
- **插件**:tailwindcss-animate

這些配置都是 shadcn/ui 的標準設定,應該保留。

### 問題根源追蹤

#### 1. globals.css 中的自定義樣式

`globals.css` 包含大量自定義樣式,主要分為以下類別:

**字型相關 (第 67-72 行):**
```css
body {
  font-family: var(--font-noto-sans-tc), sans-serif;
}
h1.homepage-title { font-family: var(--font-noto-serif-tc); }
p.homepage-description { font-family: var(--font-noto-serif-tc); }
```

**文章內容樣式 (第 78-142 行):**
- 文章段落間距 (.article p)
- 標題樣式 (.article h2, h3, h4)
- 列表樣式 (.article ul, ol)
- 連結樣式 (.article a)
- 引用樣式 (.article blockquote)
- 程式碼區塊樣式 (.article pre, code)

**語法高亮樣式 (第 143-193 行):**
- Shiki 主題顏色變數
- 行號顯示
- 程式碼高亮

**特殊元素 (第 194-205 行):**
- YouTube 嵌入樣式

初步觀察顯示問題出現在多個地方使用了硬編碼的顏色值(如 `text-gray-500`, `bg-gray-100`),進一步調查後發現真正原因是這些顏色沒有正確對應到 shadcn/ui 的語意化顏色系統,導致深色模式切換時無法自動適應。

#### 2. 元件中的內嵌樣式

**PostsList.tsx 的 hover 問題 (第 68 行):**
```tsx
className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 pl-3 mb-2 rounded-lg transition-colors"
```

這裡使用了硬編碼的 `gray-100` 和 `gray-700`,應該使用語意化的顏色如 `hover:bg-accent`。

**PostsList.tsx 的文字顏色 (第 74, 77 行):**
```tsx
className="text-gray-500 dark:text-gray-400 text-sm min-w-[80px] text-center"
className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
```

同樣使用了硬編碼顏色,應使用 `text-muted-foreground` 和 `text-primary` 等語意化顏色。

**HomePage.tsx 的描述文字 (第 26 行):**
```tsx
className="text-gray-700 dark:text-gray-400 mb-4 homepage-description leading-9 font-medium md:font-normal"
```

**PostDetailPage.tsx 的署名 (第 42 行):**
```tsx
className={`text-gray-400 dark:text-gray-500 text-right mt-6 ${notoSerifTC.className}`}
```

#### 3. 布局中的自定義樣式

**RootLayoutContent.tsx 和 layout.tsx (第 28, 34 行):**
```tsx
className={`${notoSansTC.variable} ${notoSerifTC.variable} antialiased text-base leading-relaxed tracking-wide md:tracking-wide md:leading-8 `}
```

這些自定義的排版設定(leading-relaxed, tracking-wide)應該重置。

### 業界智慧與最佳實踐

#### 極簡風格部落格設計原則

調研發現業界對於極簡部落格設計有以下共識:

**排版基礎:**
- **字型選擇**:無襯線字型(sans-serif)如 Arial 和 Verdana 能顯著提升閱讀表現,特別對閱讀障礙者友善
- **字型大小**:響應式設計 - 手機 12-16pt,平板 15-19pt,桌面 16-20pt
- **行距**:從 100% 提升到 120% 可提高 20% 閱讀準確度,減少 30% 眼睛疲勞
- **字距**:更寬的字距可將閱讀準確度提升兩倍,速度提升 20% 以上
- **對齊方式**:左對齊為連續文字的最佳選擇
- **文字寬度**:主要內容區域應為 600-700 像素寬

**設計元素:**
- **留白**:充足的留白幫助讀者聚焦,讓網站看起來更有組織性
- **字型數量**:限制在三種以內,避免使用者迷失
- **深淺色模式**:提供切換選項,讓長時間閱讀更舒適

#### 深色模式 Hover 狀態最佳實踐

核心原則是確保變化明顯且直觀:

**通用規則:**
- 按鈕是深色時,hover 應該變淺(因為更深可能不夠明顯)
- 按鈕是淺色時,hover 應該變深
- 重點不是變深或變淺,而是要有明顯的視覺反饋

**深色模式特別考量:**
- 避免純白文字配純黑背景,應使用深灰色調
- 完全飽和的顏色會造成眼睛疲勞,應使用較柔和的顏色如白色、灰色、粉色系
- 互動元素的 hover 狀態應該可見且直觀,提供清楚的視覺反饋
- 使用微妙的顏色變化來增強體驗,在不影響焦點的前提下增加動態感

**實務建議:**
對於深色背景,使用較淺的顏色來增加對比,使元素突出。

#### 多語言字型搭配

**CJK 與拉丁字型搭配:**
- **推薦字型族**:Google 的 Noto Sans/Serif 系列,專門設計來與拉丁字型和諧搭配
- **尺寸調整**:中日韓字元傳統上是方形(等寬),拉丁字母寬度可變,同樣的 point size 下拉丁字母可能顯得太小,需要放大以達到視覺平衡
- **行高差異**:每種字型和對應語言應該有不同的行高,以獲得更好的閱讀體驗
- **一致性重要**:跨語言保持一致性至關重要,找到與現有字型和諧搭配的 CJK 字型

**字型對應關係:**
- 宋體 (Songti) 對應明朝體 (Mincho)
- 黑體 (Heiti) 對應哥德體 (Gothic)
- 楷體 (Kaiti) 對應楷書體 (Kaisho)

## 需要重置的樣式清單

### 1. globals.css 需要移除的樣式

**完全移除:**
- 第 67-68 行:body 的 font-family 設定
- 第 70-76 行:homepage-title 和 homepage-description 的字型設定
- 第 78-122 行:所有 .article 相關樣式(strong, p, h2-h4, ul, ol, a, blockquote)
- 第 194-205 行:.youtube-embed 樣式

**保留(確認):**
- 第 124-193 行:語法高亮樣式(與 rehype-pretty-code 功能相關,必須保留)

### 2. 元件中需要重置的樣式

**PostsList.tsx:**
- 第 68 行:移除 hover 和顏色相關的 class
- 第 74 行:移除硬編碼的灰色
- 第 77 行:移除硬編碼的藍色

**HomePage.tsx:**
- 第 13 行:移除 `text-xl tracking-wide`
- 第 14 行:移除 `gap-4 mt-20 mb-4`
- 第 23-24 行:移除 `mt-4` 和 homepage-title class
- 第 26 行:移除所有自定義樣式 class
- 第 32 行:移除 `gap-2 text-md`

**PostDetailPage.tsx:**
- 第 28 行:移除 `mb-48`
- 第 29 行:移除 article-title class 和 `mb-6`
- 第 38 行:移除所有自定義樣式 class
- 第 42 行:移除硬編碼顏色和間距

**Navbar.tsx:**
- 第 15 行:移除 `border-b-2`
- 第 16 行:移除 `gap-4`
- 第 22 行:移除 `gap-1`

**RootLayoutContent.tsx 和 layout.tsx:**
- 移除 body 上的所有自定義 class,只保留字型變數

### 3. Tailwind 配置

`tailwind.config.ts` 保持不變,因為這些都是 shadcn/ui 的標準配置。

## 建議與實施指引

基於分析結果,建議採用「完全重置後逐步重建」的策略。這個方案相比「選擇性保留」更適合我們的情況,因為目前的樣式系統存在以下問題:

1. **顏色系統不一致**:混用硬編碼顏色和語意化顏色
2. **樣式分散**:CSS 檔案和元件內嵌樣式缺乏統一管理
3. **缺少系統性**:未針對多語言閱讀體驗進行整體規劃

**推薦方案:完全重置**

**優點:**
- 建立乾淨的基礎,避免遺留問題
- 確保使用 shadcn/ui 的語意化顏色系統
- 為多語言優化提供最大彈性
- 符合極簡設計理念

**缺點:**
- 短期內網站外觀會回到基本狀態
- 需要重新實作必要的樣式

**風險評估:**
- **風險等級**:低 - 只是暫時性的視覺變化,功能完全保留
- **主要風險點**:可能會遺漏某些必要的樣式,需要逐步補回

### 實施步驟

**第一階段:重置 globals.css**

1. 保留 @tailwind 指令和 shadcn/ui 的顏色變數
2. 移除所有 @layer base 中的自定義樣式
3. 保留語法高亮相關樣式(因為與功能相關)

**第二階段:重置元件樣式**

逐一處理每個元件:
1. PostsList.tsx:移除硬編碼顏色,改用語意化顏色或暫時移除
2. HomePage.tsx:移除自定義間距和字型 class
3. PostDetailPage.tsx:移除文章樣式相關 class
4. Navbar.tsx:簡化為基本樣式
5. Layout 檔案:移除排版設定

**第三階段:驗證與測試**

1. 啟動開發伺服器驗證視覺效果
2. 測試深色/淺色模式切換
3. 測試三種語言的顯示
4. 確認所有功能正常運作

**第四階段:建立重建基礎**

為未來的重新設計準備:
1. 建立設計系統文件,定義極簡風格的具體規範
2. 規劃多語言字型策略
3. 定義語意化的間距和排版系統

## 下一步行動計畫

**立即行動:**

1. **執行樣式重置**
   - 修改 `globals.css`,移除自定義樣式
   - 更新所有元件,移除硬編碼樣式 class
   - 測試並確認功能正常

2. **解決深色模式問題**
   - 將 PostsList 的 hover 顏色改為語意化顏色
   - 統一使用 shadcn/ui 顏色系統

**中期規劃:**

3. **建立設計系統**
   - 撰寫極簡風格設計規範文件
   - 定義排版系統(字體大小、行距、間距)
   - 建立顏色使用指南

4. **多語言字型優化**
   - 研究並測試不同語言的最佳字型組合
   - 實作語言特定的字型和間距調整

**PRD 需求:**

考慮到這是一個系統性的重新設計專案,建議在樣式重置完成後,針對以下主題撰寫 PRD:

1. **極簡風格設計系統 PRD**
   - 定義整體視覺語言
   - 建立元件樣式指南
   - 規劃響應式設計策略

2. **多語言閱讀體驗優化 PRD**
   - 各語言字型選擇和搭配
   - 語言特定的排版調整
   - 閱讀體驗測試計畫

不過,是否需要撰寫 PRD 由開發者根據實際情況決定。如果重新設計的範圍較小,也可以直接進行實作。

## 參考資料

### 技術文件
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

### 設計最佳實踐
- [Blog Design Best Practices 2025](https://www.waseembashir.com/post/7-blog-design-best-practices)
- [Dark Mode UI Design Best Practices](https://blog.logrocket.com/ux-design/dark-mode-ui-design-best-practices-and-examples/)
- [Typography Best Practices Guide 2025](https://www.adoc-studio.app/blog/typography-guide)

### 多語言字型
- [Multilingual Web Fonts](https://www.weglot.com/blog/multilingual-fonts)
- [CJK Font Pairing](https://www.daltonmaag.com/services/cjk-font-pairing.html)
- [East Meets West: How to Pair Chinese Fonts with Latin Fonts](https://blog.justfont.com/2025/03/how-to-pair-chinese-and-latin-fonts-en/)

### 閱讀體驗
- [Designing for Readability: A Guide to Web Typography](https://www.toptal.com/designers/typography/web-typography-infographic)
- [The Role of Typography in Minimalist WordPress Design](https://seota.com/education/wordpress-web-design-articles/the-role-of-typography-in-minimalist-wordpress-design/)
