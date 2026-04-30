---
phase: 1a
status: spec
date: 2026-04-30
---

# Phase 1a — 內容複製到 Astro 端

## 目標

把 `public/posts/` 下的 markdown 與圖片**複製**（非搬移）到 `astro/src/content/posts/`，讓 Astro 端內容自給自足，為 Phase 1b 的 image pipeline 鋪路；同時保持 Next.js 端完全不動，遷移期間 prod 維持穩定。

完成此 phase 的瞬間，`astro/src/content/posts/` 即成為新 source of truth。

## 範圍

### 1. 一次性複製內容

使用 PowerShell `Copy-Item -Recurse` 一次整批複製：

```powershell
Copy-Item -Path "public/posts/*" -Destination "astro/src/content/posts/" -Recurse
```

- 來源：`public/posts/`（root 下，Next.js source）
- 目的地：`astro/src/content/posts/`（Astro Content Collection root）
- 複製內容包含 8 個 group 目錄：`archives/` + `2020/` ~ `2026/`，及其下所有 post 目錄與圖片
- 不複製到嵌套子目錄（用 `*` 萬用字元保留 group 在第一層）

### 2. `astro/src/content.config.ts`

- `base: '../public/posts'` → `base: './src/content/posts'`
- pattern 不變（仍為 `['**/*.md', '!**/index.en.md', '!**/index.ja.md']`，POC 仍為 zh-only）
- schema 不變

### 3. `astro/src/lib/posts.ts`

**A. `parsePathSegments()` marker 切換**

- 將既有 `/public/posts/` marker 改為 `/src/content/posts/`
- **移除舊 marker fallback**：不保留兩條路徑邏輯，新位置就只用新 marker
- `entry.id` 的 fallback 分支保留（POC 已證明 Windows + 特殊字元路徑會觸發此 fallback；雖然搬進 collection 後 `entry.id` 應更穩定，但保留不增加複雜度且具防禦性）

**B. 順手做：slug 唯一性 assertion**

在 `getAllPosts()` 內，回傳排序後加入 assertion：

```ts
const seen = new Map<string, string>();
for (const post of sorted) {
  const prev = seen.get(post.slug);
  if (prev) {
    throw new Error(
      `[posts] Duplicate slug "${post.slug}" in entries: ${prev} and ${post.entry.id}`,
    );
  }
  seen.set(post.slug, post.entry.id);
}
```

理由：內容剛搬完、diff 清楚、現在驗 slug 唯一性最划算。若有衝突當下處理：≤ 3 筆衝突直接修 frontmatter；> 3 筆暫停回頭討論。

### 4. 不在範圍內

- 圖片 pipeline（Phase 1b）—— `passthroughImageService` + `ignorePublicContentImages` Vite plugin 維持原樣
- ja / en 翻譯內容（Phase 2）
- `Astro.params.locale!` non-null assertion 抽 helper（Phase 2）
- Next.js 端任何改動（Phase 6 一併清理）
- `public/posts/` 刪除（Phase 6）

## Source of Truth 同步紀律

Phase 1a 完成後：

1. **`astro/src/content/posts/` 成為唯一 source of truth**
2. 遷移期間（Phase 1b ~ 6）所有新文章與修改**只寫到新位置**
3. **不寫 sync script**——避免誘惑去改舊位置
4. Next.js prod 若有緊急 hotfix 需求：先寫到新位置，再手動 `Copy-Item` 對應檔案到 `public/posts/`，commit message 標註 hotfix 同步意圖
5. Phase 6 切換上線前做 `diff -r public/posts/ astro/src/content/posts/` 確認無漏

## 驗收

1. **Astro build 通過**：`cd astro; npm run build` 完成、頁數與 Phase 0 同數量級（1494+ 頁）
2. **Next.js build 仍綠**：root `npm run build` 通過、output 與 Phase 0 一致
3. **內容抽樣比對**：抽樣以下頁面，Astro build 結果與 Phase 0 一致
   - 首頁 `/zh/`
   - `/zh/tech`
   - `/zh/life`
   - `/zh/archives`
   - 5 篇文章（2020、2022、2024、2025、archives 各一篇）
4. **slug 唯一性 assertion 通過**：`getAllPosts()` 不 throw（若 throw 依「順手做」段落處理）
5. **圖片狀態維持破圖**：Astro 端 markdown 內 `images/*` 仍為 broken image（Phase 1b 才修），驗證未意外動到 image 邏輯
6. **git diff 形狀**：呈現新增 ~1400 個目錄而非 rename（這是用 cp 的預期，不是 bug）

## 風險與緩解

| 風險 | 影響 | 緩解 |
|------|------|------|
| Windows 上複製工具行為差異（symlink / permission） | 複製不完整 | 用 PowerShell 原生 `Copy-Item -Recurse`，避免 git bash `cp` |
| Source 紀律破裂（有人改了舊位置） | 兩端內容飄移 | 不寫 sync script、commit message 約定、Phase 6 切換前 `diff -r` 驗收 |
| slug 唯一性衝突 | assertion throw、build 掛 | 預設 throw；≤ 3 筆當場修，> 3 筆暫停回頭討論 |
| 大量 git add（~3000+ 檔案） | commit 慢 | 可接受，無需特別處理 |
| `parsePathSegments` 移除舊 marker 後，若 entry.filePath 在新位置仍走 fallback | 解析錯誤 silently skip | POC 既有 `console.warn` 機制保留；build 時會看到 warning |

## 相依

- 上游：Phase 0（POC）—— 已 merge 至 main
- 下游：Phase 1b（圖片 pipeline）、Phase 2（多語言）依賴此 phase 完成

## 不變式

- Next.js 端 `public/posts/` 完全不動
- Astro URL 結構、頁面內容、頁數與 Phase 0 一致
- 圖片仍為破圖狀態（Phase 1b 修）
- POC 採用的 image workaround（`passthroughImageService`、`ignorePublicContentImages`）保留
