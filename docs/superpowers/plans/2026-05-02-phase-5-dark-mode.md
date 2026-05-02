# Phase 5 — 暗色模式 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 加上完整可用的暗色模式：CSS variables + `<html data-theme>` + localStorage 持久化 + Header toggle + FOUC 防護 + Shiki dual theme。

**Architecture:** 在 `src/styles/global.css` 定義 CSS variables（light + dark）；Inline `<script is:inline>` 在 `<head>` 最前讀 localStorage / OS 偏好設 `data-theme`；新 `ThemeToggle.astro` 元件嵌入 Header；既有 8 個檔案 hardcoded 顏色替換為 `var(--color-*)`；`shikiConfig.themes` 設 dual theme + 手動加 `[data-theme='dark']` CSS override。

**Tech Stack:** Astro 6.x、原生 CSS variables、原生 localStorage、Shiki（內建）。

**Spec：** `docs/superpowers/specs/2026-05-02-phase-5-dark-mode-design.md`

**所有路徑相對於 `astro/` 子目錄。** 工作目錄請固定在 `astro/`。**請先建分支：`git checkout -b phase-5-dark-mode`。**

---

## 檔案結構

**Create:**
- `src/components/ThemeToggle.astro`

**Modify:**
- `src/lib/i18n.ts` — `UiText` 加 `theme.toggle`
- `src/lib/__tests__/i18n.test.ts` — 加 theme.toggle 測試
- `src/styles/global.css` — CSS variables、既有 hardcoded 顏色換 var、Shiki dual-theme override CSS
- `src/layouts/BaseLayout.astro` — head 第一個 inline script (FOUC 防護)
- `src/components/Header.astro` — 嵌入 `<ThemeToggle />`、border 換 var
- `src/components/Footer.astro` — 顏色換 var
- `src/components/PostList.astro` — 顏色換 var
- `src/components/PostMeta.astro` — 顏色換 var
- `src/components/LanguageSwitcher.astro` — 顏色換 var
- `src/components/LanguageNotice.astro` — 顏色換 var
- `src/components/ArticleLanguageIndicator.astro` — 顏色換 var
- `src/layouts/PostLayout.astro` — border 換 var
- `astro/astro.config.ts` — `markdown.shikiConfig.themes`
- `docs/research/2026-04-29-astro-migration-roadmap.md` — Phase 5 標記完成

---

## Task 1：建分支 + i18n.ts 加 `theme.toggle` 文字

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/lib/__tests__/i18n.test.ts`

- [ ] **Step 1: 建分支（在 repo root）**

```bash
git checkout -b phase-5-dark-mode
```

- [ ] **Step 2: 加失敗測試（append to `src/lib/__tests__/i18n.test.ts`）**

```ts
describe('UI_TEXT theme labels', () => {
  it('per-locale theme.toggle string', () => {
    expect(t('zh').theme.toggle).toBe('切換主題');
    expect(t('ja').theme.toggle).toBe('テーマ切替');
    expect(t('en').theme.toggle).toBe('Toggle theme');
  });
});
```

- [ ] **Step 3: 跑測試確認失敗**

`cd astro && npx vitest run src/lib/__tests__/i18n.test.ts` — Expected: FAIL `theme is undefined` 或 `Cannot read property 'toggle'`.

- [ ] **Step 4: 修改 `src/lib/i18n.ts`**

Edit `UiText` interface — append `theme` field at end of existing fields:

```ts
export interface UiText {
  nav: { /* ... */ };
  post: { /* ... */ };
  languageNotice: { /* ... */ };
  switchLanguage: string;
  site: { description: string };
  rss: { /* ... */ };
  theme: {
    toggle: string;
  };
}
```

In each locale's `UI_TEXT` entry, append `theme` field:

zh:
```ts
  theme: { toggle: '切換主題' },
```

ja:
```ts
  theme: { toggle: 'テーマ切替' },
```

en:
```ts
  theme: { toggle: 'Toggle theme' },
