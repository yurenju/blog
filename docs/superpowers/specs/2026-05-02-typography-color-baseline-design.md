# 字體與配色基調重構 Design Spec

**日期**：2026-05-02
**範圍**：全站字體 (typography) 與顏色 token 基調調整
**主旨**：把目前接近預設、純黑純白的視覺，改為以 Noto Serif TC 為主的紙本閱讀感，搭配暖米色 / 暖深咖啡色配色

## 目標

讓部落格在亮色與暗色模式下都呈現「紙本閱讀感」，提升中文長文的閱讀舒適度。靈感來自 justfont 部落格的閱讀節奏，但只使用 Google Fonts 的免費字體。

明確不做：
- tech / life 分類字體差異化（這輪只訂全站基調，未來會在另一份 spec 處理；架構需保留延伸空間）
- 換非免費字體
- 改 layout / container 寬度 / 元件結構

## 目前狀態

`src/styles/global.css`：
- 亮色 bg `#fafafa` / text `#1a1a1a`：接近純白純黑
- 暗色 bg `#1a1a1a` / text `#e8e8e8`：接近全黑全白
- 內文：`Noto Sans TC`（sans）；標題：`Noto Serif TC`（serif）
- `line-height: 2`、`letter-spacing: 0.05em`

字體透過 Astro Font API 在 `astro.config.ts` 載入，暴露為 `--font-sans` / `--font-serif` / `--font-mono` 三個 CSS 變數。

## 設計決策

### 決策 1：內文字體改為 Noto Serif TC

`body` 字體改用 serif，不再用 sans-serif。原因：
- 中文 serif (宋體) 在長文閱讀時的舒適度通常優於 sans，特別是在實體紙感的米色底色搭配下
- 標題本來就是 serif，內文也用 serif 後整體調性更一致
- 仍是已經載入的 Google Font，不增加額外字體請求

例外仍保留：
- `code` / `pre`：`Noto Sans Mono` → ui-monospace fallback
- `.site-title` / `.brand`：Latin-only system serif（Georgia 鏈），現狀不動
- 其他 UI 介面文字（meta、tag、按鈕）：用 sans-serif (`--font-sans`) 以保留資訊密度

### 決策 2：亮色配色 — 暖米色基底

新 token 值：

| Token | 現值 | 新值 | 說明 |
|---|---|---|---|
| `--color-bg` | `#fafafa` | `#f5ede0` | 暖米色 |
| `--color-bg-elevated` | `#ffffff` | `#fbf5e9` | 略亮的米色 |
| `--color-text` | `#1a1a1a` | `#2a241c` | 暖咖啡黑 |
| `--color-text-muted` | `#555555` | `#6e5d47` | 暖灰咖啡（取代純灰） |
| `--color-text-subtle` | `#888888` | `#8a7860` | meta / timestamp |
| `--color-border` | `#e5e5e5` | `#e0d4bf` | 暖米色 border |
| `--color-border-strong` | `#cccccc` | `#c4b594` | 引用、分隔線 |
| `--color-code-bg` | `#f0f0f0` | `#ece2cf` | inline code / table header |
| `--color-hover-bg` | `#f3f3f3` | `#ede2ce` | hover 背景 |
| `--color-link` | `#0366d6` | `#8b3a1f` | 暖紅褐連結（紙本印刷感） |

### 決策 3：暗色配色 — 暖深咖啡基底（A1）

| Token | 現值 | 新值 | 說明 |
|---|---|---|---|
| `--color-bg` | `#1a1a1a` | `#1c1814` | 暖深咖啡（保留紙本氣質） |
| `--color-bg-elevated` | `#242424` | `#25201a` | 略亮 |
| `--color-text` | `#e8e8e8` | `#e8ddc8` | 暖米白 |
| `--color-text-muted` | `#a8a8a8` | `#b8a98c` | 暖米灰 |
| `--color-text-subtle` | `#888888` | `#8a7c66` | meta |
| `--color-border` | `#333333` | `#3a3128` | 暖深咖啡 border |
| `--color-border-strong` | `#555555` | `#5a4f40` | 引用、分隔線 |
| `--color-code-bg` | `#2a2a2a` | `#2a2419` | code 區塊 |
| `--color-hover-bg` | `#2a2a2a` | `#2a2419` | hover |
| `--color-link` | `#58a6ff` | `#d4a574` | 暖橘金連結 |

