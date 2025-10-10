# 實作計畫

## PRD 參考

**PRD 文件路徑:** `docs/specs/2025-10-10-multilingual-typography/prd.md`
**相關研究文件:** `docs/research/2025-10-10-multilingual-typography-design-system.md`

> **重要提醒:** 實作過程中請經常參考上述文件以了解:
>
> - 功能的商業目標和用戶價值:建立專業、易讀的多語言排版系統
> - 完整的用戶故事和使用場景:三種語言的閱讀體驗最佳化
> - 非功能性需求:效能、可維護性、與現有架構整合
> - 系統架構和技術決策的背景脈絡:混合字型策略、語言特定參數
> - 研究文件中的深入分析和建議:中文、日文、英文排版最佳實踐

## 相關檔案

- `tailwind.config.ts` - Tailwind CSS 配置,需新增 typography 和 localized 插件配置
- `app/globals.css` - 全域樣式,需新增 OpenType 字型特性設定
- `app/layout.tsx` - 根 layout,需載入所有 Noto 字型
- `app/[locale]/layout.tsx` - Locale layout,需在根元素加上 lang 屬性
- `components/pages/PostDetailPage.tsx` - 文章詳細頁,需應用 prose 樣式
- `lib/i18n/locales.ts` - 多語言配置,已有 htmlLangMap,需確認對應
- `package.json` - 專案依賴,需新增兩個 Tailwind 插件
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [ ] 1. 安裝依賴並配置 Tailwind 基礎設定
  - 1.1 執行 `npm install -D @tailwindcss/typography tailwindcss-localized` 安裝兩個插件
  - 1.2 在 `tailwind.config.ts` 中的 theme.languages 新增語言映射配置(對應 htmlLangMap)
  - 1.3 在 plugins 陣列中新增 `require('@tailwindcss/typography')` 和 `require('tailwindcss-localized')`
  - 1.4 在 variants 配置中啟用 localized 變體:fontSize, lineHeight, letterSpacing, fontFamily
  - 1.5 測試 `npm run dev` 確認配置無誤

- [ ] 2. 載入 Noto 字型家族到專案
  - 2.1 在 `app/layout.tsx` 從 `next/font/google` 引入 7 個 Noto 字型
  - 2.2 配置正文字型(Sans):Noto_Sans, Noto_Sans_TC, Noto_Sans_JP,字重 400/500/600
  - 2.3 配置標題字型(Serif):Noto_Serif, Noto_Serif_TC, Noto_Serif_JP,字重 400/600/700
  - 2.4 配置程式碼字型(Mono):Noto_Sans_Mono,字重 400/600
  - 2.5 所有字型使用 `display: 'swap'` 避免阻塞渲染
  - 2.6 在 `<body>` className 中注入所有字型 CSS 變數
  - 2.7 測試字型是否正確載入(使用 DevTools 檢查)

- [ ] 3. 配置 Tailwind 字型家族和 typography 基礎
  - 3.1 在 `tailwind.config.ts` 的 theme.extend.fontFamily 中定義三個字型族
  - 3.2 font-sans:包含所有 Noto Sans 變數,回退到 system-ui
  - 3.3 font-serif:包含所有 Noto Serif 變數,回退到 Georgia
  - 3.4 font-mono:Noto Sans Mono 變數,回退到 Consolas/Monaco
  - 3.5 在 theme.extend.typography 開始配置 prose 樣式(先建立空架構)
  - 3.6 測試 font-sans, font-serif, font-mono class 是否可用

- [ ] 4. 配置英文(DEFAULT) prose 樣式
  - 4.1 在 typography.DEFAULT.css 中設定基礎參數:fontSize 1rem, lineHeight 1.75, letterSpacing 0.01em
  - 4.2 配置標題(H1-H4)使用 `theme('fontFamily.serif')`,設定對應的字體大小、行距、字重
  - 4.3 配置段落間距:marginTop/Bottom 1.25em
  - 4.4 配置列表(ul/ol)和列表項(li)的間距
  - 4.5 配置連結樣式:使用 primary 顏色,底線,字重 500
  - 4.6 配置引用(blockquote):左邊框 4px,內距 1em
  - 4.7 配置程式碼:font-mono, 0.875em,移除前後的引號
  - 4.8 在測試文章頁面套用 `prose` class 測試效果

