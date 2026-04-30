# Phase 1a 內容複製到 Astro 端 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `public/posts/` 下的 markdown 與圖片複製到 `astro/src/content/posts/`，更新 Astro glob loader base 與 `parsePathSegments` marker，並加入 slug 唯一性 assertion。Next.js 端不動，遷移期間 prod 維持穩定。

**Architecture:** 一次性 PowerShell `Copy-Item -Recurse` 整批複製，內容複製後 Astro Content Collection 改讀 `./src/content/posts`。`parsePathSegments` marker 從 `/public/posts/` 切換到 `/src/content/posts/`，舊 marker fallback 移除。`getAllPosts()` 加 slug 唯一性檢查，duplicate 直接 throw。

**Tech Stack:** Astro 6.2、TypeScript、PowerShell 7+（Copy-Item）、Node.js（astro build）

---

## File Structure

**Modified files (在 `astro/` 子目錄下)：**
- `astro/src/content.config.ts` — glob loader base 改為 `./src/content/posts`
- `astro/src/lib/posts.ts` — `parsePathSegments` marker 切換、移除舊 fallback、`getAllPosts()` 加 slug 唯一性 assertion

**Created (大量 untracked)：**
- `astro/src/content/posts/<group>/<post>/...` — 約 1400+ 個目錄、3000+ 檔案，從 `public/posts/` 整批複製

**Untouched：**
- root 下任何 Next.js 程式（`app/`、`lib/`、`public/posts/`、`next.config.*` 等）
- `astro/astro.config.ts`（image workaround 維持，Phase 1b 才拆）
- `astro/src/pages/`、`astro/src/components/`、`astro/src/layouts/`

---

## Task 1: 複製內容到 Astro 端

**Files:**
- Create: `astro/src/content/posts/` 下整批檔案（從 `public/posts/` 複製）

- [ ] **Step 1: 確認目的地不存在或為空**

Run (PowerShell):
```powershell
Test-Path astro/src/content/posts
```
Expected: `False`（若 `True` 則需先確認內容是否可清空，並回報使用者再決定）。

- [ ] **Step 2: 建立目的地目錄**

Run (PowerShell):
```powershell
New-Item -ItemType Directory -Path astro/src/content/posts -Force | Out-Null
```

- [ ] **Step 3: 整批複製**

Run (PowerShell):
```powershell
Copy-Item -Path "public/posts/*" -Destination "astro/src/content/posts/" -Recurse
```

- [ ] **Step 4: 驗證複製完整性**

Run (PowerShell):
```powershell
$src = (Get-ChildItem -Recurse -File public/posts).Count
$dst = (Get-ChildItem -Recurse -File astro/src/content/posts).Count
"src=$src dst=$dst"
```
Expected: `src` 與 `dst` 數字相等。若不等，刪除 `astro/src/content/posts/` 後重跑 Step 2–4。

- [ ] **Step 5: 驗證 group 結構**

Run (PowerShell):
```powershell
Get-ChildItem astro/src/content/posts -Directory | Select-Object -ExpandProperty Name
```
Expected: `2020`, `2021`, `2022`, `2023`, `2024`, `2025`, `2026`, `archives`（共 8 個）。

- [ ] **Step 6: 暫不 commit**

Step 1 的複製不單獨 commit，與後續 config / lib 改動一起 commit（Task 4），確保 main 上每個 commit 都能 build。

---

## Task 2: 切換 Content Collection glob base

**Files:**
- Modify: `astro/src/content.config.ts:9`

- [ ] **Step 1: 修改 base 路徑**

Edit `astro/src/content.config.ts`，把：
```ts
    base: '../public/posts',
```
改為：
```ts
    base: './src/content/posts',
```

- [ ] **Step 2: type check**

Run:
```bash
cd astro
npm run check
```
Expected: 通過、無新 error（既有的 schema warning 若有則照舊）。

---

## Task 3: 更新 `parsePathSegments` marker 與加入 slug 唯一性 assertion

**Files:**
- Modify: `astro/src/lib/posts.ts:59-89`（`parsePathSegments` 函式）
- Modify: `astro/src/lib/posts.ts:128-134`（`getAllPosts` 函式）

- [ ] **Step 1: 切換 marker 並移除舊 fallback**

Edit `astro/src/lib/posts.ts`，把 `parsePathSegments` 內：
```ts
  // Posix-normalize the absolute file path then strip the loader base prefix.
  const fp = entry.filePath?.replaceAll('\\', '/');
  if (fp) {
    const marker = '/public/posts/';
    const i = fp.lastIndexOf(marker);
    if (i >= 0) {
      const rel = fp.slice(i + marker.length).replace(/\.md$/, '');
      const segs = rel.split('/');
      if (segs.length >= 3) {
        return {
          group: segs[0]!,
          dirname: segs[1]!,
          filename: segs[segs.length - 1]!,
        };
      }
    }
  }
```
改為：
```ts
  // Posix-normalize the absolute file path then strip the loader base prefix.
  const fp = entry.filePath?.replaceAll('\\', '/');
  if (fp) {
    const marker = '/src/content/posts/';
    const i = fp.lastIndexOf(marker);
    if (i >= 0) {
      const rel = fp.slice(i + marker.length).replace(/\.md$/, '');
      const segs = rel.split('/');
      if (segs.length >= 3) {
        return {
          group: segs[0]!,
          dirname: segs[1]!,
          filename: segs[segs.length - 1]!,
        };
      }
    }
  }
```

