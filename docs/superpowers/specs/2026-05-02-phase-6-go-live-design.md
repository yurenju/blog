# Phase 6 — 切換上線設計

## 目標與範圍

把 Astro 從 `astro/` 子目錄推到 repo root，刪除 Next.js 程式，切換 Cloudflare Pages 部署設定，補齊舊 URL 的 `_redirects` 規則，讓 yurenju.blog 由 Astro 對外服務。

### 範圍內

- 刪除 Next.js code（`app/`、`lib/`、`components/`、`hooks/`、`scripts/`、`next.config.ts`、`tailwind.config.ts`、`postcss.config.mjs`、`components.json`、`next-env.d.ts`、`eslint.config.mjs`、`.cursorrules`、root `package.json` / `tsconfig.json` / `package-lock.json`、root `public/` 全部）
- `git mv astro/* .` 把 astro 內容搬到 root
- 更新 `.gitignore`（移除 next.js 相關 entry，加入 `dist/`、`.astro/`、`coverage/`、`.env*`、`.DS_Store`、`.vercel`）
- 更新 `.nvmrc` → `22`
- 更新 `CLAUDE.md` 的 Commands 與 Architecture 章節對應 Astro
- 修改 `package.json` `name: "blog-astro"` → `"blog"`
- 寫 `public/_redirects`：9 條 redirect 規則（root + 8 條 root-level legacy）
- Cloudflare Pages dashboard：framework preset、build command、output dir、`NODE_VERSION=22`、Build system v3
- Phase 6 完成後更新 `docs/research/2026-04-29-astro-migration-roadmap.md` 狀態（merge 後的後續 commit）

### 範圍外（明確不做）

- shorts feed（`/rss/{zh,ja,en}/shorts.xml`、`/rss/shorts.xml`）的 redirect — 接受 404
- favicon — 之後重新設計時再做
- README.md — Next.js boilerplate 留著或之後再寫，不影響部署
- preview deployment 驗證 — 直接 merge 上線
- Cloudflare CDN cache 主動清除 — 靠 Pages 自動 invalidate
- 升級 Astro 或其他套件版本

### 驗收（merge 後）

- yurenju.blog/zh/ hero 正確顯示（logo + Yuren's Blog title + description + 生活·技術 連結）
- 9 條 `_redirects` 規則生效（root、`/tech`、`/life`、`/archives`、`/archives/tech`、`/archives/life`、`/about`、`/subscription`、`/posts/*`）
- 抽 5 個 sitemap-0.xml 內 URL 確認 200
- RSS reader 拉 `/rss/zh.xml` 正常收到內容
- 暗色模式切換正常、`localStorage` 持久化
- Search Console 一週內 404 事件沒大幅暴增

---

## 背景

Phase 0–5 已全部完成 merge 到 main。當前狀態：

- Astro 6.2 在 `astro/` 子目錄，`output: 'static'`，build 1564 pages、~40 秒
- Next.js 15 在 root，`output: 'export'`，仍是 Cloudflare Pages 上對外服務的版本
- 兩邊內容已對齊（`public/posts/` 跟 `astro/src/content/posts/` 內容除 line ending 外完全一致）
- Phase 6 是「物理層」切換 — 程式內容已就緒，差的是檔案位置與部署設定

### 切換策略：方案 B（一次到位）

開發者選擇方案 B 而非 A（先切平台、後清理檔案）。理由：個人 blog，斷一陣子無感，操作步驟少、心智負擔低。

---

## 架構

### 切換時序

```
Step 1: push phase-6 branch 到 GitHub
        Cloudflare 自動 build preview，dashboard 還是 Next.js → preview 失敗（無視）

Step 2: Cloudflare Pages dashboard 改設定
        改 framework preset、build command、output dir、NODE_VERSION、Build system v3
        改完後 main 的下一次 build 會失敗（dashboard 是 Astro，code 是 Next.js）
        → 應該 5 分鐘內就接 Step 3

Step 3: merge phase-6 → main
        Cloudflare 偵測 push 自動 build → 用新設定 + 新程式 → 成功

Step 4: 驗證（curl 抽樣 + 瀏覽器 + RSS reader）

Step 5: rollback gate（5 分鐘內若發現 critical issue 就 instant rollback）
```

### Rollback 路徑

**Instant rollback（< 1 分鐘）**：Cloudflare Pages dashboard → Deployments → 找前一個 Next.js Success deployment → 「Rollback to this deployment」按鈕 → prod URL 立刻指回上一個 build 的靜態檔案。`git revert` 動作可以之後慢慢做。

**永久回到 Next.js（10–30 分鐘）**：dashboard 改回 Next.js framework preset / build command / output dir、`git revert` phase-6 merge commit、push main → Cloudflare 重新 build。

實務原則：先按 instant rollback 救體驗，再從容調查問題。

---

## File 操作清單

### 刪除（commit 1）