- [ ] 5. 配置繁體中文(zh)和日文(ja) prose 樣式
  - 5.1 複製 DEFAULT 結構,建立 typography.zh.css 配置
  - 5.2 zh 基礎參數:fontSize 1.125rem, lineHeight 2, letterSpacing 0.05em
  - 5.3 zh 標題大小:H1 2.5rem, H2 2rem, H3 1.625rem, H4 1.375rem,使用 font-serif
  - 5.4 zh 段落間距:1.5em
  - 5.5 複製結構,建立 typography.ja.css 配置
  - 5.6 ja 基礎參數:fontSize 1rem, lineHeight 1.85, letterSpacing 0.02em
  - 5.7 ja 標題大小:H1 2.25rem, H2 1.875rem, H3 1.5rem, H4 1.25rem,使用 font-serif
  - 5.8 ja 段落間距:1.4em
  - 5.9 測試三種語言的 prose 樣式(prose, prose-zh, prose-ja)

- [ ] 6. 修改 locale layout 加入 lang 屬性
  - 6.1 在 `app/[locale]/layout.tsx` 引入 htmlLangMap
  - 6.2 在根 `<div>` 加上 `lang={htmlLangMap[locale]}` 屬性
  - 6.3 確保所有頁面內容都在此 div 內
  - 6.4 使用 DevTools 確認 DOM 中有正確的 lang 屬性(zh-Hant-TW, ja, en)
  - 6.5 測試切換語言時 lang 屬性是否正確變化

- [ ] 7. 應用 OpenType 字型特性和更新 PostDetailPage
  - 7.1 在 `app/globals.css` 的 @layer base 中新增 font-feature-settings
  - 7.2 為 `[lang="ja"]` 設定 `font-feature-settings: 'palt' 1`
  - 7.3 為 `[lang="zh-Hant-TW"]` 設定 `font-feature-settings: 'palt' 1`
  - 7.4 為 `pre, code` 設定 `font-feature-settings: normal` 和 `font-kerning: none`
  - 7.5 更新 `PostDetailPage.tsx`,文章標題(h1)加上 `font-serif`
  - 7.6 文章內容套用 `prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none`
  - 7.7 署名區塊加上 `font-serif text-sm text-muted-foreground text-right mt-8`
  - 7.8 測試文章頁面的完整排版效果

- [ ] 8. 執行完整測試與驗證
  - 8.1 執行 `npm run build` 確認建置成功,無 TypeScript 錯誤
  - 8.2 檢查生成的靜態 HTML 是否包含正確的 lang 屬性
  - 8.3 使用 Lighthouse 測試效能,確認 Performance > 90
  - 8.4 使用 Network tab 檢查字型載入,確認來自 Google Fonts CDN
  - 8.5 檢查最終 CSS 檔案大小(目標 < 50KB gzipped)
  - 8.6 跨瀏覽器測試:Chrome, Firefox, Safari, Edge

- [ ] 9. 執行驗收測試
  - 9.1 使用 AI 讀取 `acceptance.feature` 檔案
  - 9.2 透過 MCP 瀏覽器操作執行每個場景
  - 9.3 驗證所有場景通過並記錄結果
  - 9.4 如有失敗場景,修復問題並重新測試

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑:** `docs/research/2025-10-10-multilingual-typography-design-system.md`

**中文排版專案分析:**
- Han.css:完整但複雜,適合提取設計原則
- heti:標點擠壓和中英文混排功能(本次不實作,未來可考慮)
- typo.css:輕量級理念與極簡風格契合

**日文排版關鍵規則:**
- 字體大小需縮小 10-15%(相對中文)
- 行距需要 170-185%(比中文略低)
- 避免使用斜體(日文不使用斜體)
- 行長控制在 15-35 字元
- 使用 `font-feature-settings: 'palt'` 實現比例間距

**英文長文排版:**
- 行距:130-150%(建議 140-150%)
- 字距:至少 0.12 倍字體大小
- 行長:40-60 字元(理想 66 字元)
- 現代研究顯示襯線與非襯線可讀性無本質差異

**tailwindcss-localized 重要細節:**
- CSS 選擇器 `[lang="xx"]` 會匹配任何有 lang 屬性的父元素
- 不需要在 `<html>` 標籤上,任何父元素都可以
- 在 Next.js App Router 中,在 `[locale]/layout.tsx` 設定最合適
- languages 配置需與 htmlLangMap 的**值**對應,不是 locale 名稱

**OpenType 字型特性:**
- `palt`:Proportional Alternate,為水平文字提供比例間距
- 對於 CJK 標點符號的間距調整特別重要
- 程式碼區塊不應套用此特性

**實作範例(來自研究報告):**

```typescript
// tailwind.config.ts - 語言配置
languages: {
  en: 'en',           // class: en:xxx, 對應 lang="en"
  zh: 'zh-Hant-TW',   // class: zh:xxx, 對應 lang="zh-Hant-TW"
  ja: 'ja',           // class: ja:xxx, 對應 lang="ja"
}
```

