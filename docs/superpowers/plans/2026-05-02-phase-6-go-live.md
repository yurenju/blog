# Phase 6 切換上線實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目標：** 把 Astro 從 `astro/` 子目錄推到 repo root、刪除 Next.js code、寫 `_redirects` 規則、切換 Cloudflare Pages dashboard 設定，讓 yurenju.blog 由 Astro 對外服務。

**架構：** 單一階段切換（spec Section 1：方案 B）。phase-6-go-live branch 上 3 個 commit（移除 Next.js → 搬移 Astro → 加 `_redirects`），merge 前在 dashboard 改設定，merge 後驗證、24 小時無 critical issue 後再補 commit 4 更新 roadmap。

**技術堆疊：** Astro 6.2、Cloudflare Pages（Build system v3、Node 22）、git mv、靜態 HTML 部署。

---

## File 結構（變動後 root layout）

切換完成後 root 的結構（Phase 5 的 `astro/` 內容直接放到 root）：

```
.
├── src/
│   ├── components/
│   ├── content/posts/      # 1500+ markdown
│   ├── layouts/
│   ├── lib/
│   ├── pages/[locale]/
│   ├── static-pages/
│   └── styles/
├── public/
│   ├── _redirects          # 新增
│   └── logo.jpg
├── docs/                   # 不動
├── .claude/                # 不動
├── astro.config.ts
├── package.json            # name: "blog"
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore              # 改寫
├── .nvmrc                  # 改 22
├── CLAUDE.md               # 更新 Commands / Architecture 章節
├── LICENSE
└── README.md               # 不動
```

被刪除的目錄／檔案見 Task 2。

---

## Task 1: 建立 phase-6-go-live branch

**Files:**
- 無檔案變更，只切 branch

- [ ] **Step 1: 確認當前在 main 且 working tree 乾淨**

Run:
```bash
git status
```
Expected: `On branch main` + `nothing to commit, working tree clean`

- [ ] **Step 2: 確認 main 跟 origin/main 同步（或起碼自己 ahead，不能 behind）**

Run:
```bash
git fetch origin && git log --oneline origin/main..main | head
```
Expected: 列出 local commits ahead of origin（OK），或無輸出（同步）。如果 origin ahead 要先 pull。

- [ ] **Step 3: 建立並切到 phase-6-go-live branch**

Run:
```bash
git checkout -b phase-6-go-live
```
Expected: `Switched to a new branch 'phase-6-go-live'`

---

## Task 2: Commit 1 — 刪除 Next.js code 與 obsolete public/ assets

**Files:**
- Delete: `app/`, `lib/`, `components/`, `hooks/`, `scripts/`
- Delete: `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `components.json`, `next-env.d.ts`, `eslint.config.mjs`, `.cursorrules`
- Delete: `package.json`, `tsconfig.json`, `package-lock.json`
- Delete: `public/posts/`, `public/pages/`, `public/rss/`, `public/rss.xml`, `public/logo.jpg`, `public/favicon.ico`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`
- Untracked rm: `tsconfig.tsbuildinfo`, `build-output.log`, `nul`, `.next/`, `out/`

- [ ] **Step 1: 刪除 Next.js source 目錄**

Run:
```bash
git rm -r app lib components hooks scripts
```
Expected: 列出每個被刪的檔案，最後總數約 30+ 個檔案。

- [ ] **Step 2: 刪除 root config 檔（next + 共用）**

Run:
```bash
git rm next.config.ts tailwind.config.ts postcss.config.mjs components.json next-env.d.ts eslint.config.mjs .cursorrules
git rm package.json tsconfig.json package-lock.json
```
Expected: 每個檔案 `rm '...'` 列出。

- [ ] **Step 3: 刪除 root public/ 全部內容**

Run:
```bash
git rm -r public/posts public/pages public/rss public/rss.xml
git rm public/logo.jpg public/favicon.ico public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```
Expected: 約 1500+ 個檔案被刪除（主要是 `public/posts/` 內的 markdown）。