```

- [ ] **Step 5: 跑測試確認通過**

`npx vitest run` — Expected: 70 + 1 = 71 PASS。

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n.ts src/lib/__tests__/i18n.test.ts
git commit -m "feat(astro): add theme.toggle UI text"
```

---

## Task 2：`global.css` 加 CSS variables 並替換內部顏色

**Files:**
- Modify: `src/styles/global.css`

替換 `global.css` 整檔。在頂部加 `:root` 與 `:root[data-theme="dark"]` 的 CSS variables，body / blockquote / code / pre / a / hr / table 等顏色全部用 var() 引用。

- [ ] **Step 1: 替換 `src/styles/global.css` 整檔內容**

```css
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
  --color-link: #0366d6;
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
  --color-link: #58a6ff;
}

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  line-height: 2;
  letter-spacing: 0.05em;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif), 'Times New Roman', serif;
  line-height: 1.4;
  letter-spacing: 0;
  font-weight: 700;
}

a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 4px; }

img, picture, svg { display: block; max-width: 100%; height: auto; }

.container {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Markdown prose */
.prose h1 { font-size: 2rem; margin: 2rem 0 1rem; }
.prose h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
.prose h3 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
.prose p { margin: 1rem 0; }
.prose ul, .prose ol { margin: 1rem 0; padding-left: 1.5rem; }
.prose li { margin: 0.25rem 0; }
.prose blockquote {
  border-left: 4px solid var(--color-border-strong);
  padding-left: 1rem;
  color: var(--color-text-muted);
  margin: 1rem 0;
}
.prose code {
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  font-size: 0.9em;
  background: var(--color-code-bg);
  padding: 0.1em 0.3em;
  border-radius: 3px;
}
.prose pre {
  font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1rem 0;
  line-height: 1.6;
  letter-spacing: 0;
}
.prose pre code {
  background: transparent;
  padding: 0;
  font-size: 0.875rem;
}
.prose a { color: var(--color-link); text-decoration: underline; text-underline-offset: 3px; }
.prose hr { border: 0; border-top: 1px solid var(--color-border); margin: 2rem 0; }
.prose table { border-collapse: collapse; margin: 1rem 0; width: 100%; }
.prose th, .prose td { border: 1px solid var(--color-border); padding: 0.5rem 0.75rem; }
.prose th { background: var(--color-code-bg); font-weight: 600; }

/* Shiki dual-theme override: switch token colors when data-theme=dark */
:root[data-theme='dark'] pre.astro-code,
:root[data-theme='dark'] pre.astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

- [ ] **Step 2: 試 build**

`cd astro && npx astro build 2>&1 | tail -5` — Expected: build succeeds（Shiki theme 還沒設，這份 dual-theme override CSS 會引用尚不存在的 `--shiki-dark` 變數，但這只是 css 內 var() fallback 為 invalid，不會 build error）。

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(astro): add CSS variables for light/dark theming in global.css"
```

---