```
# Next.js source
app/
lib/
components/
hooks/
scripts/
next.config.ts
tailwind.config.ts
postcss.config.mjs
components.json
next-env.d.ts
eslint.config.mjs
.cursorrules

# Next.js root configs (will be replaced by astro's in commit 2)
package.json
tsconfig.json
package-lock.json

# Build artifacts (gitignored, untracked rm)
.next/
out/
tsconfig.tsbuildinfo
build-output.log
nul

# Old public/ (Next.js source/output)
public/posts/
public/pages/
public/rss/
public/rss.xml
public/logo.jpg            # astro/public/logo.jpg 已有同檔
public/favicon.ico         # 之後重新設計
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
```

預計刪除 ~30 個 source/config 檔 + `public/posts/` 約 1500 個 markdown + `public/pages/` 6 個 + `public/rss/` 12 個 ≈ **總計約 1550 個檔案 deleted**。

### 搬移（commit 2）

```bash
git mv astro/src ./src
git mv astro/public ./public
git mv astro/astro.config.ts astro/package.json astro/package-lock.json \
       astro/tsconfig.json astro/vitest.config.ts .
rmdir astro
```

`astro/` 子目錄完全消失，內容搬到 root。`git mv` 對 1500+ markdown 觸發 rename detection，git history 保留（可用 `git log --follow` 驗證）。

`astro.config.ts`、`vitest.config.ts` 內所有路徑都用相對 + `import.meta.url`，搬到 root 後無需修改。

### 修改（commit 2 同個）

- `package.json`：`"name": "blog-astro"` → `"name": "blog"`
- `.gitignore`：以 astro 端 `.gitignore` 為基底，加入 `coverage/`、`.env*`、`.DS_Store`、`.vercel`，移除 next.js 相關 entry
- `.nvmrc`：`v24.15.0` → `22`
- `CLAUDE.md`：更新 Commands 與 Architecture 章節（指令名稱 `npm run dev/build/preview/check/test`，結構描述 `src/content/posts/`、`src/pages/[locale]/...`、`astro.config.ts`）

### 寫新檔（commit 3）

`public/_redirects`：

```
# Root → default locale (faster than meta refresh)
/                /zh/                301

# Legacy Next.js root-level routes → /zh/...
/tech            /zh/tech            301
/life            /zh/life            301
/archives        /zh/archives        301
/archives/tech   /zh/archives/tech   301
/archives/life   /zh/archives/life   301
/about           /zh/about           301
/subscription    /zh/subscription    301
/posts/*         /zh/posts/:splat    301
```

說明：
- 9 條規則全部 301，搜尋引擎會更新 index
- `/posts/*` 用 `:splat` 帶過 slug
- `src/pages/index.astro` 的 meta refresh 保留：本地 `npm run preview` 不讀 `_redirects`，靠 meta refresh；prod 上 Cloudflare 優先匹配 `_redirects`，比 meta refresh 快一個 round-trip
- 本地 dev/preview 都不會讀 `_redirects`，**只能 prod 上線後驗證**

不在 `_redirects` 中的舊 URL（接受 404）：
- `/rss/shorts.xml`、`/rss/{zh,ja,en}/shorts.xml`（4 條）

---

## Cloudflare Pages dashboard 設定

進入 Pages 專案 → Settings → Builds & deployments：

| 欄位 | 舊值（Next.js）| 新值（Astro）|
|---|---|---|
| Framework preset | Next.js (Static HTML Export) | **Astro** |
| Build command | `next build` | `npm run build` |
| Build output directory | `out` | `dist` |
| Root directory | `/` | `/`（不變）|
| Build system version | v1 / v2 | **v3** |

Environment variables：
- 新增：`NODE_VERSION=22`
- 移除：任何 `NEXT_*` 開頭的 env var、任何指向 `/.next` 路徑的設定

Build system v3 預設 Node 22.16，跟 `.nvmrc` 跟 `NODE_VERSION` env var 對齊。

---

## Commit 結構

phase-6 branch 上 3 個 commit + 1 個 merge 後 commit：

### Commit 1: `chore: remove Next.js code and obsolete public/ assets`

**動作**：File 操作清單 — 刪除 章節列出的所有檔案

**驗證**：`cd astro && npm install && npm run build` 仍 1564 pages 成功（astro/ 子目錄完整不動）

### Commit 2: `chore: move Astro project to repo root`

**動作**：
- `git mv astro/src ./src`
- `git mv astro/public ./public`
- `git mv astro/astro.config.ts astro/package.json astro/package-lock.json astro/tsconfig.json astro/vitest.config.ts .`
- `rmdir astro`
- 修改 `package.json` name、`.gitignore`、`.nvmrc`、`CLAUDE.md`

**驗證**：
- `npm install` from root
- `npm run build` from root → 1564 pages
- `npm run test` from root → 73 tests pass
- `npx astro check` 無錯誤
- `git log --follow src/content/posts/2026/2026-01-23_layers-of-context-and-me/index.ja.md` 能追到 Phase 1a 之前的歷史

### Commit 3: `feat: add Cloudflare Pages _redirects for legacy URLs`

