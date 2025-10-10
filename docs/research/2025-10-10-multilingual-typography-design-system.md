# 多語言部落格排版設計系統研究報告

## 執行摘要

本研究針對多語言部落格(繁體中文、英文、日文)的排版設計系統進行深入分析,目的是建立一套基於 Tailwind CSS 和 shadcn/ui 的樣式組織架構,同時支援不同語言的閱讀體驗優化。經過全面調查後,我們發現了幾個關鍵發現:

- **中文排版的核心需求**:標點擠壓、中英文混排空格、適當的行距字距調整是提升閱讀體驗的關鍵
- **日文排版的特殊性**:需要比中文更大的行距(170%+)、字體大小需縮小 10-15%、避免使用斜體
- **英文長文排版**:行距 130-150%、行長 40-60 字元、字距至少 0.12 倍字體大小
- **多語言樣式組織**:使用 `tailwindcss-localized` 插件可以基於 `lang` 屬性實現語言特定樣式
- **字型選擇策略**:Noto 系列提供了視覺和諧的多語言解決方案,襯線與非襯線應根據內容類型選擇

## 背景與脈絡

這是一個基於 Next.js 15 的多語言部落格,使用 App Router 和靜態匯出架構。部落格支援三種語言:繁體中文(zh)、英文(en)和日文(ja),內容以 Markdown 格式儲存,主要為長文形式的技術和生活文章。

目前的技術堆疊包括:
- **框架**:Next.js 15.1.6 with App Router
- **樣式**:Tailwind CSS 3.4.16
- **UI 元件**:shadcn/ui (基於 Radix UI)
- **主題**:next-themes 實現深色/淺色模式切換
- **字型**:Google Fonts 的 Noto Sans TC 和 Noto Serif TC

專案剛完成樣式重置,移除了所有自定義樣式,現在需要重新設計一套支援多語言、注重閱讀體驗的排版系統。這個系統需要在保持視覺統一的前提下,針對不同語言的閱讀特性進行微調。

## 研究問題與發現過程

### 初始請求

使用者希望建立一套支援多語言的排版設計系統,具體需求包括:

1. **樣式組織架構**:使用 Tailwind CSS 和 shadcn/ui 的最佳實踐來組織樣式
2. **多語言微調**:不同語言需要不同的行距、字距等排版參數
3. **長文閱讀體驗**:優化部落格文章的閱讀舒適度
4. **字型策略**:不同語言使用不同字型,但風格要統一

### 釐清過程

通過與使用者的對話,我們明確了以下重點:

- **中文排版參考**:研究 Han.css、heti、typo.css 三個專案的設計理念,提取適合的元素
- **日文排版研究**:尋找類似的日文排版最佳實踐和專案
- **優先順序**:支援多語言微調的樣式組織架構,同時支援長文閱讀體驗
- **字型策略**:風格統一(襯線/非襯線一致),但可使用不同字型家族
- **整合方式**:基於 shadcn/ui 修改,專注於閱讀體驗相關的樣式

## 技術分析:深入理解問題

### 中文排版專案分析

#### Han.css (漢字標準格式)

Han.css 是一個專為漢字網頁排版設計的框架,其核心理念包括語意樣式標準化、文字設計和高階排版功能。

**核心特色:**
- **標點符號處理**:精細控制標點符號的顯示和間距
- **中英文混排**:自動處理中西文混排時的空格和字體切換
- **多級回退**:提供多級樣式回退機制,確保跨瀏覽器相容
- **完整語言支援**:支援繁體中文、簡體中文和日文

**技術實作:**
- 使用 Sass/Stylus 和 JavaScript
- CSS 樣式表和 JavaScript 腳本解耦設計
- 支援高度客製化

**設計哲學:**
符合傳統閱讀習慣,為螢幕閱讀提供標準化環境,通過專業的排版技術提升漢字網頁的閱讀美感。

#### heti (赫蹏)

heti 是一個專注於提升中文內容顯示的排版增強庫,遵循標準中文排版規則。

**核心特色:**
- **網格對齊排版**:使用網格系統確保排版整齊
- **標點自動擠壓**:全角標點自動擠壓,節省空間並提升美感
- **中英文混排**:JavaScript 自動在中西文間插入適當空格
- **預置樣式**:提供行間注、多欄、直排等預置樣式
- **暗黑模式**:自適應暗黑模式

**技術實作:**
- 基於 JavaScript 腳本增強
- 提供多種字體族預設(桌面端)
- 兼容常見 CSS 重置方案
- 移動端支援

**設計哲學:**
"總之,用上就會變好看" - 強調簡單易用,應用即有效果。

#### typo.css

typo.css 的目標是統一瀏覽器排版效果,為中文網頁閱讀創造最佳排版體驗。

**核心特色:**
- **輕量級 reset**:保持元素乾淨且一致
- **快速應用**:提供 `.typo` class 快速應用排版樣式
- **中文特殊需求**:支援專名號(`<u>`)、著重號(`.typo-em`)、襯線字體(`.serif`)

**與其他專案的差異:**
- 不像 normalize.css 預定義所有元素樣式
- 更注重保持元素的乾淨和可客製化性
- 適用於文章/文檔類網頁

**設計哲學:**
一致化瀏覽器排版效果,構建最適合中文閱讀的網頁排版。

#### 三個專案的比較與適用性

| 特點 | Han.css | heti | typo.css |
|------|---------|------|----------|
| **複雜度** | 高 - 功能完整 | 中 - JavaScript 增強 | 低 - 輕量級 |
| **標點處理** | 精細控制 | 自動擠壓 | 基本支援 |
| **中英混排** | 自動處理 | 自動空格 | 基本支援 |
| **客製化** | 高度可客製 | 預置樣式 | 簡單可客製 |
| **學習曲線** | 陡峭 | 平緩 | 平緩 |
| **適用場景** | 專業出版級別 | 一般部落格文章 | 簡單文檔頁面 |

**建議:**
- **Han.css** 的理念最完整,但複雜度高,適合提取其設計原則而非直接使用
- **heti** 的標點擠壓和中英文混排功能值得參考,特別是其 JavaScript 增強腳本
- **typo.css** 的輕量級理念與我們的極簡風格契合,但功能相對基礎