## Task 3：8 個元件 hardcoded 顏色替換

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/PostList.astro`
- Modify: `src/components/PostMeta.astro`
- Modify: `src/components/LanguageSwitcher.astro`
- Modify: `src/components/LanguageNotice.astro`
- Modify: `src/components/ArticleLanguageIndicator.astro`
- Modify: `src/layouts/PostLayout.astro`

對照表（spec 已列）：
- 主文 / heading text → `var(--color-text)`
- muted（meta info、subtitle）→ `var(--color-text-muted)`
- subtle（date、small text）→ `var(--color-text-subtle)`
- 背景：page → `var(--color-bg)`、dropdown/notice card → `var(--color-bg-elevated)`
- Border 一般 → `var(--color-border)`
- Border 強 → `var(--color-border-strong)`
- Code 背景 → `var(--color-code-bg)`
- Hover bg → `var(--color-hover-bg)`

實際對照表：

| 檔案 | 原值 | 換為 |
|---|---|---|
| Header.astro | `#e5e5e5` border | `var(--color-border)` |
| Footer.astro | `#e5e5e5` border | `var(--color-border)` |
| Footer.astro | `#666` text | `var(--color-text-muted)` |
| PostList.astro | `#444` (h2) | `var(--color-text-muted)` |
| PostList.astro | `#888` (date) | `var(--color-text-subtle)` |
| PostMeta.astro | `#666` | `var(--color-text-muted)` |
| LanguageSwitcher.astro | `#f3f3f3` (hover) | `var(--color-hover-bg)` |
| LanguageSwitcher.astro | `#fff` (dropdown bg) | `var(--color-bg-elevated)` |
| LanguageSwitcher.astro | `#e5e5e5` (border) | `var(--color-border)` |
| LanguageNotice.astro | `#e5e5e5` (border) | `var(--color-border)` |
| LanguageNotice.astro | `#fafafa` (bg) | `var(--color-bg-elevated)` |
| LanguageNotice.astro | `#555` (text) | `var(--color-text-muted)` |
| ArticleLanguageIndicator.astro | `#666` | `var(--color-text-muted)` |
| PostLayout.astro | `#eee` (border) | `var(--color-border)` |

對於 LanguageSwitcher 與 LanguageNotice 在 dark 模式下的對比：他們的「elevated」背景（淺 `#fff` / `#fafafa` 換成 `--color-bg-elevated` 即 dark 的 `#242424`）與 border `#333333` 對比約 1.4:1，邊界仍可見但偏低。改善：dark 模式下用較強的 border。**本 task 暫不做這個微調**，先讓功能跑起來；驗收若視覺判斷邊界看不到再回頭強化。

- [ ] **Step 1: 替換 `src/components/Header.astro`**

讀取現有 Header.astro。`<style>` 區塊 `.site-header { border-bottom: 1px solid #e5e5e5; }` → `.site-header { border-bottom: 1px solid var(--color-border); }`。

- [ ] **Step 2: 替換 `src/components/Footer.astro`**

讀取現有檔案。把 `border-top: 1px solid #e5e5e5;` → `var(--color-border)`、`color: #666;` → `var(--color-text-muted)`。

- [ ] **Step 3: 替換 `src/components/PostList.astro`**

把 `.year h2 { color: #444; }` → `color: var(--color-text-muted);`、`.date { color: #888; }` → `color: var(--color-text-subtle);`。

- [ ] **Step 4: 替換 `src/components/PostMeta.astro`**

把 `color: #666;` → `var(--color-text-muted)`。

- [ ] **Step 5: 替換 `src/components/LanguageSwitcher.astro`**

替換三處：
- `summary:hover { background: #f3f3f3; }` → `var(--color-hover-bg)`
- `ul { background: #fff; border: 1px solid #e5e5e5; ... }` → bg `var(--color-bg-elevated)`、border `var(--color-border)`
- `li a:hover { background: #f3f3f3; }` → `var(--color-hover-bg)`

- [ ] **Step 6: 替換 `src/components/LanguageNotice.astro`**

替換三處：
- `border: 1px solid #e5e5e5;` → `var(--color-border)`
- `background: #fafafa;` → `var(--color-bg-elevated)`
- `color: #555;` → `var(--color-text-muted)`

- [ ] **Step 7: 替換 `src/components/ArticleLanguageIndicator.astro`**

把 `color: #666;` → `var(--color-text-muted)`。

- [ ] **Step 8: 替換 `src/layouts/PostLayout.astro`**

把 `.post-head { ... border-bottom: 1px solid #eee; }` → `var(--color-border)`。

- [ ] **Step 9: 試 build**

`cd astro && npx astro build 2>&1 | tail -5` — Expected: 成功。Light 模式下視覺應與 Phase 4 完全一致。

- [ ] **Step 10: Inventory check**

```bash
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components src/layouts | grep -vE 'var\(--|stroke=|fill=|<path|fill:#' | head
```