- [ ] **Step 4: 清掉 untracked build artifacts**

Run:
```bash
rm -rf .next out tsconfig.tsbuildinfo build-output.log nul
```
Expected: 無輸出（這些檔案可能不存在，rm -rf 不會 fail）。

- [ ] **Step 5: 確認 astro/ 子目錄完全沒被動到**

Run:
```bash
ls astro/ && cd astro && ls src/content/posts | head
```
Expected: 看到 astro/ 內容完整（src、public、astro.config.ts 等都在），`src/content/posts/` 列出年份目錄。

- [ ] **Step 6: 驗證 astro/ 仍能 build**

Run:
```bash
cd astro && npm run build 2>&1 | tail -3
```
Expected: `Complete!` 訊息，1564 pages built。

- [ ] **Step 7: 回到 root 看 staged changes 摘要**

Run:
```bash
cd .. && git status | head -20 && git diff --cached --stat | tail -5
```
Expected: 大量 deleted files，沒有 modified/added。

- [ ] **Step 8: Commit**

Run:
```bash
git commit -m "$(cat <<'EOF'
chore: remove Next.js code and obsolete public/ assets

Clears the way for Astro to take over the repo root in the next commit.
Removes:

- Next.js app router source: app/, lib/, components/, hooks/, scripts/
- Next.js root configs: next.config.ts, tailwind.config.ts,
  postcss.config.mjs, components.json, next-env.d.ts, eslint.config.mjs,
  .cursorrules
- Root package.json / tsconfig.json / package-lock.json (Astro's
  versions take their place in the next commit)
- public/posts/ (Phase 1a's source-of-truth shifted to
  astro/src/content/posts/; diff confirmed parity except line endings)
- public/pages/ (migrated to astro/src/static-pages/)
- public/rss/, public/rss.xml (Astro produces these via @astrojs/rss)
- public/{logo.jpg, favicon.ico, *.svg} (logo will come from
  astro/public/; favicon left for future redesign; demo SVGs unused)

Astro side under astro/ is untouched and still builds.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: commit 成功，列出 ~1550 個 deletions。

- [ ] **Step 9: 驗證 commit message 跟 file count**

Run:
```bash
git log -1 --stat | tail -5
```
Expected: 看到 deletions 數量、commit message 第一行 `chore: remove Next.js code and obsolete public/ assets`。

---

## Task 3: Commit 2 — 把 Astro 搬到 repo root

**Files:**
- Move: `astro/src/` → `./src/`
- Move: `astro/public/` → `./public/`
- Move: `astro/astro.config.ts`, `astro/package.json`, `astro/package-lock.json`, `astro/tsconfig.json`, `astro/vitest.config.ts` → `./`
- Modify: `package.json` (name: "blog-astro" → "blog")
- Create / Modify: `.gitignore`
- Modify: `.nvmrc` (v24.15.0 → 22)
- Modify: `CLAUDE.md` (Commands + Architecture 章節)

- [ ] **Step 1: 用 git mv 把 astro/src 跟 astro/public 搬到 root**

Run:
```bash
git mv astro/src ./src
git mv astro/public ./public
```
Expected: 無輸出（git mv 安靜成功）。git 會記錄 1500+ 個檔案的 rename。

- [ ] **Step 2: 把 astro/ 下的 5 個 config 檔搬到 root**

Run:
```bash
git mv astro/astro.config.ts astro/package.json astro/package-lock.json astro/tsconfig.json astro/vitest.config.ts .
```
Expected: 無輸出。

- [ ] **Step 3: 刪掉空的 astro/ 子目錄**

Run:
```bash
rm -rf astro/node_modules astro/dist astro/.astro 2>/dev/null
rmdir astro
```
Expected: rmdir 成功（如果非空會 fail，這時要再 ls astro/ 看剩下什麼）。

- [ ] **Step 4: 修改 package.json `name` 欄位**

Edit `package.json`，把 `"name": "blog-astro"` 改成 `"name": "blog"`。其他欄位不動。

驗證：
```bash
grep '"name"' package.json
```
Expected: `"name": "blog",`

- [ ] **Step 5: 改寫 `.gitignore`**

整個檔案內容覆蓋為：

```gitignore
# Dependencies
node_modules