**推薦方向:**
結合 typo.css 的輕量級理念、heti 的標點處理和中英文混排功能,以及 Han.css 的設計原則,在 Tailwind CSS 框架下重新實作。

### 日文排版最佳實踐

#### 日文排版的七個黃金規則

根據 AQ Works 的研究,日文排版有以下關鍵規則:

1. **字型搭配**:無襯線字體(Sans Serif)搭配哥德體(Gothic),襯線字體(Serif)搭配明朝體(Mincho)
2. **避免斜體**:日文不使用斜體,強制套用會使文字難以辨識
3. **行長控制**:保持在 15-35 字元之間,根據文字類型調整(標題較短,正文較長)
4. **文字對齊**:儘量使用兩端對齊,雖然瀏覽器支援有限
5. **字體大小縮減**:日文字元因方形輪廓顯得較大,需縮小 10-15%
6. **行距增加**:增加 10-15% 的行距,為密集的方形字元提供呼吸空間
7. **水平方向**:網頁上堅持使用水平排版,垂直排版在數位介面中不自然

#### 日本數位廳設計系統建議

日本政府的數位廳設計系統提供了官方的排版指南:

**字型選擇:**
- 使用 Noto Sans JP (無襯線字體)
- 強調可讀性和清晰度
- 採用開源授權

**行距設計:**
- 本文建議行高至少 1.5 倍字體大小(150%)
- 提供多種行高選項(100% - 175%)
- 根據不同用途調整行距

**字距設計:**
- 依字體大小設定不同字距
- 範圍從 0 到 2%
- 考慮可讀性和視覺美感

**字體大小:**
- 基本字體大小 16px 以上
- 提供多種尺寸從 14px 到 64px

#### CJK 排版的共同特點

研究顯示,中日韓(CJK)文字有以下共同特點:

- **更高的行距需求**:建議 170% 左右,因為字元密度高
- **方形字元**:缺少升部和降部,類似全大寫拉丁文,需要更多垂直空間
- **字距調整**:使用 `font-feature-settings: 'palt'` 實現比例間距
- **標點處理**:CJK 標點字元間距需要調整,避免過度空白

#### 日文排版技術實作

**CSS Font Features:**
```css
font-feature-settings: 'palt' 1; /* 水平文字的比例間距 */
font-feature-settings: 'vpal' 1; /* 垂直文字的比例間距 */
```

**新興 CSS 屬性:**
- `text-spacing-trim`:用於 CJK 標點間距調整(開發中)
- `word-break: auto-phrase`:優化日文換行(Chrome 119+)

### 英文長文排版最佳實踐

#### 行距(Line Height)

**標準建議:**
- **常規範圍**:130%-150% 的字體大小
- **最佳實踐**:140% 是最常被引用的甜蜜點
- **WCAG 無障礙標準**:至少 150%(1.5 倍)

**進階建議:**
- 桌面端,45-75 字元每行(理想 66 字元):行距 1.3-1.45
- 較短行距:1.125-1.200 倍字體大小(112.5%-120%)
- 較長行需要更多行距,協助讀者視線轉移

#### 字距(Letter Spacing)

**標準建議:**
- 字距至少 0.12 倍字體大小
- 詞距至少 0.16 倍字體大小

**研究發現:**
- 對於閱讀障礙兒童,更寬的字距可以提升兩倍閱讀準確度
- 閱讀速度提升超過 20%
- 強調適當間距對無障礙性的重要性

#### 行長(Line Length)

**最佳實踐:**
- 40-60 字元(包含空格和標點)
- 理想值為 66 字元
- 對無障礙性和可讀性都很重要

**文字寬度:**
- 主要內容區域應為 600-700 像素寬
- 確保在不同螢幕尺寸下保持舒適的行長

#### 襯線 vs 非襯線字體

**傳統觀點:**
- 襯線字體在印刷長文中較易閱讀,因為襯線形成視覺導引
- 非襯線字體在螢幕上較易閱讀,特別是低解析度時

**現代研究發現(2024):**
- 受控研究顯示襯線和非襯線字體在易讀性上**沒有本質差異**
- 針對兒童線上閱讀的研究發現,兩者在閱讀速度和理解度上沒有顯著差異
- 高解析度螢幕已經縮小了兩者的差距

**實務建議:**
- **襯線字體**:適合長文印刷,但在低解析度或小螢幕上可能模糊
- **非襯線字體**:在各種螢幕上都清晰,特別是低解析度裝置
- **選擇依據**:應基於目標受眾、裝置環境和品牌識別,而非普遍規則

**2024 共識:**
字型選擇應根據具體情境,現代螢幕技術已經讓兩者都能提供良好的閱讀體驗。

### Tailwind CSS 多語言樣式組織架構

#### tailwindcss-localized 插件

這是一個專門為多語言網站設計的 Tailwind CSS 插件,允許基於語言創建樣式變體。

**安裝:**
```bash
npm i tailwindcss-localized -D
```

**配置方式:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    // 配置語言代碼,需與 htmlLangMap 的值對應
    languages: ['en', 'zh-Hant-TW', 'ja']

    // 或使用自定義前綴(推薦,讓 class 名稱更簡潔)
    languages: {
      en: 'en',           // class: en:text-lg
      zh: 'zh-Hant-TW',   // class: zh:text-lg
      ja: 'ja',           // class: ja:text-base
    }
  },
  variants: {
    fontSize: ['responsive', 'localized'],
    lineHeight: ['responsive', 'localized'],
    letterSpacing: ['responsive', 'localized']
  },
  plugins: [
    require('tailwindcss-localized')
  ]
}
```

**重要:語言代碼對應**

`tailwindcss-localized` 的 `languages` 配置需要與 `htmlLangMap` 的**值**對應,不是與 locale 對應:

```typescript
// ✅ 正確配置
languages: {
  en: 'en',           // 對應 htmlLangMap[en] = 'en'
  zh: 'zh-Hant-TW',   // 對應 htmlLangMap[zh] = 'zh-Hant-TW'
  ja: 'ja',           // 對應 htmlLangMap[ja] = 'ja'
}