Expected: 結果應為空（或僅留 SVG icon 內部 stroke/fill 等非主題色）。

- [ ] **Step 11: Commit**

```bash
git add src/components src/layouts
git commit -m "feat(astro): replace hardcoded component colors with CSS variables"
```

---

## Task 4：BaseLayout FOUC 防護 inline script

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

`BaseLayout.astro` 在 `<head>` 最頂端、`<meta charset>` 之後、所有其他元素之前插入 inline script。

- [ ] **Step 1: 修改 `src/layouts/BaseLayout.astro`**

讀取現有 BaseLayout.astro。在 `<head>` 內、`<meta charset="utf-8" />` 之後、`<meta name="viewport"` 之前插入：

```astro
    <script is:inline>
      (function () {
        var stored = localStorage.getItem('theme');
        var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
```

- [ ] **Step 2: 試 build & 抽樣驗證**

```bash
cd astro && npx astro build 2>&1 | tail -3
grep -A2 'data-theme' dist/zh/index.html | head -5
```

Expected: dist HTML 內 `<head>` 早期出現 `<script>...localStorage.getItem('theme')...</script>`。

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(astro): add FOUC-blocking theme inline script in BaseLayout"
```

---

## Task 5：`ThemeToggle.astro` + 接到 Header

**Files:**
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/components/Header.astro`

- [ ] **Step 1: 建立 `src/components/ThemeToggle.astro`**

```astro
---
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
  #theme-toggle:hover {
    background: var(--color-hover-bg);
    color: var(--color-text);
  }
  .icon-sun, .icon-moon { display: none; }
  :root[data-theme="dark"] #theme-toggle .icon-sun { display: block; }
  :root:not([data-theme="dark"]) #theme-toggle .icon-moon { display: block; }
</style>
```

- [ ] **Step 2: 修改 `src/components/Header.astro`** 嵌入 ThemeToggle

讀取現有 Header.astro 後，把 `import LanguageSwitcher from './LanguageSwitcher.astro';` 下加：

```astro
import ThemeToggle from './ThemeToggle.astro';
```

在 `<LanguageSwitcher ... />` 後緊鄰加：

```astro
<ThemeToggle locale={locale} />
```

- [ ] **Step 3: Build & 抽樣驗證**

```bash
cd astro && npx astro build 2>&1 | tail -3
grep -c 'theme-toggle' dist/zh/index.html dist/zh/posts/2024-02-02_semaphore/index.html
```