# Build artifacts
dist
.astro

# Coverage
coverage

# Environment
.env
.env.production
.env*

# OS
.DS_Store

# Vercel (legacy, in case ever)
.vercel

# Editor / tooling local
.playwright-mcp
.mcp.json
.claude/settings.local.json
.claude/worktrees/

# Misc local artifacts
*.tsbuildinfo
nul
fixtures
```

驗證：
```bash
cat .gitignore | head -20
```
Expected: 看到 `node_modules`、`dist`、`.astro` 在前幾行。

- [ ] **Step 6: 改 `.nvmrc`**

把檔案內容改成：
```
22
```
（原本是 `v24.15.0`）

驗證：
```bash
cat .nvmrc
```
Expected: `22`

- [ ] **Step 7: 更新 `CLAUDE.md` 的 Commands 章節**

定位 Commands 章節（### Development 之下），把：

```
### Development
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build for production (generates static export and RSS feeds)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### RSS Generation
- RSS feeds are automatically generated during build via prebuild script
- Manual generation: `npx tsx scripts/generate-rss.ts`
```

替換為：

```
### Development
- `npm run dev` - Start Astro dev server on http://localhost:4321
- `npm run build` - Build for production (static export to dist/, ~40s for 1564 pages)
- `npm run preview` - Serve the production build locally for verification
- `npm run check` - Run `astro check` (type checking + content collection validation)
- `npm run test` - Run vitest unit tests

### RSS Generation
- RSS feeds are produced at build time by `@astrojs/rss` endpoints in `src/pages/rss/`
- 12 feeds: 3 per-locale (`/rss/{zh,ja,en}.xml`), 6 per-locale-per-category, 3 legacy aliases (`/rss.xml`, `/rss/{tech,life}.xml`)
```

驗證：
```bash
grep -A3 "^### Development" CLAUDE.md | head -8
```
Expected: 看到新版 Astro 指令。

- [ ] **Step 8: 更新 `CLAUDE.md` 的 Architecture 章節**

定位 `## Architecture Overview` 章節，把開頭的「This is a Next.js 15 blog with static export...」段落跟整個「Core Structure」章節替換成 Astro 描述：

```markdown
## Architecture Overview

This is an Astro 6 static-export blog built for Traditional Chinese (zh-Hant) content with Japanese and English translations. Content lives in `src/content/posts/` as markdown files; output is fully static HTML for Cloudflare Pages.

### Core Structure
- **src/pages/** - Astro routes
  - `[locale]/` (zh / ja / en): home, tech, life, archives, about, subscription, posts/[slug]
  - `[locale]/archives/[category]/`: per-category zh-only archives lists
  - `rss/[name].xml.ts`: 12 RSS feed endpoints
  - `index.astro`: root meta refresh to `/zh/`
- **src/content/posts/** - 1500+ markdown source files in two-level grouped layout
  - Group dirs: `archives/` (pre-2020 zh-only), `2020/`-`2026/` (year-based)
  - Posts: `<group>/<dirname>/index.md` (and optional `index.ja.md` / `index.en.md`)
- **src/lib/** - Core helpers
  - `posts.ts`: post collection + meta + locale inheritance
  - `i18n.ts`: locale config, translation strings, language switcher links
  - `seo.ts`: canonical URL, JSON-LD article schema, OG image fallback
  - `images/`: cover resolution, custom Astro image service (preserves GIF), Obsidian wiki link remark plugin
  - `rss-feed.ts`: shared RSS item building logic
- **src/components/** - Astro components (Header, Footer, PostList, PostMeta, LanguageSwitcher, ThemeToggle, ...)
- **src/layouts/** - BaseLayout (HTML head, theme inline script, OG meta) + PostLayout (article wrapper, JSON-LD)
- **src/static-pages/** - About / Subscription markdown per locale
- **public/** - Static assets (logo.jpg, _redirects)
- **astro.config.ts** - Site config, sitemap integration, font API, image service, custom Vite plugin (Windows %2F bug workaround)
```