// ❌ 錯誤配置(這會找不到對應的 lang 屬性)
languages: ['en', 'zh', 'ja']  // 因為實際 DOM 中是 lang="zh-Hant-TW",不是 lang="zh"
```

這樣配置後:
- DOM 中會有 `<div lang="zh-Hant-TW">`
- 可以使用 `zh:text-lg` class
- 生成的 CSS 是 `[lang="zh-Hant-TW"] .zh\:text-lg { ... }`

**使用方式:**
```html
<!-- 不同語言使用不同字體大小 -->
<div class="text-base en:text-base zh:text-lg ja:text-base">
  多語言內容
</div>

<!-- 不同語言使用不同行距 -->
<article class="leading-normal en:leading-relaxed zh:leading-loose ja:leading-loose">
  文章內容
</article>
```

**生成的 CSS:**
```css
[lang="en"] .en\:text-base {
  font-size: 1rem;
}

[lang="zh"] .zh\:text-lg {
  font-size: 1.125rem;
}

[lang="ja"] .ja\:text-base {
  font-size: 1rem;
}
```

**重要:關於 `lang` 屬性的位置**

`tailwindcss-localized` 使用 CSS 屬性選擇器 `[lang="xx"]`,這意味著:
- ✅ `lang` 屬性可以放在**任何父元素**上,不一定要在 `<html>` 標籤
- ✅ 只要元素是有 `lang` 屬性的父元素的**後代**,就能套用樣式
- ✅ 適用於 Next.js App Router 的 `[locale]/layout.tsx` 架構

**在本專案中的應用:**

由於本專案使用 Next.js App Router,locale 參數只在 `app/[locale]/layout.tsx` 中可用,根 layout(`app/layout.tsx`)無法直接取得 locale 資訊。因此我們會在 locale layout 的根元素上設定 `lang` 屬性:

```tsx
// app/[locale]/layout.tsx
import { htmlLangMap, type Locale } from "@/lib/i18n/locales";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">
      <Navbar locale={locale} />
      {children}
    </div>
  );
}
```

這樣所有頁面內容都會在有 `lang` 屬性的元素內,`tailwindcss-localized` 的樣式就能正常運作。

**htmlLangMap 對應關係:**
```typescript
// lib/i18n/locales.ts
export const htmlLangMap: Record<Locale, string> = {
  zh: 'zh-Hant-TW',  // 繁體中文(台灣)
  ja: 'ja',          // 日文
  en: 'en',          // 英文
}
```

**優點:**
- 與 Tailwind 生態系統完美整合
- 基於 HTML `lang` 屬性自動套用,不限於 `<html>` 標籤
- 支援所有 Tailwind utilities
- 可與響應式變體組合使用
- 適用於 Next.js App Router 架構

**實際應用場景:**
- 針對不同語言調整字體大小
- 針對不同語言設定不同行距和字距
- 右至左語言的版面調整
- 語言特定的響應式設計

#### Tailwind Typography 插件整合

**@tailwindcss/typography 插件:**
提供 `prose` class,為無法控制的 HTML(如 Markdown 渲染)添加美觀的排版預設。

**安裝:**
```bash
npm install -D @tailwindcss/typography
```

**基本使用:**
```html
<article class="prose lg:prose-xl">
  {{ markdown }}
</article>
```

**客製化排版樣式:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // 自定義樣式
            lineHeight: '1.75',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
          },
        },
        // 針對不同語言的客製化
        zh: {
          css: {
            lineHeight: '2',
            letterSpacing: '0.05em',
          },
        },
      }),
    },
  },
}
```

**結合多語言:**
```html
<article class="prose zh:prose-zh ja:prose-ja">
  多語言文章內容
</article>
```

#### 組織架構建議

**檔案結構:**
```
app/
  globals.css          # 基礎樣式和 CSS 變數
  typography.css       # 排版相關樣式(可選)
lib/
  typography/
    zh.ts             # 中文排版配置
    ja.ts             # 日文排版配置
    en.ts             # 英文排版配置
    index.ts          # 統一匯出
tailwind.config.ts    # Tailwind 配置
```

**配置範例:**
```typescript
// lib/typography/zh.ts
export const zhTypography = {
  fontSize: {
    base: '1.125rem',  // 18px
    lg: '1.25rem',     // 20px
  },
  lineHeight: {
    normal: '2',       // 200%
    relaxed: '2.25',   // 225%
  },
  letterSpacing: {
    normal: '0.05em',
  },
}

// lib/typography/ja.ts
export const jaTypography = {
  fontSize: {
    base: '1rem',      // 16px (縮小 10-15%)
    lg: '1.125rem',    // 18px
  },
  lineHeight: {
    normal: '1.7',     // 170%
    relaxed: '1.85',   // 185%
  },
  letterSpacing: {
    normal: '0.02em',
  },
}

// lib/typography/en.ts
export const enTypography = {
  fontSize: {
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
  },
  lineHeight: {
    normal: '1.5',     // 150%
    relaxed: '1.75',   // 175%
  },
  letterSpacing: {
    normal: '0.01em',
  },
}
```

### shadcn/ui 與自定義樣式整合

#### shadcn/ui 排版方式

shadcn/ui **不提供預設的排版樣式**,而是展示如何使用 utility classes 來設計文字樣式。

**官方建議:**
使用 Tailwind utility classes 直接在元件中定義排版:

```tsx
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  標題
</h1>

<p class="leading-7 [&:not(:first-child)]:mt-6">
  段落內容
</p>
```

#### shadcn-prose 專案

shadcn-prose 是一個專為 shadcn/ui 設計的排版樣式庫,提供與 shadcn/ui 美學一致的長文格式。

**特點:**
- 為部落格文章或文檔頁面優化
- 與 shadcn/ui 的設計語言一致
- 預設良好的排版樣式

**注意:**
shadcn-prose 已遷移到 Kibo UI 的 Typography 元件,建議查看最新版本。

#### 整合策略

**方案一:使用 @tailwindcss/typography + 客製化**

1. 安裝 Tailwind Typography 插件
2. 在 `tailwind.config.ts` 中擴展 typography
3. 針對不同語言定義不同的 prose 變體

```javascript
module.exports = {
  theme: {
    extend: {
      typography: {
        zh: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '2',
            h2: {
              fontSize: '1.875rem',
              marginTop: '2em',
            },
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
          },
        },
        ja: {
          css: {
            fontSize: '1rem',
            lineHeight: '1.7',
            h2: {
              fontSize: '1.75rem',
            },
          },
        },
      },
    },
  },
}
```

**方案二:shadcn/ui utility classes + CSS 變數**