Expected: 兩檔都 ≥ 1（按鈕渲染出現）。

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeToggle.astro src/components/Header.astro
git commit -m "feat(astro): add ThemeToggle button in Header"
```

---

## Task 6：Shiki dual theme

**Files:**
- Modify: `astro/astro.config.ts`

- [ ] **Step 1: 修改 `astro/astro.config.ts`**

讀取現有 config。在 `markdown:` 區塊內既有 config（remarkPlugins 等）旁加入 `shikiConfig`。如果已有 `shikiConfig`，替換其中；如果沒有，新增整個 key：

```ts
markdown: {
  // ... 既有 remarkPlugins 與其它設定保留不動
  shikiConfig: {
    themes: {
      light: 'github-light',
      dark: 'github-dark-dimmed',
    },
  },
},
```

- [ ] **Step 2: Build 驗證**

```bash
cd astro && npx astro build 2>&1 | tail -10
```

Expected: 成功。Cold cache 可能慢一點（Shiki 重新處理所有 code block）。

- [ ] **Step 3: 抽樣驗證 Shiki 輸出**

```bash
node -e "const fs=require('fs');const html=fs.readFileSync('dist/zh/posts/2024-02-02_semaphore/index.html','utf8');const m=html.match(/<pre class=\"astro-code/);console.log('astro-code class found:', !!m);const v=html.match(/--shiki-dark/);console.log('--shiki-dark variable found:', !!v);"
```

Expected:
- `astro-code class found: true`
- `--shiki-dark variable found: true`

如果 `--shiki-dark variable found: false`，表示 `shikiConfig.themes` 設定沒生效或語法錯誤；回 Step 1 確認。

- [ ] **Step 4: Commit**

```bash
git add astro/astro.config.ts
git commit -m "feat(astro): configure Shiki dual theme for light/dark code blocks"
```

---

## Task 7：完整驗收 + roadmap 更新

**Files:**
- Modify: `docs/research/2026-04-29-astro-migration-roadmap.md`

- [ ] **Step 1: Clean build + 計時**

```bash
cd astro && rm -rf dist && time npx astro build 2>&1 | tail -10
```

Expected: 成功。Phase 4 baseline 35.22s warm；clean build 較慢但 < 2 分鐘可接受。

- [ ] **Step 2: 跑全部測試**

`npx vitest run` — Expected: 71 PASS。

- [ ] **Step 3: hardcoded 顏色 grep（驗收項目 1）**

```bash
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components src/layouts src/styles | grep -vE 'var\(--|stroke=|fill=|<path|stroke:|fill:'
```

Expected: 結果僅剩 SVG icon stroke/fill 等非主題色（譬如 svg path 內若有 fill）。沒有遺漏未替換的顏色。

- [ ] **Step 4: 預覽肉眼驗收**

啟動 preview：

```bash
# 用 mcp__Claude_Preview__preview_start name=astro-preview
```

抽樣以下情境（用 preview_eval 在 console 操作）：

a. **預設無 localStorage、OS = light**：navigate `/zh/`，看 `<html data-theme>` 應為 `"light"`，body bg 為淺色。

b. **OS = dark**：在 console 執行 `window.matchMedia('(prefers-color-scheme: dark)').matches`（如果為 true），reload，`data-theme` 應為 `"dark"`，body bg 為 `#1a1a1a`。

c. **點 toggle 切換**：`document.getElementById('theme-toggle').click()`，`data-theme` 翻轉、localStorage `'theme'` 寫入。

d. **Reload 不閃**：reload 頁面、肉眼觀察是否有 light flash 再切 dark（FOUC 檢查）。手動：執行 `localStorage.setItem('theme', 'dark')` 後 reload，期間應只看到 dark。

e. **Code block dual theme**：navigate `/zh/posts/2024-02-02_semaphore`、light 模式看 syntax 用 `github-light` 顏色、切到 dark 看 syntax 變 `github-dark-dimmed`。

f. **跨頁面 theme 維持**：dark 模式下從 home 點到 post，page 不閃白。

g. **localStorage 'light' + OS dark：** `localStorage.setItem('theme', 'light')` 後 reload，雖 OS 偏好 dark，page 應為 light（明示優先）。

h. **clear localStorage、reload**：`localStorage.removeItem('theme')` 後 reload，跟著 OS 偏好。

每一項通過後打勾。

- [ ] **Step 5: Phase 2/3/4 不被破壞**

```bash
ls dist/sitemap*.xml
ls dist/rss.xml dist/rss/{zh,ja,en}.xml dist/rss/{tech,life}.xml dist/rss/{zh,ja,en}/{tech,life}.xml 2>&1 | wc -l
grep -c 'rel="alternate" hreflang' dist/zh/posts/2024-02-02_semaphore/index.html
grep -c 'application/ld+json' dist/zh/posts/2024-02-02_semaphore/index.html
```

Expected:
- sitemap 兩檔存在
- 12 個 RSS 檔
- hreflang count > 0（可能 4 行或 minified 1 行 — 用 `grep -oE` 細看）
- JSON-LD count = 1

- [ ] **Step 6: 更新 roadmap**

讀取 `docs/research/2026-04-29-astro-migration-roadmap.md`。

第 3 行狀態改為：
```
**狀態：** Phase 0（POC）、Phase 1a、Phase 1b、Phase 2、Phase 3、Phase 4、Phase 5 已完成並 merge 進 main。後續 phase 待執行。
```

