# Phase 5 — 暗色模式

**狀態：** Spec
**前置 Phase：** Phase 0、1a、1b、2、3、4（已 merge）
**對應 roadmap：** `docs/research/2026-04-29-astro-migration-roadmap.md` Phase 5

## 目標

加上完整可用的暗色模式：CSS variables 主題、`<html data-theme>` 切換、localStorage 持久化、Header toggle 按鈕、FOUC 防護、Shiki dual theme code block。

範圍縮減：原 roadmap Phase 5 同時涵蓋 prose 細節精修（OpenType `palt`、列表/引用排版等）。本 phase **僅做暗色模式功能完成**，prose 樣式精修留待之後全面重做設計。

## 非目標（明確排除）

- prose 樣式精修（OpenType features、列表 / 引用 / 表格 / heading 間距）
- 「跟隨 OS 變更時即時切換」when localStorage 已設明示偏好
- Theme 切換動畫過場
- 自訂 dark theme 配色面板
- 對 code block 內 image 的 dark mode 處理

## 架構

CSS variables 定義 light 主題顏色於 `:root`、dark 顏色於 `:root[data-theme="dark"]`；inline `<script is:inline>` 在 `<head>` 最前面讀 localStorage 或 OS 偏好決定 `data-theme`（防 FOUC）；`ThemeToggle.astro` 提供按鈕（vanilla JS）切 `data-theme` 並寫 localStorage；Astro `markdown.shikiConfig.themes` 設 dual theme 套用到所有 code block；既有 9 個檔案的 hardcoded 顏色替換為 CSS variables。

### Theme 狀態模型（C：system 預設 + 明示覆寫）

- localStorage 無 `'theme'` 條目 → 跟隨 OS 偏好（`prefers-color-scheme`）
- `'theme': 'light'` → 強制 light
- `'theme': 'dark'` → 強制 dark
- 明示偏好設定後不再跟隨 OS（簡化 UX；要回 system 必須清 localStorage，本 phase 不提供 UI）

### 為什麼用 `data-theme` 屬性而非 `prefers-color-scheme` media query

`data-theme` 是 single source of truth。Inline script 統一處理 OS 偏好讀取與 localStorage override，CSS 只看 `data-theme`，無 race condition。Media query + JS override 路線需要在切換時同時操作多個來源，邊界 case 多。

## 元件邊界

| 單元 | 職責 | 介面 | 依賴 |
|---|---|---|---|
| `src/styles/global.css`（修改） | 主題 CSS variables（light + dark）、prose 顏色、layout 顏色 | — | — |
| `src/components/ThemeToggle.astro`（新） | 按鈕 + inline JS + CSS-only sun/moon 圖示切換 | Props: `locale: Locale` | `i18n.ts` |
| `src/components/Header.astro`（修改） | 嵌入 `<ThemeToggle locale={locale} />` | 無新 props | `ThemeToggle` |
| `src/layouts/BaseLayout.astro`（修改） | head 最前的 FOUC 防護 inline script | — | — |
| `src/lib/i18n.ts`（修改） | 加 `theme.{toggleToDark, toggleToLight}` 文字 | 沿用 `t()` | 無 |
| `src/lib/__tests__/i18n.test.ts`（修改） | 新欄位測試 | — | — |
| `astro/astro.config.ts`（修改） | `markdown.shikiConfig.themes` dual | — | — |
| 8 個 .astro 檔案 | hardcoded 顏色替換為 `var(--color-*)` | — | — |

## CSS variables

```css
/* src/styles/global.css */
:root {
  --color-bg: #fafafa;
  --color-bg-elevated: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #555555;
  --color-text-subtle: #888888;
  --color-border: #e5e5e5;
  --color-border-strong: #cccccc;
  --color-code-bg: #f0f0f0;
  --color-hover-bg: #f3f3f3;
}

:root[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-bg-elevated: #242424;
  --color-text: #e8e8e8;
  --color-text-muted: #a8a8a8;
  --color-text-subtle: #888888;
  --color-border: #333333;
  --color-border-strong: #555555;
  --color-code-bg: #2a2a2a;
  --color-hover-bg: #2a2a2a;
}
```

對比度設計目標：
- light: text/bg ≥ 12:1（#1a1a1a on #fafafa ≈ 16:1）
- dark: text/bg ≥ 12:1（#e8e8e8 on #1a1a1a ≈ 14:1）

## FOUC 防護

`BaseLayout.astro` head 最頂端（在 charset 之後、所有 CSS link 之前）插入：

```astro
<script is:inline>
  (function () {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

`is:inline` 確保 Astro 不打包這段、保留位置在 head 最前。在 paint 之前同步跑、`data-theme` 已就位、CSS 載入後變數立刻生效，無 FOUC。

## ThemeToggle 元件

```astro
---
// src/components/ThemeToggle.astro
import { type Locale, t } from '../lib/i18n';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const text = t(locale).theme;
---
<button id="theme-toggle" type="button" aria-label={text.toggle}>
  <svg class="icon-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
  <svg class="icon-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>

<script is:inline>
  (function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  })();
</script>

<style>
  #theme-toggle {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    color: var(--color-text-muted);
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
  }
  #theme-toggle:hover { background: var(--color-hover-bg); color: var(--color-text); }
  .icon-sun, .icon-moon { display: none; }
  :root[data-theme="dark"] #theme-toggle .icon-sun { display: block; }
  :root:not([data-theme="dark"]) #theme-toggle .icon-moon { display: block; }