1. 在 `globals.css` 定義語言特定的 CSS 變數
2. 使用 shadcn/ui 的方式撰寫元件
3. 通過 `lang` 屬性切換變數值

```css
/* globals.css */
:root {
  --typography-base: 1rem;
  --typography-line-height: 1.5;
}

[lang="zh"] {
  --typography-base: 1.125rem;
  --typography-line-height: 2;
}

[lang="ja"] {
  --typography-base: 1rem;
  --typography-line-height: 1.7;
}
```

```tsx
// 元件中
<article class="text-[length:var(--typography-base)] leading-[var(--typography-line-height)]">
  內容
</article>
```

**推薦方案:**
結合兩者:
- **閱讀內容區域**(文章正文):使用 `@tailwindcss/typography` 的 `prose` class
- **UI 元件**(導航、按鈕等):使用 shadcn/ui 的 utility classes 方式
- **多語言微調**:使用 CSS 變數或 `tailwindcss-localized` 插件

### 字型選擇策略

#### Noto 字型家族的優勢

**Google Noto 字型家族:**
- **全面覆蓋**:支援 1000+ 語言和 150+ 書寫系統
- **視覺和諧**:設計目標是跨語言的視覺和諧(相容的高度和筆畫粗細)
- **CJK 支援**:Noto Sans CJK 和 Noto Serif CJK 全面覆蓋繁中、簡中、日文、韓文

**CJK 字型:**
- **Noto Sans CJK** = Adobe Source Han Sans(思源黑體)
- **Noto Serif CJK** = Adobe Source Han Serif(思源宋體)
- 由 Adobe 和 Google 共同開發
- 包含 CJK 字元、平假名、片假名、諺文
- 拉丁字母和數字來自 Source Pro 字型

**語言特定變體:**
- **Noto Sans TC**:繁體中文(台灣)
- **Noto Sans SC**:簡體中文(中國大陸)
- **Noto Sans JP**:日文
- **Noto Sans / Noto Serif**:拉丁、希臘、西里爾字母(英文等)

#### 襯線 vs 非襯線策略

**統一風格的重要性:**
根據使用者需求,襯線/非襯線應在所有語言間統一,以保持視覺一致性。

**方案一:全部使用非襯線(Sans Serif)**

**優點:**
- 在所有螢幕解析度下都清晰
- 現代、簡潔的視覺風格
- 適合技術部落格
- Noto Sans 家族支援完整

**字型組合:**
- 中文:Noto Sans TC
- 日文:Noto Sans JP
- 英文:Noto Sans

**行距建議:**
- 中文:180-200%
- 日文:170-185%
- 英文:140-150%

**方案二:全部使用襯線(Serif)**

**優點:**
- 傳統、優雅的閱讀體驗
- 適合長文閱讀(高解析度螢幕)
- 適合生活、文學類文章
- Noto Serif 家族支援完整

**字型組合:**
- 中文:Noto Serif TC
- 日文:Noto Serif JP
- 英文:Noto Serif

**行距建議:**
- 中文:200-220%
- 日文:185-200%
- 英文:150-175%

**方案三:混合策略(依內容類型)**

**實作方式:**
- 技術文章(tech):使用 Sans Serif
- 生活文章(life):使用 Serif
- 短文/照片(shorts):使用 Sans Serif

```html
<!-- 根據分類切換字型 -->
<article class="tech:font-sans life:font-serif shorts:font-sans">
  內容
</article>
```

#### 推薦字型組合

**推薦:混合策略(正文非襯線 + 標題襯線)**

這是一個經典且優雅的排版策略,通過字型對比創造視覺層次,同時兼顧可讀性與美感。

**理由:**
1. **視覺層次分明**:襯線標題與非襯線正文形成清晰對比
2. **兼顧可讀性與美感**:正文非襯線保證閱讀舒適,標題襯線增加優雅感
3. **符合現代設計趨勢**:高品質部落格和出版物常採用此策略
4. **賦予個性**:署名使用襯線顯得更有文學氣息
5. **跨裝置表現**:正文在所有裝置都清晰,標題尺寸大不受影響

**字型分配:**

**正文(Sans Serif):**
- 英文:Noto Sans
- 中文:Noto Sans TC
- 日文:Noto Sans JP
- 程式碼:Noto Sans Mono

**標題與署名(Serif):**
- 英文:Noto Serif
- 中文:Noto Serif TC
- 日文:Noto Serif JP

**字型堆疊配置:**
```css
/* 正文字型(非襯線) */
--font-sans:
  "Noto Sans",           /* 拉丁字母(英文) */
  "Noto Sans TC",        /* 繁體中文 */
  "Noto Sans JP",        /* 日文 */
  system-ui,             /* 系統字型回退 */
  -apple-system,
  sans-serif;

/* 標題與署名字型(襯線) */
--font-serif:
  "Noto Serif",          /* 拉丁字母(英文) */
  "Noto Serif TC",       /* 繁體中文 */
  "Noto Serif JP",       /* 日文 */
  Georgia,               /* 系統襯線回退 */
  serif;

/* 程式碼字型(等寬) */
--font-mono:
  "Noto Sans Mono",
  "Consolas",
  "Monaco",
  monospace;
```

**語言特定調整:**
```css
:root {
  --font-sans: "Noto Sans", system-ui, sans-serif;
  --font-serif: "Noto Serif", Georgia, serif;
}

[lang="zh"] {
  --font-sans: "Noto Sans TC", "Noto Sans", system-ui, sans-serif;
  --font-serif: "Noto Serif TC", "Noto Serif", Georgia, serif;
}

[lang="ja"] {
  --font-sans: "Noto Sans JP", "Noto Sans", system-ui, sans-serif;
  --font-serif: "Noto Serif JP", "Noto Serif", Georgia, serif;
}

[lang="en"] {
  --font-sans: "Noto Sans", system-ui, sans-serif;
  --font-serif: "Noto Serif", Georgia, serif;
}
```

**元件中的應用:**
```tsx
// 文章正文
<article className="font-sans">
  <h1 className="font-serif">標題使用襯線</h1>
  <p>正文使用非襯線...</p>
  <div className="font-serif text-sm text-muted-foreground">
    撰於 2025 年...
  </div>
</article>
```