驗證：
```bash
grep -c "Astro" CLAUDE.md
```
Expected: 數字 ≥ 5（多處提到 Astro）。

- [ ] **Step 9: 跑 npm install**

Run:
```bash
rm -rf node_modules
npm install 2>&1 | tail -5
```
Expected: 成功，無 error。可能有些 deprecation warning（OK）。

- [ ] **Step 10: 跑 build 確認 root 也能 build**

Run:
```bash
rm -rf dist && npm run build 2>&1 | tail -5
```
Expected: `Complete!`，1564 pages built。

- [ ] **Step 11: 跑 tests**

Run:
```bash
npm run test 2>&1 | tail -8
```
Expected: `Tests  73 passed (73)` 全綠。

- [ ] **Step 12: 跑 typecheck**

Run:
```bash
npm run check 2>&1 | tail -10
```
Expected: 0 errors。warnings 可接受。

- [ ] **Step 13: 驗證 git rename detection**

Run:
```bash
git status | head -20
```
Expected: 大量 `renamed: astro/...  -> ...`，少量 modified（package.json、.gitignore、.nvmrc、CLAUDE.md）。

抽 1 個 markdown 確認 history 連續：
```bash
git log --follow --oneline src/content/posts/2026/2026-01-23_我與我的層層脈絡/index.ja.md | head -3
```
Expected: 至少 2-3 個 commit hash 顯示出來，包含 Phase 1a 之前的歷史。

- [ ] **Step 14: Commit**

Run:
```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: move Astro project to repo root

Hoists everything from astro/ to repo root so Cloudflare Pages can
deploy from / directly. Bulk operation via git mv preserves rename
detection so `git log --follow` still walks back through Phase 1a
history.

Adjustments:
- package.json name: "blog-astro" -> "blog" to keep the original repo
  identity
- .gitignore rewritten for an Astro tree (drops Next.js entries, adds
  dist/, .astro/)
- .nvmrc: v24.15.0 -> 22 to match Cloudflare Pages Build system v3
  default; local devs running Node 22 will be in lockstep with deploy
- CLAUDE.md Commands and Architecture sections rewritten for Astro
  (npm run dev/build/preview/check/test, src/content/posts/ layout,
  Astro-specific helpers and config)

`npm install`, `npm run build` (1564 pages), `npm run test` (73 pass),
and `npm run check` (0 errors) all verified from the new root.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: commit 成功，rename 統計清楚。

---

## Task 4: Commit 3 — 加 `public/_redirects`

**Files:**
- Create: `public/_redirects`

- [ ] **Step 1: 建立 `public/_redirects` 檔案**

寫入內容：

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

驗證：
```bash
cat public/_redirects
wc -l public/_redirects
```
Expected: 看到上面內容，行數約 11-13（含空行跟註解）。

- [ ] **Step 2: 跑 build 確認 _redirects copy 進 dist**

Run:
```bash
rm -rf dist && npm run build 2>&1 | tail -3
ls dist/_redirects && head -3 dist/_redirects
```
Expected: `dist/_redirects` 存在，內容跟 `public/_redirects` 一致。

- [ ] **Step 3: Commit**

Run:
```bash
git add public/_redirects
git commit -m "$(cat <<'EOF'
feat: add Cloudflare Pages _redirects for legacy URLs

Maps the bare-path Next.js routes (/, /tech, /life, /archives,
/archives/tech, /archives/life, /about, /subscription) and the legacy
post path /posts/<slug> to their /zh/ counterparts with 301. Astro
itself does not generate these bare-path routes (it only emits
/zh/, /ja/, /en/ trees), so without this file external links and
search engine indexes pointing at the old URLs would 404 after the
switch.