</style>
```

CSS-only 圖示切換、不需 JS。aria-label 用 `t(locale).theme.toggle`（簡化為單一字串「切換主題 / Toggle theme / 主題切替」），無條件式文字（避免要在 toggle 時動態改 aria-label）。

## i18n 文字擴充

```ts
interface UiText {
  // ... 既有
  theme: {
    toggle: string;  // "切換主題" / "テーマ切替" / "Toggle theme"
  };
}
```

## Shiki dual theme

`astro/astro.config.ts` 修改 `markdown.shikiConfig`：

```ts
markdown: {
  // ... 既有 remarkPlugins
  shikiConfig: {
    themes: {
      light: 'github-light',
      dark: 'github-dark-dimmed',
    },
  },
},
```

Astro Shiki 接收 `themes` map 後會：
- 每個 token emit `style="--shiki-light:#xxx;--shiki-dark:#yyy"`
- emit CSS：`html[data-theme='dark'] code[class*='language-'] span { color: var(--shiki-dark) !important; }`

Astro Shiki 預設用 `[data-theme]` selector 切換、與我們的 `data-theme` 慣例對齊。

## hardcoded 顏色替換清單

由 `grep -rn "#[0-9a-fA-F]\{3,6\}" src/` 結果決定。涵蓋（依 Phase 4 後狀態）：

1. `src/styles/global.css` — body / blockquote / code / pre 顏色
2. `src/components/Header.astro` — `#e5e5e5` border
3. `src/components/PostList.astro` — `#444 / #888 / #f3f3f3` 等
4. `src/components/LanguageSwitcher.astro` — `#f3f3f3 / #fff / #e5e5e5`
5. `src/components/LanguageNotice.astro` — `#fafafa / #555 / #e5e5e5`
6. `src/components/ArticleLanguageIndicator.astro` — `#666`
7. `src/components/PostMeta.astro` — 顏色
8. `src/components/Footer.astro` — 顏色
9. `src/layouts/PostLayout.astro` — `#eee` border

替換規則：
- 主文 / heading text → `var(--color-text)`
- 次要 text（meta info、date、muted）→ `var(--color-text-muted)` 或 `--color-text-subtle`
- 背景 → `var(--color-bg)`（page-level）或 `var(--color-bg-elevated)`（dropdown / notice card）
- Border → `var(--color-border)` 或 `--color-border-strong`
- Code background → `var(--color-code-bg)`
- Hover background → `var(--color-hover-bg)`

實作時逐一肉眼判斷各色該對應哪個語意，不機械替換。

## 測試

vitest 新增：
- `i18n.test.ts` 加 1 個測試：`t('zh').theme.toggle === '切換主題'` 等三 locale

整合驗證（手動 / preview）：
1. 預設無 localStorage、OS = light：`<html data-theme="light">`，page 顏色為 light
2. OS = dark：`<html data-theme="dark">`，page 顏色為 dark
3. 點 toggle 後切換、localStorage 寫入；reload 不閃白（FOUC 檢查）
4. localStorage = 'light'、OS = dark：仍維持 light（明示優先）
5. clear localStorage、reload：恢復跟隨 OS
6. Code block 在 dark 模式下使用 `github-dark-dimmed` token 顏色
7. 抽樣 Header、PostList、LanguageNotice、PostLayout 在兩模式下對比通過
8. 跨頁面切換（home → post → tech）`data-theme` 維持

## 驗收

1. **CSS variables 已替換：** `grep -rn "#[0-9a-fA-F]\{3,6\}" src/components src/layouts src/styles | grep -v "var(--"` 結果集合僅留下圖示 stroke 等非主題色（譬如 SVG icon）
2. **Toggle 按鈕：** 在 Header 右側、LanguageSwitcher 旁邊
3. **FOUC 不發生：** 預先設 localStorage `'dark'` 後 reload，肉眼看不到 light flash（preview 抽樣）
4. **localStorage 持久：** 切換後 reload 維持選擇、跨頁面維持
5. **Code block dual theme：** 同一篇文章在兩模式下 token 顏色明顯不同（dark 用 `github-dark-dimmed`）
6. **Phase 2/3/4 功能未壞：** 重新跑全部 vitest（71/71 含新測試）；抽樣 sitemap / RSS / hreflang / OG meta 與 Phase 4 完成時一致
7. **Build 時間：** warm cache build 相對 Phase 4 (35.22s) 增加 < +5s

## 風險

| 風險 | 機率 | 影響 | 緩解 |
|---|---|---|---|
| Shiki dual theme cold build 顯著變慢 | 中 | 中 | 接受首次 cold build；後續 warm cache 不影響 |
| 漏改顏色造成單一元素在 dark 模式不對 | 中 | 低 | 驗收抽樣肉眼掃；驗收項目 1 grep |
| `is:inline` script 順序錯造成 FOUC | 低 | 中 | preview 親自測 reload；驗收項目 3 |
| dark theme 顏色對比不足 | 低 | 低 | 採業界常用配色（#1a1a1a bg、#e8e8e8 text 對比 14:1+），不自創 |
| Astro Shiki dual theme 的 selector 與 `data-theme` 慣例不一致 | 低 | 中 | spec 寫前已確認 Astro 預設 selector 用 `[data-theme]`；plan 驗證 |

## 完成定義

- 所有驗收項目通過
- spec 與 plan commit
- branch 可獨立 merge 進 main