```css
/* globals.css - OpenType 特性 */
[lang="ja"] {
  font-feature-settings: 'palt' 1;
}

[lang="zh-Hant-TW"] {
  font-feature-settings: 'palt' 1;
}

pre, code {
  font-feature-settings: normal;
  font-kerning: none;
}
```

### 來自 PRD 的實作細節
> **文件路徑:** `docs/specs/2025-10-10-multilingual-typography/prd.md`

**字型載入配置:**
```typescript
// app/layout.tsx
import {
  Noto_Sans,
  Noto_Sans_TC,
  Noto_Sans_JP,
  Noto_Serif,
  Noto_Serif_TC,
  Noto_Serif_JP,
  Noto_Sans_Mono
} from 'next/font/google'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
})
// ...其他字型類似配置
```

**Tailwind 字型家族配置:**
```typescript
// tailwind.config.ts
fontFamily: {
  sans: [
    'var(--font-noto-sans)',
    'var(--font-noto-sans-tc)',
    'var(--font-noto-sans-jp)',
    'system-ui',
    '-apple-system',
    'sans-serif',
  ],
  serif: [
    'var(--font-noto-serif)',
    'var(--font-noto-serif-tc)',
    'var(--font-noto-serif-jp)',
    'Georgia',
    'serif',
  ],
  mono: [
    'var(--font-noto-sans-mono)',
    'Consolas',
    'Monaco',
    'monospace',
  ],
}
```

**Typography prose 配置結構:**
```typescript
typography: ({ theme }) => ({
  DEFAULT: {
    css: {
      fontSize: '1rem',
      lineHeight: '1.75',
      h1: {
        fontFamily: theme('fontFamily.serif').join(', '),
        fontSize: '2.25rem',
        fontWeight: '700',
      },
      // ...其他元素
    },
  },
  zh: {
    css: {
      fontSize: '1.125rem',
      lineHeight: '2',
      // ...
    },
  },
  ja: {
    css: {
      fontSize: '1rem',
      lineHeight: '1.85',
      // ...
    },
  },
})
```

**PostDetailPage 應用:**
```tsx
<div className="container mx-auto p-4">
  <h1 className="font-serif text-4xl font-bold mb-6">
    {post.title}
  </h1>

  <article
    className="prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: post.content }}
  />

  <div className="font-serif text-sm text-muted-foreground text-right mt-8">
    撰於 {post.date}
  </div>
</div>
```

**技術限制與考量:**
- Noto CJK 字型檔案較大(可能 > 1MB),使用 Google Fonts CDN 快取
- 只載入必要字重減少檔案大小
- 使用 `display: 'swap'` 避免 FOIT 和 layout shift
- CSS 選擇器優先級:`[lang="xx"]` > class
- 深色模式使用 `dark:prose-invert` 自動反轉顏色

### 關鍵技術決策

**1. 混合字型策略(正文非襯線 + 標題襯線):**
- 理由:創造視覺層次,兼顧可讀性與美感
- 正文使用 Noto Sans 系列確保長時間閱讀舒適
- 標題使用 Noto Serif 系列增加優雅感和權威性
- 署名使用 Noto Serif 帶有文學氣息

**2. 語言特定參數設定:**
- 中文:字體大 18px,行距寬 200%,字距 0.05em
- 日文:字體中 16px,行距中 185%,字距 0.02em(比中文小約 11%)
- 英文:字體中 16px,行距窄 175%,字距 0.01em
- 基於研究的最佳實踐,確保每種語言都有最佳閱讀體驗

**3. 使用 tailwindcss-localized 而非 CSS 變數:**
- 提供清晰的語言變體機制(zh:text-lg)
- 與 Tailwind 生態系統完美整合
- 支援響應式變體組合(md:zh:text-xl)
- 配置集中在 tailwind.config.ts,易於管理

**4. lang 屬性放在 [locale]/layout.tsx:**
- 根 layout 無法取得 locale 參數
- 在 locale layout 的根 div 設定 lang 屬性
- CSS 選擇器會匹配任何父元素,不限於 `<html>`
- 符合 Next.js App Router 架構

**5. OpenType palt 特性用於中日文:**
- 優化 CJK 標點符號的比例間距
- 避免標點連續出現時過度空白
- 程式碼區塊不套用,保持等寬特性

**6. 使用 shadcn/ui 顏色變數:**
- 確保深色模式自動適配
- 使用 foreground, primary, muted-foreground 等語意化顏色
- 不使用硬編碼顏色(如 gray-500)
- 符合現有設計系統

**7. 效能優化策略:**
- 字型使用 `display: 'swap'` 避免阻塞
- 只載入需要的字重(400/500/600 和 400/600/700)
- 利用 Google Fonts CDN 和瀏覽器快取
- Tailwind purge 自動移除未使用的樣式