`entry.id` fallback 分支保留不動（POC 已驗證 Windows 特殊字元路徑會觸發此 fallback）。

- [ ] **Step 2: 在 `getAllPosts` 加入 slug 唯一性 assertion**

Edit `astro/src/lib/posts.ts`，把：
```ts
export async function getAllPosts(): Promise<PostMeta[]> {
  const entries = await getCollection('posts');
  return entries
    .map(toMeta)
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
```
改為：
```ts
export async function getAllPosts(): Promise<PostMeta[]> {
  const entries = await getCollection('posts');
  const sorted = entries
    .map(toMeta)
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Slug uniqueness assertion: duplicates would silently collide on /zh/posts/<slug>.
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

  return sorted;
}
```

- [ ] **Step 3: type check**

Run:
```bash
cd astro
npm run check
```
Expected: 通過、無 error。

---

## Task 4: 驗證 Astro build 並 commit

**Files:**
- 全部 Task 1–3 的改動

- [ ] **Step 1: 跑 Astro build**

Run:
```bash
cd astro
npm run build
```
Expected:
- Build 通過、無 error
- 頁數 ≥ 1494（與 Phase 0 同數量級）
- 若 throw `[posts] Duplicate slug ...`：依 spec 處理 — 衝突 ≤ 3 筆當場修對應 entry 的 frontmatter slug，再重跑；> 3 筆暫停、回報使用者後再繼續

- [ ] **Step 2: 抽樣 dist 內容比對**

Run (PowerShell):
```powershell
Test-Path astro/dist/zh/index.html
Test-Path astro/dist/zh/tech/index.html
Test-Path astro/dist/zh/life/index.html
Test-Path astro/dist/zh/archives/index.html
(Get-ChildItem -Recurse astro/dist/zh/posts -Filter index.html).Count
```
Expected: 前 4 個皆 `True`；最後一行 post 數量 ≥ 1400（具體數字以 Phase 0 build 為準）。

- [ ] **Step 3: 確認 Next.js build 仍綠**

Run (root)：
```bash
npm run build
```
Expected: 通過、無 error、output 不變。

- [ ] **Step 4: 檢查 git diff 形狀**

Run:
```bash
git status
```
Expected:
- `astro/src/content/posts/` 下大量新增（~1400 目錄、~3000+ 檔案）
- `astro/src/content.config.ts` 修改
- `astro/src/lib/posts.ts` 修改
- 無 rename、無 `public/posts/` 改動

- [ ] **Step 5: Commit**

Run:
```bash
git add astro/src/content/posts astro/src/content.config.ts astro/src/lib/posts.ts
git commit -m "$(cat <<'EOF'
feat(astro): copy posts into src/content and switch loader base (Phase 1a)

Copy public/posts/ into astro/src/content/posts/ as the new source of
truth. Switch Astro's glob loader base, update parsePathSegments marker
to /src/content/posts/, and add a slug uniqueness assertion in
getAllPosts(). Next.js side untouched.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6: 確認 commit 成功**

Run:
```bash
git log --oneline -1
git status
```
Expected: 最新 commit 為上述訊息；working tree clean。

---

## Self-Review 結果

**Spec coverage：**
- Spec §1 一次性複製 → Task 1 ✓
- Spec §2 content.config.ts 改 base → Task 2 ✓
- Spec §3A parsePathSegments marker 切換 + 移除舊 fallback → Task 3 Step 1 ✓
- Spec §3B slug uniqueness assertion → Task 3 Step 2 ✓
- Spec §4 不在範圍內（image / locale / Next.js 端）→ 計畫無相關任務 ✓
- Spec 驗收 1（Astro build 通過 + 頁數）→ Task 4 Step 1 ✓
- Spec 驗收 2（Next.js build 仍綠）→ Task 4 Step 3 ✓
- Spec 驗收 3（內容抽樣比對）→ Task 4 Step 2 ✓
- Spec 驗收 4（slug assertion 通過）→ Task 4 Step 1（throw 處理路徑明確）✓
- Spec 驗收 5（圖片仍破圖）→ 不需驗收動作；計畫未動 image workaround
- Spec 驗收 6（git diff 為新增）→ Task 4 Step 4 ✓

**Placeholder scan：** 無 TBD/TODO，每個 step 均含實際指令或 code。

**Type 一致性：** `parsePathSegments`、`getAllPosts`、`toMeta`、`PostMeta` 簽名與既有 `astro/src/lib/posts.ts` 一致。