### 決策 4：排版節奏微調

| 屬性 | 現值 | 新值 | 適用範圍 |
|---|---|---|---|
| `body` `line-height` | `2` | `2.05` | 內文行高微增（serif 長文需要更多呼吸） |
| `body` `letter-spacing` | `0.05em` | `0.04em` | serif 中文間距略收 |
| `.prose p` `margin` | `1rem 0` | `1.1rem 0` | 段落間距略寬 |
| `.prose h1` `font-size` | `2rem` | `2rem` | 不變 |
| `.prose h2` `font-size` | `1.5rem` | `1.6rem` | 略大，加強層級 |
| `.prose pre` `letter-spacing` | `0` | `0` | 不變 |
| `.prose pre` `font-size` | `0.875rem` | `0.85rem` | 略小，避免 mono 過於搶眼 |

`h1`-`h6` 維持 serif，`line-height: 1.4`、`letter-spacing: 0`、`font-weight: 700` 不動。

### 決策 5：Shiki 程式碼高亮

`astro.config.ts` 中的 Shiki dual theme 目前推測使用預設配對。本次：
- 亮色維持目前 light theme（不變）
- 暗色 theme 若與新 `--color-code-bg #2a2419` 反差過大，建議切換到色調更暖的 theme（例如 `monokai` 或 `solarized-dark`）；具體選擇在 implementation phase 用 preview 比對決定

### 決策 6：架構保留 tech / life 擴充空間

不新增 token，但實作時：
- 顏色 token 全部定義在 `:root` / `:root[data-theme="dark"]`，未來可用 `[data-category="tech"]` 等 selector 覆蓋而無需重構
- 字體 token (`--font-serif` 等) 走相同模式

未來分流時，會新增另一份 spec（例：`2026-XX-XX-tech-life-differentiation-design.md`）。

## 受影響檔案

- `src/styles/global.css`：所有 token 改值、`body` 字體改 serif、`.prose` 節奏微調
- `astro.config.ts`：font API 設定不變（Noto Serif TC 已載入）；Shiki theme 可能調整
- `src/layouts/BaseLayout.astro`：理論上不變，但 dark mode inline script 的 fallback 顏色（若有硬寫）需檢查
- `src/components/*.astro`：scoped `<style>` 內若有硬寫顏色（不應有，但要 grep 驗證）需改為 var

## 驗收條件

1. 亮色模式下，內文使用 Noto Serif TC，背景明顯偏米色（非純白），視覺類似紙本
2. 暗色模式下，背景為暖深咖啡（非純黑），字色為暖米白
3. Shiki 程式碼區塊在亮 / 暗模式下與內文底色協調，沒有「白框框」突兀感
4. 所有 token 對比度通過 WCAG AA：
   - 內文 (`text` on `bg`)：≥ 4.5:1（normal text）
   - 微弱文字 (`text-muted` on `bg`)：≥ 4.5:1（meta 是小字也屬 normal text）
   - 連結 (`link` on `bg`)：≥ 4.5:1
   - implementation phase 用 contrast checker 逐一驗證；若不達標則收斂顏色
5. 字體切換後，現有所有頁面（首頁、tech、life、archives、posts/[slug]、about、subscription）以及三個 locale (zh / ja / en) 都不破版
6. Dev server 啟動後在 preview 中肉眼確認亮 / 暗模式切換流暢、無 FOUC

## 不做（明確列出避免 scope creep）

- tech / life 分類字體 / 配色差異化
- 修改 container 寬度、元件 layout、navigation 結構
- 新增字體（不引入除 Noto Serif TC / Noto Sans TC / Noto Sans Mono 以外的字體）
- 修改 RSS / SEO / sitemap 等非視覺部分
- 修改 i18n 翻譯字串
- 重做 ThemeToggle 元件邏輯

## Open Questions

- Shiki dark theme 具體選哪個（`github-dark-dimmed` / `monokai` / 其他）：implementation 時用 preview 比對決定
- 暗色連結 `#d4a574` 對於 tech 文中常見的內嵌連結（句中夾連結）是否會太搶眼：implementation 時調整