src/pages/index.astro's meta refresh stays in place for local
`npm run preview` parity since Astro preview does not process
_redirects.

shorts feeds (/rss/{zh,ja,en}/shorts.xml, /rss/shorts.xml) intentionally
not redirected — accepting 404, per spec scope.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: commit 成功。

---

## Task 5: Push branch + 確認 preview build（會失敗）

**Files:**
- 無檔案變動

- [ ] **Step 1: Push phase-6-go-live 到 GitHub**

Run:
```bash
git push -u origin phase-6-go-live
```
Expected: branch 推到 origin。

- [ ] **Step 2: 觀察 Cloudflare Pages 自動觸發的 preview build**

打開 Cloudflare Pages dashboard → Deployments tab。應該會看到 phase-6-go-live 對應的 preview deployment 開始 build。

Expected: build **失敗**（dashboard 還是 Next.js 設定，但 root 已沒有 Next.js code）。這是預期行為，不要嘗試修。

繼續 Task 6 改 dashboard。

---

## Task 6: 改 Cloudflare Pages dashboard 設定

**Files:**
- 無檔案變動（純 dashboard 操作）

> **這 task 全部是手動 dashboard 操作，無法腳本化。請依序執行。**

- [ ] **Step 1: 打開 Cloudflare Pages dashboard 對應的 yurenju.blog project**

URL: `https://dash.cloudflare.com/?to=/:account/pages/view/<project-name>`

- [ ] **Step 2: Settings → Builds & deployments → Build configurations → Edit**

修改下列欄位：

| 欄位 | 從 | 改成 |
|---|---|---|
| Framework preset | Next.js (Static HTML Export) | **Astro** |
| Build command | `next build` | `npm run build` |
| Build output directory | `out` | `dist` |
| Root directory | `/` | `/`（不變）|

點 Save。

- [ ] **Step 3: Settings → Builds & deployments → Build system → Edit version**

選 **Build system version 3**。儲存。

- [ ] **Step 4: Settings → Environment variables**

新增：
- `NODE_VERSION` = `22`

移除（如果存在）：
- 任何 `NEXT_*` 開頭
- 任何指向 `/.next` 的設定

- [ ] **Step 5: 確認 dashboard 設定正確**

回到 Settings 主頁複查上面五項都對。

完成後**直接接 Task 7**，不要拖太久（main 仍是 Next.js code，這刻起 main 任何 push 都會失敗）。

---

## Task 7: Merge phase-6 到 main + 部署驗證

**Files:**
- 無檔案變動（git merge + 部署觀察）

- [ ] **Step 1: 切回 main**

Run:
```bash
git checkout main
```
Expected: `Switched to branch 'main'`

- [ ] **Step 2: Merge phase-6-go-live**

Run:
```bash
git merge --no-ff phase-6-go-live -m "Merge phase-6-go-live: switch to Astro at repo root"
```
Expected: merge commit 建立成功，無 conflict。

- [ ] **Step 3: Push main**

Run:
```bash
git push origin main
```
Expected: push 成功，Cloudflare Pages 自動觸發 main build。

- [ ] **Step 4: 等 Cloudflare Pages main build 完成**

Dashboard → Deployments → 看 Production 那筆 build 跑到 `Success`。
Expected: 約 1-3 分鐘 build 完成（含 1564 pages）。

如果 build 失敗：
- 看 build log
- 常見問題：dashboard 設定漏改 → 回 Task 6
- Build system v3 + Node 22 升級踩雷 → 回 Task 6 把 Build system 改回 v2 + NODE_VERSION 改為 20，再 retry

- [ ] **Step 5: curl 抽樣驗證**

