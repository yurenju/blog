# 字體與配色基調重構 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal：** 把全站字體與顏色 token 從近預設、純黑純白的設定，改為以 Noto Serif TC 為主、暖米色 / 暖深咖啡為基底的「紙本閱讀感」。

**Architecture：** 純 CSS token 變更，集中在 `src/styles/global.css`；Shiki 暗色 theme 在 `astro.config.ts` 評估更換。所有顏色透過既有 CSS variables 套用，不改元件結構。tech / life 差異化保留架構伏筆，本次不實作。

**Tech Stack：** Astro 6、原生 CSS（無 Tailwind）、Google Fonts（Noto Serif TC / Noto Sans TC / Noto Sans Mono）、Shiki 程式碼高亮。

**Spec：** [docs/superpowers/specs/2026-05-02-typography-color-baseline-design.md](../specs/2026-05-02-typography-color-baseline-design.md)

---

## File Structure

主要變更：

- **Modify**: `src/styles/global.css` — 所有 token 與 `body` / `.prose` 樣式
- **Modify**: `astro.config.ts:91-96` — Shiki 暗色 theme（如需更換）
- **Verify only**: `src/components/*.astro` — grep 過唯一硬寫值是 `LanguageSwitcher.astro:71` 的 `rgba(0,0,0,0.06)` shadow，本次不動

驗證機制：

- 不寫單元測試（純樣式變更）
- 用 Claude Preview MCP（`preview_start` / `preview_screenshot`）做視覺驗收
- 用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 或同等工具驗證 WCAG AA

---

## Task 1：建立工作分支與初始 preview baseline

**Files:** （無變更，純驗證起點）

- [ ] **Step 1: 確認工作目錄乾淨**

Run: `git status`
Expected: `nothing to commit, working tree clean`，分支為 `main` 或專屬 worktree

- [ ] **Step 2: 啟動 dev server 並擷取 baseline 截圖**

使用 Claude Preview MCP：
- `preview_start` 啟動 `npm run dev`
- `preview_eval` 導向 `http://localhost:4321/zh/`
- `preview_screenshot` 存為 baseline-light-home.png（記憶在對話中即可，不必入版控）
- 切換暗色：`preview_eval({ code: "document.documentElement.dataset.theme='dark'" })`，截 baseline-dark-home.png
- 對 tech 文章頁與 life 文章頁同樣動作（用既有文章 slug，例如 `/zh/posts/2025-07-22_claude-acceptance-test`、`/zh/posts/2025-02-03_point-card-belonging`）

Expected: 6 張 baseline 截圖（3 頁 × 亮暗），用於後續 task 視覺對比

- [ ] **Step 3: 不 commit，進入 Task 2**

---

## Task 2：更新亮色模式 color tokens

**Files:**
- Modify: `src/styles/global.css:1-12`

- [ ] **Step 1: 替換 `:root` 區塊**

把 `src/styles/global.css` 第 1-12 行：

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
```

改為：

```css
:root {
  --color-bg: #f5ede0;
  --color-bg-elevated: #fbf5e9;
  --color-text: #2a241c;
  --color-text-muted: #6e5d47;
  --color-text-subtle: #8a7860;
  --color-border: #e0d4bf;
  --color-border-strong: #c4b594;
  --color-code-bg: #ece2cf;
  --color-hover-bg: #ede2ce;
  --color-link: #8b3a1f;
}
```

- [ ] **Step 2: 視覺驗收（亮色模式）**

- `preview_eval({ code: "document.documentElement.dataset.theme='light'; window.location.reload()" })`
- 用 `preview_screenshot` 截首頁、tech 文章頁、life 文章頁
- 對照 baseline，確認：
  - 背景變為米色（非純白）
  - 文字為暖咖啡色（非純黑）
  - 連結顯示為紅褐色 `#8b3a1f`
  - 無破版、無透明背景元素穿幫

- [ ] **Step 3: WCAG AA 對比度檢查**

對下列組合用 contrast checker 驗證 ≥ 4.5:1：