**動作**：新增 `public/_redirects`，內容如上

**驗證**：`npm run build` 之後 `dist/_redirects` 存在且內容一致

### Commit 4（merge + deploy 驗證 OK 後另開）: `docs: mark Phase 6 complete in migration roadmap`

**動作**：
- 更新 `docs/research/2026-04-29-astro-migration-roadmap.md` 第 1-3 行的「狀態」欄
- 在 Phase 6 章節下加完成 commit hash + 完成日期 + 完成備忘

**時點**：merge 完、deploy 成功、24 小時無 critical issue 之後

---

## 驗證序列

### a. 部署狀態
- Cloudflare Pages dashboard → Deployments → main 最新 build = `Success`
- Build log 無錯誤

### b. 基本可達性（curl 抽樣）

```bash
curl -I https://yurenju.blog/                          # 301 → /zh/
curl -I https://yurenju.blog/zh/                       # 200
curl -I https://yurenju.blog/zh/tech                   # 200
curl -I https://yurenju.blog/tech                      # 301 → /zh/tech
curl -I https://yurenju.blog/posts/2024-01-01_w3c-dids-redefining-identity-authority
                                                       # 301 → /zh/posts/...
curl -I https://yurenju.blog/rss/zh.xml                # 200, application/xml
curl -I https://yurenju.blog/sitemap-index.xml         # 200
```

### c. 視覺抽樣（瀏覽器）

- `/zh/` hero（logo + Yuren's Blog + description + 生活·技術 連結）
- 暗色模式 toggle 兩次切換 + reload 後保持
- 文章頁 `/zh/posts/2026-01-23_layers-of-context-and-me`：cover、images、JSON-LD、language switcher
- `/ja/`、`/en/` 首頁
- `/zh/tech` 底部「更多歸檔文章」連結 → `/zh/archives/tech`

### d. RSS reader

- 把 `/rss/zh.xml` 加到任一 reader（Feedly / NetNewsWire），確認最近文章出現、有圖

### e. 字型 swap 體驗

- 無痕模式第一次進站 → 觀察是否 FOUT
- 第二次 reload → 預期無 FOUT（HTTP cache 命中）

---

## Rollback 計畫

### Critical（立即 rollback）

觸發條件：
- prod 完全 white screen / 500
- 主要 URL 連 `/zh/` 都 404
- RSS feed 全壞 / `<language>` 全錯
- 中文文章列表完全空白

動作：
1. Cloudflare dashboard → Deployments → 上一個 Next.js Success deployment → 「Rollback to this deployment」
2. 1 分鐘內生效
3. 之後再 `git revert` phase-6 merge commit + push main 避免下次 build 又錯

### Major（修一下能繼續）

觸發條件：
- 個別頁面 broken
- `_redirects` 規則某條漏寫或寫錯
- 圖片有破圖

動作：不 rollback，phase-6 branch 補 commit + push main → 重新 deploy。

### Minor（觀察記錄）

觸發條件：字型小跳動、視覺微調、SEO meta 細節

動作：寫成 follow-up issue/task，留到下個版本。

---

## 持續觀察（一週）

- **Cloudflare Pages → Analytics**：404 事件數量 vs 過去一週基線
- **Search Console → Coverage**：是否有 indexed 頁掉到 not indexed
- **Search Console → URL Inspection**：抽 3 條舊文章 URL 確認 Google 認得 redirect

---

## 風險清單

| 風險 | 影響 | 緩解 |
|---|---|---|
| dashboard 改完到 merge 之間 main 無法 build | 短暫 build 失敗（prod 不受影響，仍 serve 上次 success build）| Step 2 改完 5 分鐘內 merge phase-6 |
| 忘記改 dashboard 直接 merge | main build 失敗（試圖跑 `next build` 在沒有 Next.js code 的 repo）| prod 維持上次 success；補做 dashboard 即可 |
| `git mv` rename detection 失敗 | 部分 markdown history 變成 delete + add | 個人 blog 影響小；如真的失敗可後續用 `--find-renames=30` 重做 |
| `_redirects` 規則漏寫某條舊 URL | 那條舊 URL 404 | Search Console 一週觀察補 redirect |
| Build system v3 + Node 22 升級 | 罕見 build 失敗 | dashboard rollback 到 v2 + Node 18 |
| 老 RSS reader cache 舊 feed URL | 訂閱者短暫看不到新文章 | 多數 reader 24 小時內會重新拉 |

---

## 參考資料

- [Astro · Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Build image · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare Pages Build System v3 changelog (2025-05-30)](https://developers.cloudflare.com/changelog/post/2025-05-30-pages-build-image-v3/)
- [Cloudflare Pages `_redirects` reference](https://developers.cloudflare.com/pages/configuration/redirects/)
- 本 repo migration roadmap: `docs/research/2026-04-29-astro-migration-roadmap.md`
- Phase 1a 完成備忘（提到 source-of-truth 切換時點）
- Phase 1b 完成備忘（提到 archives/2007-09-19_facebook 已知圖檔修正）