Run:
```bash
curl -I https://yurenju.blog/ 2>&1 | head -5
curl -I https://yurenju.blog/zh/ 2>&1 | head -5
curl -I https://yurenju.blog/zh/tech 2>&1 | head -5
curl -I https://yurenju.blog/tech 2>&1 | head -5
curl -I https://yurenju.blog/posts/2024-01-01_w3c-dids-redefining-identity-authority 2>&1 | head -5
curl -I https://yurenju.blog/rss/zh.xml 2>&1 | head -5
curl -I https://yurenju.blog/sitemap-index.xml 2>&1 | head -5
```

Expected：
- `/` → 301 + `Location: /zh/`
- `/zh/` → 200
- `/zh/tech` → 200
- `/tech` → 301 + `Location: /zh/tech`
- `/posts/2024-01-01_...` → 301 + `Location: /zh/posts/2024-01-01_...`
- `/rss/zh.xml` → 200 + `content-type: application/xml`
- `/sitemap-index.xml` → 200

- [ ] **Step 6: 瀏覽器抽樣驗證**

打開瀏覽器（無痕模式），抽下面 URL：

- `https://yurenju.blog/zh/` — 看 hero 是 logo + Yuren's Blog title + 描述 + 生活·技術 連結
- 切暗色模式 → reload → 預期保持暗色
- `https://yurenju.blog/zh/posts/2026-01-23_layers-of-context-and-me` — cover、images 都正常
- `https://yurenju.blog/zh/tech` — 底部「更多歸檔文章」連結 → 點擊跳到 `/zh/archives/tech`
- 切英文/日文 — 看 `/en/` `/ja/` 首頁正常

如果發現 critical 問題（white screen / 主要 URL 全 404）：

→ 回 Task 8 執行 instant rollback。

如果發現 minor 視覺問題：記下來之後 follow-up，繼續驗證。

- [ ] **Step 7: RSS reader 驗證**

把 `https://yurenju.blog/rss/zh.xml` 加到隨便一個 RSS reader（Feedly / NetNewsWire / Reeder）。
Expected: 看到最近 20 篇文章，標題正確、有圖（如有 cover）、發佈時間對。

---

## Task 8（條件分支）: 如果驗證失敗 — Instant Rollback

**Files:**
- 無檔案變動

> **只在 Task 7 Step 5/6/7 發現 critical 問題時執行**

- [ ] **Step 1: Cloudflare dashboard instant rollback**

Dashboard → Deployments → 找前一個 Production = `Success` 的 Next.js build → 點旁邊的 「Rollback to this deployment」按鈕。

Expected: 1 分鐘內 yurenju.blog 改 serve 上一個 Next.js 的靜態檔案。

- [ ] **Step 2: revert main commit**

Run:
```bash
git checkout main
git revert -m 1 HEAD
git push origin main
```
Expected: revert commit 推上去，Cloudflare 會自動 build。

(Build 仍會失敗因為 dashboard 是 Astro 設定但 code revert 回 Next.js — 但 prod URL 依然是 instant rollback 的 Next.js，使用者體驗 OK)

- [ ] **Step 3: 把 dashboard 改回 Next.js 設定**

回 Task 6 的反向操作：
- Framework preset → Next.js (Static HTML Export)
- Build command → `next build`
- Build output directory → `out`
- 移除 `NODE_VERSION=22`
- Build system version → 維持 v3 即可（Next.js 也能跑 v3）

完成後 main 重新 build 應該會成功。

- [ ] **Step 4: 調查問題**

從 phase-6-go-live branch 修問題，重跑 Task 5–7。

---

## Task 9: 24 小時無 critical issue 後 — Commit 4 更新 roadmap

**Files:**
- Modify: `docs/research/2026-04-29-astro-migration-roadmap.md`

- [ ] **Step 1: 確認 24 小時內無 critical issue**

時間 + 觀察：
- Cloudflare Pages → Analytics → 404 數量未爆增
- 個人測試：抽 5 條 URL 都 OK
- RSS subscriber 沒抱怨

如果有 minor issue 累積，先寫成 follow-up tasks，再進 step 2。