| Foreground | Background | Min Required | 用途 |
|---|---|---|---|
| `#2a241c` text | `#f5ede0` bg | 4.5 | 內文 |
| `#6e5d47` text-muted | `#f5ede0` bg | 4.5 | meta、次要文字 |
| `#8a7860` text-subtle | `#f5ede0` bg | 3.0 | 裝飾性小字 |
| `#8b3a1f` link | `#f5ede0` bg | 4.5 | 連結 |
| `#2a241c` text | `#ece2cf` code-bg | 4.5 | inline code |

Expected: 全部通過。若某組未達，於本 task 內微調 hex 值並重新檢查。在 plan 註記實際採用的最終值。

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: switch light mode tokens to warm cream palette

- bg #fafafa -> #f5ede0 (warm cream)
- text #1a1a1a -> #2a241c (warm coffee)
- link #0366d6 -> #8b3a1f (warm red-brown)
- All other tokens shifted to harmonize with cream base

Spec: docs/superpowers/specs/2026-05-02-typography-color-baseline-design.md"
```

---

## Task 3：更新暗色模式 color tokens

**Files:**
- Modify: `src/styles/global.css:14-25`

- [ ] **Step 1: 替換 `:root[data-theme="dark"]` 區塊**

把 `src/styles/global.css` 第 14-25 行：

```css
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
```

改為：

```css
:root[data-theme="dark"] {
  --color-bg: #1c1814;
  --color-bg-elevated: #25201a;
  --color-text: #e8ddc8;
  --color-text-muted: #b8a98c;
  --color-text-subtle: #8a7c66;
  --color-border: #3a3128;
  --color-border-strong: #5a4f40;
  --color-code-bg: #2a2419;
  --color-hover-bg: #2a2419;
  --color-link: #d4a574;
}
```

- [ ] **Step 2: 視覺驗收（暗色模式）**

- `preview_eval({ code: "document.documentElement.dataset.theme='dark'; window.location.reload()" })`
- 截首頁、tech 文章頁、life 文章頁
- 確認：
  - 背景變為暖深咖啡（非純黑）
  - 字色為暖米白
  - 連結為暖橘金 `#d4a574`
  - 與亮色模式氣質一致（同為紙本感）

- [ ] **Step 3: WCAG AA 對比度檢查**

| Foreground | Background | Min Required | 用途 |
|---|---|---|---|
| `#e8ddc8` text | `#1c1814` bg | 4.5 | 內文 |
| `#b8a98c` text-muted | `#1c1814` bg | 4.5 | meta |
| `#8a7c66` text-subtle | `#1c1814` bg | 3.0 | 裝飾性 |
| `#d4a574` link | `#1c1814` bg | 4.5 | 連結 |
| `#e8ddc8` text | `#2a2419` code-bg | 4.5 | inline code |

Expected: 全部通過。未達則微調並重檢。

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: switch dark mode tokens to warm coffee palette

- bg #1a1a1a -> #1c1814 (warm dark coffee)
- text #e8e8e8 -> #e8ddc8 (warm cream)
- link #58a6ff -> #d4a574 (warm orange-gold)
- Mirrors light mode's paper-like feel"
```

---

## Task 4：切換內文字體為 Noto Serif TC

**Files:**
- Modify: `src/styles/global.css:35-42`（`body` 規則）

- [ ] **Step 1: 修改 `body` 字體與節奏**

把 `src/styles/global.css` 第 35-42 行：

```css
body {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  line-height: 2;
  letter-spacing: 0.05em;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}