**視覺效果預期:**
- **標題(H1-H6)**:使用襯線字體,較粗字重(600-700),賦予文章主題優雅感和權威性
- **正文段落**:使用非襯線字體,正常字重(400),確保長時間閱讀舒適
- **署名區塊**:使用襯線字體,較細字重(400),帶有人文氣息和文學感
- **程式碼**:使用等寬字體,與正文和標題形成明確區隔

#### OpenType 字型特性

**日文和中文的字型特性優化:**

```css
/* 全域設定 */
body {
  font-feature-settings: normal;
  font-kerning: auto;
}

/* 日文特定 */
[lang="ja"] {
  font-feature-settings: 'palt' 1;  /* 比例間距 */
}

/* 中文特定 */
[lang="zh"] {
  font-feature-settings: 'palt' 1;  /* 比例間距 */
}

/* 程式碼區塊 */
pre, code {
  font-feature-settings: normal;
  font-kerning: none;
}
```

**font-feature-settings 說明:**
- `palt`:Proportional Alternate,為水平文字提供比例間距
- `vpal`:Vertical Proportional Alternate,為垂直文字提供比例間距(不適用於水平網頁)
- 對於 CJK 標點符號的間距調整特別重要

## 解決方案探索與評估

### 方案一:輕量級方案(基於 tailwindcss-localized)

**描述:**
使用 `tailwindcss-localized` 插件,結合 Tailwind 的 utility classes,最小化自定義 CSS。

**實作步驟:**
1. 安裝 `tailwindcss-localized` 插件
2. 在元件中使用語言特定的 utility classes
3. 定義少量 CSS 變數用於全域設定

**範例:**
```html
<article class="
  text-base zh:text-lg ja:text-base
  leading-normal en:leading-relaxed zh:leading-loose ja:leading-relaxed
  tracking-normal en:tracking-normal zh:tracking-wide ja:tracking-tight
">
  文章內容
</article>
```

**評估:**
- **實作複雜度**:低 - 只需安裝插件和使用 utility classes
- **維護影響**:低 - 樣式定義在元件中,清楚易懂
- **風險等級**:低 - 完全基於 Tailwind 生態系統
- **彈性**:中 - 可以靈活調整,但 class 名稱可能變長
- **效能**:優 - 使用 Tailwind 的 purge 機制,CSS 檔案小

**適用情境:**
專案規模小到中,樣式需求不複雜,團隊熟悉 Tailwind。

### 方案二:混合方案(tailwindcss-localized + @tailwindcss/typography)

**描述:**
結合 `tailwindcss-localized` 和 `@tailwindcss/typography`,為文章內容使用 `prose` class,其他部分使用 utility classes。

**實作步驟:**
1. 安裝 `tailwindcss-localized` 和 `@tailwindcss/typography`
2. 在 `tailwind.config.ts` 中自定義 typography 主題
3. 針對不同語言定義不同的 prose 變體
4. 在元件中組合使用

**範例:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    languages: ['en', 'zh', 'ja'],
    extend: {
      typography: {
        zh: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '2',
            letterSpacing: '0.05em',
            // ... 其他樣式
          },
        },
        ja: {
          css: {
            fontSize: '1rem',
            lineHeight: '1.7',
            letterSpacing: '0.02em',
            // ... 其他樣式
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-localized'),
  ],
}
```

```html
<article class="prose prose-lg zh:prose-zh ja:prose-ja">
  {{ markdown 內容 }}
</article>
```

**評估:**
- **實作複雜度**:中 - 需要配置多個 prose 變體
- **維護影響**:低 - 配置集中在 config 檔案,元件保持簡潔
- **風險等級**:低 - 基於成熟的 Tailwind 插件
- **彈性**:高 - 可以詳細自定義每個元素的樣式
- **效能**:優 - prose 樣式經過優化

**適用情境:**
專案有大量 Markdown 內容,需要精細控制排版樣式,團隊願意投入時間配置。

### 方案三:CSS 變數方案(基於 shadcn/ui 模式)

**描述:**
使用 CSS 變數定義語言特定的排版參數,通過 `lang` 屬性自動切換,元件使用 shadcn/ui 風格的 utility classes。

**實作步驟:**
1. 在 `globals.css` 定義 CSS 變數
2. 使用 `[lang="xx"]` 選擇器定義語言特定值
3. 元件中使用 `var()` 引用變數
4. 可選:使用 `@layer utilities` 定義自定義 utilities

**範例:**
```css
/* globals.css */
@layer base {
  :root {
    /* 英文預設 */
    --typography-base: 1rem;
    --typography-lg: 1.125rem;
    --typography-xl: 1.25rem;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    --letter-spacing-normal: 0.01em;
  }

  [lang="zh"] {
    --typography-base: 1.125rem;
    --typography-lg: 1.25rem;
    --typography-xl: 1.5rem;
    --line-height-normal: 2;
    --line-height-relaxed: 2.25;
    --letter-spacing-normal: 0.05em;
  }

  [lang="ja"] {
    --typography-base: 1rem;
    --typography-lg: 1.125rem;
    --typography-xl: 1.25rem;
    --line-height-normal: 1.7;
    --line-height-relaxed: 1.85;
    --letter-spacing-normal: 0.02em;
  }
}

@layer utilities {
  .text-article {
    font-size: var(--typography-base);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-normal);
  }

  .text-article-lg {
    font-size: var(--typography-lg);
    line-height: var(--line-height-relaxed);
  }
}
```

```tsx
// 元件中
<article className="text-article">
  內容
</article>

<h2 className="text-article-lg font-bold">
  標題