- [ ] **Step 2: 更新 migration roadmap 狀態**

Edit `docs/research/2026-04-29-astro-migration-roadmap.md`：

修改第 1-3 行的「狀態」欄：

從：
```
**狀態：** Phase 0（POC）、Phase 1a、Phase 1b、Phase 2、Phase 3、Phase 4、Phase 5 已完成並 merge 進 main。後續 phase 待執行。
```

改成：
```
**狀態：** 全部 Phase（0–6）已完成並 merge 進 main。Astro 已在 yurenju.blog 對外服務，Next.js 程式已從 repo 移除。
```

定位 Phase 6 章節（搜尋 `### Phase 6 — 切換上線`），把標題改成 `### Phase 6 — 切換上線 ✅ 已完成（YYYY-MM-DD）`，並在標題下加完成備忘段落（仿照 Phase 5 格式）：

```markdown
**完成 commits：** `<merge-commit-hash>`（合併 phase-6-go-live branch）。spec：`docs/superpowers/specs/2026-05-02-phase-6-go-live-design.md`，plan：`docs/superpowers/plans/2026-05-02-phase-6-go-live.md`。

**完成備忘：**
- 三個工作 commit + 一個 merge commit + 本次 docs commit。
- Cloudflare Pages dashboard 升 Build system v3、Framework preset 從 Next.js 換 Astro、output dir `out` → `dist`、新增 `NODE_VERSION=22` env var。
- `_redirects` 9 條 301 規則涵蓋根目錄到 `/zh/` 跳轉跟所有 Next.js root-level legacy URL。
- shorts feed (`/rss/{zh,ja,en}/shorts.xml`、`/rss/shorts.xml`) 接受 404，未做 redirect。
- favicon.ico 暫無，等之後重新設計。
- `git log --follow` 在 1500+ markdown 上能追到 Phase 1a 之前歷史，rename detection 成功。
- 部署後 24 小時 curl 抽樣 + 瀏覽器抽樣 + RSS reader 拉取無 critical issue。
```

驗證：
```bash
grep "Phase 6" docs/research/2026-04-29-astro-migration-roadmap.md | head
```
Expected: 看到 `### Phase 6 — 切換上線 ✅ 已完成` 標題。

- [ ] **Step 3: Commit + push**

Run:
```bash
git add docs/research/2026-04-29-astro-migration-roadmap.md
git commit -m "$(cat <<'EOF'
docs: mark Phase 6 complete in migration roadmap

Astro now lives at yurenju.blog. The migration started in Phase 0 (POC)
and ends here with Next.js code removed from the repo, the Astro build
serving production via Cloudflare Pages, and 24 hours of observation
without critical issues.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push origin main
```
Expected: commit + push 成功。Cloudflare 會 build 但只動到 docs，prod 沒實質變化。

---

## 執行注意事項

- Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 順序不能亂
- Task 5 push 後會看到 preview build 失敗，**不要試圖修**，直接接 Task 6
- Task 6 dashboard 改完後 5 分鐘內接 Task 7 merge，避免長時間留在「dashboard Astro / main 仍 Next.js」的不一致狀態
- Task 7 Step 5/6/7 發現 critical issue → 跳 Task 8 rollback；發現 minor issue → 記下繼續
- Task 9 等 24 小時觀察期過後再做

## 回頭檢查清單（self-review）

讀完 plan 全文確認：

- [x] 每個 task 都有 Files、Steps、commit、verify
- [x] 沒有 TBD/TODO/placeholder
- [x] 程式碼跟 commit message 對齊 spec
- [x] 提到的檔案路徑都跟 spec 一致
- [x] 預期失敗情境（Task 5 preview build fail、Task 8 rollback）有覆蓋
- [x] 手動 dashboard 操作明確標示「無法腳本化」
- [x] commit message body 一致用英文（程式碼／commit message 規範）
- [x] 章節標題、步驟敘述用繁體中文（CLAUDE.md 規範）