```

改為：

```css
body {
  font-family: var(--font-serif), 'Times New Roman', serif;
  line-height: 2.05;
  letter-spacing: 0.04em;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: 微調 .prose 節奏**

把 `src/styles/global.css` 中的這幾行：

```css
.prose h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
.prose p { margin: 1rem 0; }
```

改為：

```css
.prose h2 { font-size: 1.6rem; margin: 2rem 0 1rem; }
.prose p { margin: 1.1rem 0; }
```

並把：

```css
.prose pre code {
  background: transparent;
  padding: 0;
  font-size: 0.875rem;
}
```

改為：

```css
.prose pre code {
  background: transparent;
  padding: 0;
  font-size: 0.85rem;
}
```

（`h1`、`h3`、`pre` 的其他屬性、`ul/ol/li` 等不動。）

- [ ] **Step 3: 視覺驗收 — 內文 serif 與節奏**

- 重整頁面（dev server 應有 HMR）
- `preview_screenshot` 文章頁
- 用 `preview_inspect` 檢查 `<p>` 元素的 `computed font-family`
- Expected: `font-family` 解析為 `Noto Serif TC, ...`，而非 sans
- 確認標題仍是 serif（`h1`-`h6` 規則本來就是 serif）
- 確認 `.site-title` / `.brand` 仍走 Latin system serif
- 觀察 h2 略大、段落間距略寬、程式碼略小 — 整體節奏更從容

- [ ] **Step 4: 確認 UI 介面文字仍為 sans-serif**

需要檢查 Header、Footer、PostList、PostMeta、LanguageSwitcher 等元件的 meta / nav 文字是否還是 sans。

由於這些元件多半沒有顯式宣告 `font-family`，會繼承 `body`，本次改動會把它們也變成 serif。

預期結果：**會變成 serif**，這是 spec 接受的（spec 說「內文 serif、UI 介面 sans」是理想，但本輪只動 token 與 body 字體，未對個別元件加 sans 宣告）。

如果視覺上某個元件變 serif 後不協調（例如 timestamp 看起來太古典），記錄到 plan 的 Notes，留到後續 task 5 統一處理；不要散落修改。

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "style: body font to Noto Serif TC, tune reading rhythm

- font-family sans -> serif (Noto Serif TC)
- line-height 2 -> 2.05, letter-spacing 0.05em -> 0.04em
- .prose h2 1.5rem -> 1.6rem, p margin 1rem -> 1.1rem
- .prose pre code 0.875rem -> 0.85rem
- h1-h6, .site-title unchanged"
```

---

## Task 5：UI 元件字體例外處理（meta / nav）

**Files:**
- Modify: `src/styles/global.css`（新增規則）

依 Task 4 Step 3 的視覺結果決定本 task 是否需要：

- [ ] **Step 1: 判斷是否需要做**

如果 Task 4 後 Header nav、PostMeta 的 timestamp、tag 標籤等地方 serif 化看起來協調，則跳過本 task，刪除 Task 5 並進入 Task 6。

如果有元件變 serif 後不協調（最常見：時間戳、tag、navigation），則進行 Step 2。

- [ ] **Step 2: 在 global.css 末尾新增 UI 元件 sans 例外規則**

於 `src/styles/global.css` 結尾（Shiki override 區塊後）新增：

```css
/* UI / chrome elements use sans for legibility at small sizes.
   Article body text inherits serif from body. */
header,
footer,
nav,
.post-meta,
.post-list-meta,
.tag,
.lang-switcher {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
}
```

⚠️ 實際 selector 名稱要根據 `src/components/` 實際 class 名修正。先用 `grep -r "class=" src/components/Header.astro src/components/Footer.astro src/components/PostMeta.astro src/components/PostList.astro src/components/LanguageSwitcher.astro` 確認。

- [ ] **Step 3: 視覺驗收**

- 重整頁面，截圖各頁面
- 確認：內文段落為 serif、navigation / footer / meta 為 sans
- 確認 `.prose` 內的內容仍為 serif（因為 prose 容器內無覆蓋）

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "style: keep UI chrome (header, footer, meta) in sans-serif

Body text uses serif for reading; small UI text stays sans for
legibility at small sizes."
```

---

## Task 6：評估並調整 Shiki 暗色 theme

**Files:**
- Modify: `astro.config.ts:91-96`（如需更換）

- [ ] **Step 1: 檢查目前暗色 Shiki theme 與新 code-bg 的協調度**

- 在 preview 切到暗色模式
- 檢視 tech 文章的程式碼區塊
- 觀察：`github-dark-dimmed` 的 token 顏色（藍綠紫）放在新的暖色 code-bg `#2a2419` 上是否突兀

- [ ] **Step 2: 比較候選 theme**

如果 Step 1 判定不協調，候選：
- `monokai` — 暖橘黃綠調，較貼近暖色基調
- `solarized-dark` — 藍綠調但飽和度低
- `vitesse-dark` — 中性偏暖
- `material-theme-palenight` — 紫藍冷調（不建議）

依序在 `astro.config.ts` 試換，每換一個跑 `preview_screenshot` 比對：

```ts
shikiConfig: {
  themes: {
    light: 'github-light',
    dark: 'monokai',  // 試換
  },
},
```

dev server 重啟（Astro config 變更需重啟）：`preview_stop` 後 `preview_start`。

- [ ] **Step 3: 確認亮色 theme 仍協調**

`github-light` 在新 light code-bg `#ece2cf` 上應該還可接受，但若太突兀也可換成 `vitesse-light`。

- [ ] **Step 4: Commit（若有變更）**

```bash
git add astro.config.ts
git commit -m "style: switch Shiki dark theme to <chosen> for warm palette

github-dark-dimmed's cool tones clashed with the new warm code-bg.
<chosen> tokens harmonize with the cream/coffee scheme."
```

如無變更則跳過 commit。

---

## Task 7：全站視覺 smoke test 與最終驗收

**Files:** （無變更，純驗收）

- [ ] **Step 1: 列舉測試矩陣**

頁面 × locale × theme 組合：

| 頁面 | URL pattern | 重點 |
|---|---|---|
| 首頁 | `/{zh,ja,en}/` | post list、hero |
| Tech 列表 | `/{zh,ja,en}/tech` | post list |
| Life 列表 | `/{zh,ja,en}/life` | post list |
| Tech 文章 | `/zh/posts/2025-07-22_claude-acceptance-test` | 含程式碼 |
| Life 文章 | `/zh/posts/2025-02-03_point-card-belonging` | 純文 |
| 日文文章 | `/ja/posts/<日文翻譯>` | 日文字形 |
| 英文文章 | `/en/posts/<英文翻譯>` | 英文字形 |
| Archives | `/zh/archives` | archived posts |
| About | `/{zh,ja,en}/about` | static page |
| Subscription | `/{zh,ja,en}/subscription` | static page |

- [ ] **Step 2: 對每個組合截圖比對 baseline**

對矩陣中每個頁面在亮 / 暗模式各截一張，肉眼比對：
- 配色是否一致套用（無遺漏的灰色背景區塊）
- 字體切換正確（內文 serif，UI 為 sans，code 為 mono）
- 無 layout 破版
- 連結色與 hover 行為符合預期

- [ ] **Step 3: 切換主題流暢度**

- `preview_eval({ code: "document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'" })` 連續切換
- 確認無 FOUC、無顏色閃爍
- 確認 `BaseLayout.astro` 的 inline theme script 不需改動（它只設 `data-theme`，不寫死顏色）

- [ ] **Step 4: 跑 build 確認無錯誤**

Run: `npm run build`
Expected: 1564 頁建置成功，無 CSS 解析錯誤

- [ ] **Step 5: 跑 type check**

Run: `npm run check`
Expected: 通過（不應該因 CSS 變更而失敗，但確認）

- [ ] **Step 6: 跑單元測試**

Run: `npm run test`
Expected: 全部通過（不應受影響）

- [ ] **Step 7: 最終 commit（如 Task 5 / 6 有遺漏的 polish）**

如果在 smoke test 中發現需要小修正，於本 task 內修完後合併 commit：

```bash
git add -A
git commit -m "style: final polish from smoke test"
```

如無修正，跳過。

---

## Task 8：合併與收尾

- [ ] **Step 1: 檢查 git log**

Run: `git log --oneline main..HEAD`
Expected: 看到清晰的 4-7 個 commit（依實際進行的 task 而定）

- [ ] **Step 2: Push（依使用者指示）**

```bash
git push origin <branch>
```

⚠️ 不要自動 push。若在 worktree / feature branch，等使用者確認後執行。

- [ ] **Step 3: 整理 plan 中的 Notes 區塊**

把 implementation 過程中發現的 follow-up（如 tech / life 差異化的 token 設計、特定元件的 polish 想法）寫到 plan 文件末尾的「Follow-ups」區，留作下一輪 spec 起點。

---

## Notes / Follow-ups

（implementation 進行時補充）

- [ ] tech / life 分流 spec 候選方向：
- [ ] 觀察到的小修正：
- [ ] Shiki theme 最終選擇：