</h2>
```

**評估:**
- **實作複雜度**:中 - 需要設計完整的變數系統
- **維護影響**:中 - 變數集中管理,但需要記住變數名稱
- **風險等級**:低 - CSS 變數是標準特性
- **彈性**:高 - 可以靈活定義任何參數
- **效能**:優 - CSS 變數運行時切換,無額外開銷

**適用情境:**
需要高度一致性的設計系統,團隊偏好 shadcn/ui 風格,希望集中管理樣式參數。

### 方案比較

| 評估項目 | 方案一(localized) | 方案二(localized + typography) | 方案三(CSS 變數) |
|---------|-------------------|-------------------------------|-----------------|
| **學習曲線** | 低 | 中 | 中 |
| **配置複雜度** | 低 | 中 | 中 |
| **元件簡潔度** | 中(class 較長) | 高 | 高 |
| **樣式控制** | 中 | 高 | 高 |
| **重複使用性** | 低 | 高 | 高 |
| **類型安全** | 無 | 無 | 可加入(TS) |
| **Markdown 支援** | 需手動處理 | 優秀(prose) | 需手動處理 |
| **shadcn/ui 整合** | 良好 | 良好 | 優秀 |
| **推薦場景** | 簡單專案 | 內容網站 | 設計系統 |

## 建議與決策指引

基於以上分析,我建議採用**方案二:混合方案(tailwindcss-localized + @tailwindcss/typography)**,並輔以部分 CSS 變數。

### 推薦理由

1. **專案特性契合**:專案為部落格,有大量 Markdown 內容,`@tailwindcss/typography` 的 `prose` class 是最佳選擇
2. **多語言支援完整**:`tailwindcss-localized` 提供了清晰的語言變體機制
3. **維護成本低**:配置集中在 `tailwind.config.ts`,元件保持簡潔
4. **彈性高**:可以針對每個語言精細調整所有排版元素
5. **生態系統成熟**:兩個插件都是 Tailwind 生態系統的成熟專案

### 實施指引

#### 第一階段:基礎設定

**1. 安裝依賴:**
```bash
npm install -D @tailwindcss/typography tailwindcss-localized
```

**2. 配置 Tailwind(正文非襯線 + 標題襯線):**
```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    // 配置語言,使用自定義前綴對應 htmlLangMap
    languages: {
      en: 'en',           // class: en:xxx, 對應 lang="en"
      zh: 'zh-Hant-TW',   // class: zh:xxx, 對應 lang="zh-Hant-TW"
      ja: 'ja',           // class: ja:xxx, 對應 lang="ja"
    },
    extend: {
      fontFamily: {
        // 正文字型(非襯線)
        sans: [
          'var(--font-noto-sans)',
          'var(--font-noto-sans-tc)',
          'var(--font-noto-sans-jp)',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        // 標題與署名字型(襯線)
        serif: [
          'var(--font-noto-serif)',
          'var(--font-noto-serif-tc)',
          'var(--font-noto-serif-jp)',
          'Georgia',
          'serif',
        ],
        // 程式碼字型(等寬)
        mono: [
          'var(--font-noto-sans-mono)',
          'Consolas',
          'Monaco',
          'monospace',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-localized'),
  ],
  variants: {
    fontSize: ['responsive', 'localized'],
    lineHeight: ['responsive', 'localized'],
    letterSpacing: ['responsive', 'localized'],
    fontFamily: ['responsive', 'localized'],
  },
}

export default config
```

**3. 載入字型(正文非襯線 + 標題襯線):**
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

// 正文字型(非襯線)
const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600'],  // Regular, Medium, SemiBold
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '600'],
  display: 'swap',
})

// 標題與署名字型(襯線)
const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '600', '700'],  // Regular, SemiBold, Bold
  display: 'swap',
})

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  variable: '--font-noto-serif-jp',
  weight: ['400', '600', '700'],
  display: 'swap',
})

// 程式碼字型(等寬)
const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-noto-sans-mono',
  weight: ['400', '600'],
  display: 'swap',
})

export default function RootLayout({ children, params }: Props) {
  return (
    <html suppressHydrationWarning>
      <body className={`
        ${notoSans.variable}
        ${notoSansTC.variable}
        ${notoSansJP.variable}
        ${notoSerif.variable}
        ${notoSerifTC.variable}
        ${notoSerifJP.variable}
        ${notoSansMono.variable}
        font-sans
        antialiased
      `}>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**4. 修改 locale layout 加入 lang 屬性:**

這是**關鍵步驟**,讓 `tailwindcss-localized` 能夠運作:

```typescript
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { locales, type Locale, htmlLangMap } from "@/lib/i18n/locales";
import { siteConfig } from "@/lib/siteConfig";
import Navbar from "@/components/Navbar";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  await params;

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    alternates: {
      languages: {
        'zh-Hant': `${siteConfig.link}/zh`,
        'ja': `${siteConfig.link}/ja`,
        'en': `${siteConfig.link}/en`,
        'x-default': `${siteConfig.link}/zh`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;

  return (
    {/* 關鍵:在根 div 加上 lang 屬性 */}
    <div lang={htmlLangMap[locale]} className="mx-auto max-w-3xl">
      <Navbar locale={locale} />
      {children}
    </div>
  );
}
```

**為什麼這樣做:**
- Next.js App Router 的根 layout 無法直接取得 `[locale]` 參數
- 在 `[locale]/layout.tsx` 的根元素加上 `lang` 屬性
- `tailwindcss-localized` 的 CSS 選擇器會匹配任何有 `lang` 屬性的父元素
- 所有頁面內容都在這個 div 內,因此語言特定樣式會正常套用

#### 第二階段:自定義 Typography

**配置語言特定的 prose 樣式:**

```javascript
// tailwind.config.ts (續)
module.exports = {
  theme: {
    extend: {
      typography: ({ theme }) => ({
        // 預設(英文)
        DEFAULT: {
          css: {
            fontSize: '1rem',
            lineHeight: '1.75',
            letterSpacing: '0.01em',
            maxWidth: '65ch',
            color: theme('colors.foreground'),

            // 標題(使用襯線字體)
            h1: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '2.25rem',
              marginTop: '0',
              marginBottom: '0.8em',
              lineHeight: '1.2',
              fontWeight: '700',
            },
            h2: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.875rem',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3',
              fontWeight: '700',
            },
            h3: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.5rem',
              marginTop: '1.6em',
              marginBottom: '0.8em',
              lineHeight: '1.4',
              fontWeight: '600',
            },
            h4: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.25rem',
              marginTop: '1.5em',
              marginBottom: '0.6em',
              lineHeight: '1.4',
              fontWeight: '600',
            },

            // 段落
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },

            // 列表
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },

            // 連結
            a: {
              color: theme('colors.primary.DEFAULT'),
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },

            // 引用
            blockquote: {
              fontStyle: 'normal',
              borderLeftColor: theme('colors.border'),
              borderLeftWidth: '4px',
              paddingLeft: '1em',
              marginTop: '1.6em',
              marginBottom: '1.6em',
            },

            // 程式碼
            code: {
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.875rem',
              lineHeight: '1.7',
              marginTop: '1.7em',
              marginBottom: '1.7em',
              borderRadius: '0.375rem',
              paddingTop: '1em',
              paddingRight: '1.5em',
              paddingBottom: '1em',
              paddingLeft: '1.5em',
            },
          },
        },

        // 繁體中文
        zh: {
          css: {
            fontSize: '1.125rem',      // 18px
            lineHeight: '2',           // 200%
            letterSpacing: '0.05em',
            maxWidth: '65ch',

            h1: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '2.5rem',      // 40px
              marginTop: '0',
              marginBottom: '0.8em',
              lineHeight: '1.3',
              letterSpacing: '0.02em',
            },
            h2: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '2rem',        // 32px
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.4',
              letterSpacing: '0.02em',
            },
            h3: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.625rem',    // 26px
              marginTop: '1.6em',
              marginBottom: '0.8em',
              lineHeight: '1.5',
              letterSpacing: '0.02em',
            },
            h4: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.375rem',    // 22px
              marginTop: '1.5em',
              marginBottom: '0.6em',
              lineHeight: '1.5',
              letterSpacing: '0.02em',
            },

            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },

            ul: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            ol: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            li: {
              marginTop: '0.6em',
              marginBottom: '0.6em',
            },

            blockquote: {
              marginTop: '2em',
              marginBottom: '2em',
              paddingLeft: '1.5em',
            },

            code: {
              fontSize: '0.9em',
              letterSpacing: '0',
            },

            pre: {
              fontSize: '0.875rem',
              lineHeight: '1.8',
              marginTop: '2em',
              marginBottom: '2em',
            },
          },
        },

        // 日文
        ja: {
          css: {
            fontSize: '1rem',          // 16px (比中文小 10-15%)
            lineHeight: '1.85',        // 185%
            letterSpacing: '0.02em',
            maxWidth: '65ch',

            h1: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '2.25rem',     // 36px
              marginTop: '0',
              marginBottom: '0.8em',
              lineHeight: '1.3',
              letterSpacing: '0.01em',
            },
            h2: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.875rem',    // 30px
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.4',
              letterSpacing: '0.01em',
            },
            h3: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.5rem',      // 24px
              marginTop: '1.6em',
              marginBottom: '0.8em',
              lineHeight: '1.5',
              letterSpacing: '0.01em',
            },
            h4: {
              fontFamily: theme('fontFamily.serif').join(', '),
              fontSize: '1.25rem',     // 20px
              marginTop: '1.5em',
              marginBottom: '0.6em',
              lineHeight: '1.5',
              letterSpacing: '0.01em',
            },

            p: {
              marginTop: '1.4em',
              marginBottom: '1.4em',
            },

            ul: {
              marginTop: '1.4em',
              marginBottom: '1.4em',
            },
            ol: {
              marginTop: '1.4em',
              marginBottom: '1.4em',
            },
            li: {
              marginTop: '0.55em',
              marginBottom: '0.55em',
            },

            blockquote: {
              marginTop: '1.8em',
              marginBottom: '1.8em',
              paddingLeft: '1.2em',
            },

            code: {
              fontSize: '0.9em',
              letterSpacing: '0',
            },

            pre: {
              fontSize: '0.875rem',
              lineHeight: '1.7',
              marginTop: '1.8em',
              marginBottom: '1.8em',
            },
          },
        },
      }),
    },
  },
}
```

#### 第三階段:在元件中使用

**文章詳細頁面:**
```tsx
// components/pages/PostDetailPage.tsx
export function PostDetailPage({ post, locale }: Props) {
  return (
    <div className="container mx-auto p-4">
      {/* 標題使用襯線字體 */}
      <h1 className="font-serif text-4xl font-bold mb-6">
        {post.title}
      </h1>

      {/* 文章內容:正文使用非襯線,標題自動使用襯線(在 prose 配置中設定) */}
      <article
        className="prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 署名使用襯線字體 */}
      <div className="font-serif text-sm text-muted-foreground text-right mt-8">
        撰於 {post.date}
      </div>
    </div>
  )
}
```

**使用語言變體:**
```tsx
// 其他需要語言特定樣式的元件
<div className="
  text-base zh:text-lg ja:text-base
  leading-normal zh:leading-loose ja:leading-relaxed