Phase 5 章節標題改為：
```
### Phase 5 — 暗色模式 ✅ 已完成（YYYY-MM-DD）
```
（用實際日期）

在「目標」段落上方插入完成備忘段落（填上實際 commit 起點 / 終點 SHA）：

```markdown
**完成 commits：** [SHA 起點] ~ [SHA 終點]（commits 數量）。spec：`docs/superpowers/specs/2026-05-02-phase-5-dark-mode-design.md`，plan：`docs/superpowers/plans/2026-05-02-phase-5-dark-mode.md`。

**範圍縮減：** spec 階段確認本 phase 僅做暗色模式功能，prose 樣式精修（OpenType `palt`、列表/引用排版等）留待之後重做設計時處理。

**完成備忘：**
- 主題狀態模型 C：`<html data-theme>` 為 source of truth，inline `<script is:inline>` 在 head 第一個位置讀 localStorage `'theme'` 或 OS 偏好設值（防 FOUC）。
- CSS variables 在 `:root` 定義 light、`:root[data-theme="dark"]` override dark。10 個顏色 token（bg / bg-elevated / text / text-muted / text-subtle / border / border-strong / code-bg / hover-bg / link）。
- 8 個 .astro 元件 hardcoded 顏色全替換為 `var(--color-*)`。Light 模式下視覺與 Phase 4 相同。
- `ThemeToggle.astro` 用 `<details>`-style 純 vanilla JS（無框架），CSS-only sun/moon 圖示切換。Header 右側 LanguageSwitcher 旁。
- `shikiConfig.themes: { light: 'github-light', dark: 'github-dark-dimmed' }` + global.css `[data-theme='dark'] pre.astro-code` override，code block 兩模式下都 token 顏色正確。
- i18n `theme.toggle` 文字三 locale，1 個新測試。總計 71 vitest 測試全綠。
- 範圍外：「跟隨 OS 變更時即時切換 (when localStorage 已設)」、prose 細節精修、theme 過場動畫——皆明示不做。
- Build 時間：[實際 warm cache 數字] s（Phase 4 baseline 35.22s）。
```

- [ ] **Step 7: Commit**

```bash
git add docs/research/2026-04-29-astro-migration-roadmap.md
git commit -m "docs: mark Phase 5 complete in migration roadmap"
```

---

## 自我檢查（plan author）

**Spec 涵蓋檢查：**

| Spec 項目 | 對應 task |
|---|---|
| CSS variables in `:root` / `[data-theme="dark"]` | Task 2 |
| FOUC 防護 inline script | Task 4 |
| ThemeToggle 按鈕 + 切換邏輯 + localStorage | Task 5 |
| Header 嵌入 ThemeToggle | Task 5 step 2 |
| Shiki dual theme config | Task 6 |
| Shiki [data-theme] CSS override | Task 2（global.css 末尾的 override CSS） |
| 8 個元件 hardcoded 顏色替換 | Task 3 |
| i18n `theme.toggle` 文字 | Task 1 |
| Phase 2/3/4 不被破壞 | Task 7 step 5（驗收） |
| Build 時間 | Task 7 step 1 |

**Placeholder 掃描：** 無 TBD/TODO；每一步有可執行指令；commit message 寫死；只有 Task 7 step 6 的 SHA / 日期需要實作時填入（此為 metadata 性質，符合計畫寫作慣例）。

**型別/簽章一致性：**
- `theme: { toggle: string }` 在 Task 1 加入 UiText、Task 5 ThemeToggle 用 `t(locale).theme.toggle` ✓
- CSS variable 命名一致（`--color-bg`、`--color-text` 等）跨 Task 2/3 ✓
- `data-theme` 屬性值 `"light"` / `"dark"` 一致跨 Task 2 / 4 / 5 ✓
- `localStorage.getItem/setItem('theme', ...)` key `'theme'` 一致跨 Task 4 / 5 ✓