">
  多語言文字
</div>
```

#### 第四階段:OpenType 字型特性

**在 globals.css 添加字型特性:**
```css
/* app/globals.css */

@layer base {
  /* 全域字型特性 */
  body {
    font-feature-settings: normal;
    font-kerning: auto;
  }

  /* 日文特定 */
  [lang="ja"] {
    font-feature-settings: 'palt' 1;
  }

  /* 中文特定 */
  [lang="zh"] {
    font-feature-settings: 'palt' 1;
  }

  /* 程式碼區塊不使用字型特性 */
  pre, code {
    font-feature-settings: normal;
    font-kerning: none;
  }
}
```

#### 第五階段:中英文混排處理(可選)

如果需要自動在中英文間添加空格(類似 heti 的功能),可以考慮添加簡單的 JavaScript:

```typescript
// lib/typography/spacing.ts
export function addSpacesBetweenCJKAndLatin(text: string): string {
  // 在 CJK 字元和拉丁字母之間添加空格
  return text
    .replace(/([\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff])([a-zA-Z0-9])/g, '$1 $2')
    .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff])/g, '$1 $2')
}

// 在 Markdown 處理時使用
```

**注意:**
- 這個功能是可選的,需要權衡效能和實用性
- 如果採用,建議在 build time 處理而非 runtime
- heti 的標點擠壓功能較複雜,建議先觀察是否真的需要

### 測試與驗證

**測試清單:**

1. **視覺測試**
   - [ ] 在三種語言下檢視文章頁面
   - [ ] 檢查標題、段落、列表的間距
   - [ ] 檢查中英文混排效果
   - [ ] 檢查程式碼區塊樣式
   - [ ] 測試深色/淺色模式

2. **響應式測試**
   - [ ] 手機(小於 640px)
   - [ ] 平板(640px - 1024px)
   - [ ] 桌面(大於 1024px)

3. **字型測試**
   - [ ] 確認字型正確載入
   - [ ] 檢查字型回退機制
   - [ ] 測試字型特性(palt)效果

4. **效能測試**
   - [ ] 檢查 CSS 檔案大小
   - [ ] 檢查字型載入效能
   - [ ] 確認 Tailwind purge 正常運作

### 風險評估與緩解

**風險 1:字型檔案過大**
- **風險等級**:中
- **影響**:頁面載入速度變慢
- **緩解措施**:
  - 使用 `font-display: swap` 避免阻塞渲染
  - 只載入需要的字重(400, 700)
  - 考慮使用 subset 減少檔案大小
  - 使用 CDN 加速字型載入

**風險 2:樣式配置複雜度**
- **風險等級**:中
- **影響**:維護困難,團隊學習曲線
- **緩解措施**:
  - 撰寫詳細的文件說明
  - 提供範例元件
  - 定義清楚的設計 token
  - 使用 TypeScript 增加類型安全

**風險 3:跨瀏覽器相容性**
- **風險等級**:低
- **影響**:部分功能在舊瀏覽器無法運作
- **緩解措施**:
  - 測試主流瀏覽器(Chrome, Firefox, Safari, Edge)
  - 提供 graceful degradation
  - 使用 autoprefixer 自動添加前綴

## 下一步行動計畫

實施需要分階段進行,確保每個階段都經過充分測試後再進入下一階段。

### 立即行動(第 1-2 週)

**1. 技術準備**
- 安裝 `@tailwindcss/typography` 和 `tailwindcss-localized` 插件
- 設定 Noto Sans 字型家族(Noto Sans, Noto Sans TC, Noto Sans JP, Noto Sans Mono)
- 配置基本的 Tailwind config

**2. 建立基礎 prose 樣式**
- 在 `tailwind.config.ts` 中定義 DEFAULT prose 樣式
- 定義 `zh` 和 `ja` prose 變體
- 在文章頁面應用並測試

**3. 測試與調整**
- 在三種語言下測試文章顯示
- 收集視覺反饋
- 微調行距、字距參數

### 中期目標(第 3-4 週)

**4. 完善排版細節**
- 添加 OpenType 字型特性(`palt`)
- 調整標題層級樣式
- 優化列表、引用、程式碼區塊樣式

**5. 響應式優化**
- 針對不同螢幕尺寸調整排版
- 測試手機、平板、桌面的閱讀體驗
- 優化行長(line length)

**6. 深色模式優化**
- 測試 `dark:prose-invert` 效果
- 調整深色模式下的對比度
- 確保所有元素在深色模式下可讀

### 長期規劃(第 5-8 週)

**7. 進階功能(可選)**
- 評估是否需要中英文自動空格
- 考慮是否實作標點擠壓
- 研究垂直韻律(vertical rhythm)系統

**8. 文件與規範**
- 撰寫排版設計規範文件
- 建立元件使用指南
- 記錄設計決策和理由

**9. 效能優化**
- 檢查字型載入策略
- 優化 CSS 檔案大小
- 實施字型 subset(如需要)

### PRD 需求

考慮到這是一個複雜的設計系統專案,建議撰寫以下 PRD:

**1. 多語言排版設計系統 PRD**
- 定義完整的排版 token 系統
- 規範三種語言的排版參數
- 建立元件使用指南
- 定義測試標準

**2. 字型載入與優化 PRD**(可選)
- 字型載入策略
- 效能優化方案
- Subset 實施計畫

是否需要撰寫 PRD 由開發者根據實際情況決定。如果團隊規模小、需求明確,也可以直接根據本研究報告進行實作。

## 參考資料

### 中文排版專案
- [Han.css - 漢字標準格式](https://github.com/ethantw/Han) - 專業的漢字排版框架
- [heti - 赫蹏](https://github.com/sivan/heti) - 中文排版增強庫
- [typo.css](https://github.com/sofish/typo.css) - 中文網頁排版解決方案

### 日文排版資源
- [Seven rules for perfect Japanese typography](https://www.aqworks.com/blog/perfect-japanese-typography) - 日文排版的七個規則
- [日本數位廳設計系統 - 排版](https://design.digital.go.jp/foundations/typography/) - 官方排版指南
- [W3C - Requirements of Japanese Text Layout](https://www.w3.org/2007/02/japanese-layout/docs/aligned/japanese-layout-requirements-en.html) - W3C 日文排版需求

### 英文排版最佳實踐
- [Best UX practices for line spacing](https://www.justinmind.com/blog/best-ux-practices-for-line-spacing/) - 行距最佳實踐
- [Typography Best Practices: The Ultimate 2025 Guide](https://www.adoc-studio.app/blog/typography-guide) - 2025 排版指南
- [Butterick's Practical Typography](https://practicaltypography.com/) - 實用排版指南

### Tailwind CSS 與插件
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - 官方排版插件
- [tailwindcss-localized](https://github.com/hdodov/tailwindcss-localized) - 多語言樣式插件
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Tailwind CSS 官方文件

### shadcn/ui
- [shadcn/ui Documentation](https://ui.shadcn.com/) - shadcn/ui 官方文件
- [shadcn-prose](https://github.com/haydenbleasel/shadcn-prose) - shadcn/ui 排版樣式庫

### 字型資源
- [Google Fonts - Noto](https://fonts.google.com/noto) - Noto 字型家族
- [Noto CJK Fonts](https://github.com/notofonts/noto-cjk) - Noto CJK 字型專案
- [East Meets West: How to Pair Chinese Fonts with Latin Fonts](https://blog.justfont.com/2025/03/how-to-pair-chinese-and-latin-fonts-en/) - 中西文字型搭配

### 字型技術
- [CSS font-feature-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings) - MDN 文件
- [OpenType Features in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/OpenType_fonts_guide) - OpenType 特性指南
- [Introducing four new international features in CSS](https://developer.chrome.com/blog/css-i18n-features) - CSS 國際化新特性

### 閱讀體驗研究
- [Serif vs Sans Serif: A Deep Dive into Readability Research](https://thelinuxcode.com/serif-vs-sans-serif-fonts-a-deep-dive-into-readability-research/) - 字型可讀性研究
- [The ideal line length & line height in web design](https://pimpmytype.com/line-length-line-height/) - 行長與行距研究
- [CJK Font Pairing](https://www.daltonmaag.com/services/cjk-font-pairing.html) - CJK 字型搭配指南
