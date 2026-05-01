# Astro 遷移路線圖

**狀態：** Phase 0（POC）、Phase 1a、Phase 1b、Phase 2、Phase 3 已完成並 merge 進 main。後續 phase 待執行。

> **維護提示：** 每次完成一個 phase 並 merge 後，記得回來更新本檔的「狀態」與下方各 phase 的進度標記，避免 roadmap 與實際進度脫節。

**最終目標：** 用 Astro 取代現行 Next.js blog，保留全部 URL、內容與功能，並利用 Astro 內建的 image / fonts pipeline 取得既有 Next.js 沒做到的最佳化。

---

## 現況（Phase 0 完成後）

### 已驗證可行

- Astro 6.1 static output、TypeScript 全程
- Content Collections + `glob()` loader 讀現有 1400+ 篇繁中 markdown
- URL 結構 `/zh/`、`/zh/tech`、`/zh/life`、`/zh/archives`、`/zh/posts/<slug>`、`/zh/about`、`/zh/subscription`，根目錄 `/` 用 meta refresh 跳 `/zh/`
- 字型 self-hosted（Astro Fonts API + Google provider，Noto Sans/Serif TC）
- Code highlighting 用 Astro 預設 Shiki
- Build 1494 頁 ≈ 8.7s

### POC 範圍內**未做**（要在後續 phase 完成）

- ja / en 三語言內容、語言 fallback、語言切換 UI
- 圖片處理（`<img>` 在 build 後是破圖）
- RSS feeds（zh/ja/en + tech/life/shorts，共 6 隻）
- Sitemap、OG meta、canonical、其他 SEO metadata
- 深色模式
- 其他根目錄 redirect（`/tech`、`/posts/...` 等到 `/zh/...`）

### POC 採用的暫時 workaround（後續要清掉）

- `astro.config.ts` 內 `passthroughImageService` + 自訂 Vite plugin `ignorePublicContentImages` — 把 markdown 內的 `images/*` 相對路徑 import 全 stub 成空模組，純粹是為了讓 build 不在 asset resolve 時掛掉。Phase 1b 取代。
- `lib/posts.ts` 的 `toMeta()` 對 `entry.id` 與 `entry.filePath` 都做 fallback 解析，並 silently skip 無法解析的 entry。Phase 1a 把內容搬進 `src/content/posts/` 後，`entry.filePath` 會更穩定，可以收斂這段。

### POC reviewer 留下的小 follow-up

- `lib/posts.ts` 的 `getAllPosts()` 加 slug 唯一性 assertion
- `Astro.params.locale!` non-null assertion 散落各 page，加 ja/en 時抽 helper

---

## Phase 路線圖

每個 phase 都產出獨立可 merge 的 branch，皆有自己的 spec/plan 文件。

### Phase 1a — 內容複製到 Astro 端 ✅ 已完成（2026-04-30）

**完成 commits：** `1801c84`（feat 主體）、`6063dea`（comment fix）。spec：`docs/superpowers/specs/2026-04-30-phase-1a-content-copy-design.md`，plan：`docs/superpowers/plans/2026-04-30-phase-1a-content-copy.md`。

**完成備忘：** marker 改用 `'src/content/posts/'`（無前導斜線），因新 loader base 下 `entry.filePath` 是 project-relative 而非絕對路徑。slug 唯一性 assertion 已加入 `getAllPosts()`。1494 頁、3861 個 content 檔案、無 duplicate slugs。**Astro 端 `src/content/posts/` 從此為新 source of truth**，`public/posts/` 留待 Phase 6 清掉。

**目標：** 把 markdown 與圖片**複製**（非搬移）到 `astro/src/content/posts/`，為 Phase 1b 的 image pipeline 鋪路；同時保持 Next.js 端完全不動。

**為什麼是 `cp` 而不是 `mv`：**
- `mv` 會讓 Next.js 立刻壞掉（它直接讀 `public/posts/` 與 `/posts/...` URL serve 圖片）
- 改 Next.js 去讀新路徑需要動到 image URL rewrite、static asset 慣例等多處，遷移期間風險過大
- 用 symlink 在 Windows + git 行為不一致
- 直接 `cp`：兩邊都跑、Next.js prod 維持 100% 穩定，遷移風險全集中在 Astro 端

**範圍：**
- `cp -r public/posts/ astro/src/content/posts/`（一次性整批複製）
- 更新 `astro/src/content.config.ts` 的 glob `base` 指到 `./src/content/posts`（原本是 `../public/posts`）
- 更新 `astro/src/lib/posts.ts` 的 `parsePathSegments` 偵測新路徑前綴
- Build 仍要保持綠燈、URL 結構不變、所有頁面內容一致

**Source 歸屬與同步策略：**
- Phase 1a 完成的瞬間 → **`astro/src/content/posts/` 成為新 source of truth**
- 遷移期間（Phase 1–5）若有新文章或修改，**只寫到新位置**
- 不寫一個 sync script — 寫了反而誘惑去改 `public/posts/`，破壞 source 唯一性
- Phase 6 切換上線前做一次 `diff -r public/posts/ astro/src/content/posts/` 確認沒漏掉
- 如果遷移期間 Next.js 端的某篇 prod 文章需要緊急修改：先寫到新 source，再手動 `cp` 過去 `public/posts/`，commit 寫清楚是 hotfix 同步

**驗收：**
- 1494+ 頁 Astro build 通過
- Next.js `npm run build` 也仍通過、output 不變
- 抽樣首頁、tech、life、archives、5 篇文章 — Astro 結果跟 Phase 0 一致
- 不動圖片邏輯（Astro 端仍然是破圖，Phase 1b 處理）
- `git diff` 應顯示為「新增 ~1400 個檔案」而非 rename，這是預期行為

**相依：** 無（POC 已完成）

**風險：** 低。複製操作邏輯單純；唯一要注意的是「source 寫在哪」這條紀律。

**最終清理：** Phase 6 切換時，`rm -rf public/posts/`（連同其他 Next.js 程式一併刪除）。

### Phase 1b — 圖片 pipeline ✅ 已完成（2026-05-01）

**完成 commits：** `f01c151`、`f55b1c5`、`4f574ec`、`e9db0a2`、`ccdaf83`、`e6c7b65`、`ef22f1d`、`1c9c7fe`、`9be90b0`、`e017c65`。spec：`docs/superpowers/specs/2026-04-30-phase-1b-image-pipeline-design.md`，plan：`docs/superpowers/plans/2026-04-30-phase-1b-image-pipeline.md`。

**完成備忘：**
- Build 時間：34.5s（warm cache）/ 約 60s（cold），1494 頁、3220 張圖 transform。Phase 0 基準 8.7s。
- GIF 處理路線：spike 確認 Astro 6.2 預設會把 GIF 轉 WebP 失去動畫；rehype `data-passthrough` attr 沒被 Astro 採納。最終實作 **客製 image service**（`src/lib/images/image-service.ts`）繼承 sharp service，僅在 input format=`gif` 時 passthrough 原始 buffer。比 plan 預想的 rehype 路線更乾淨。
- 三個 plan 預期外的 production fix：(1) 客製 image service 處理 GIF；(2) `remarkNormalizeImagePaths` plugin 把 bare path 加 `./` prefix（Vite 否則當 module specifier 找）；(3) `fixContentAssetsImporterPaths` Vite plugin workaround Astro 6.2 在 Windows 的 `%2F` URL 編碼 bug（`importer=` query 被 URLSearchParams 編碼導致 `fileURLToPath` throw）。後者 TODO 等 Astro upstream 修了再拔。
- POC workaround 已全清，`passthroughImageService` 與 `ignorePublicContentImages` Vite plugin 從 `astro.config.ts` 移除。
- `PostMeta.cover: ImageMetadata | null` 為 Phase 4 OG meta 與後續 styling 預備好基礎設施；列表頁已渲染 cover thumbnail（120px、lazy load、無 cover 時 layout 自動收起）。
- 26 個 unit test（vitest）：`find-in-entry-dir` 4 + `obsidian-remark` 6 + `cover` 7 + `remark-normalize-image-paths` 7 + `image-service` 2。
- 1 處 corpus 修正：`archives/2007-09-19_facebook/index.md` 引用的圖檔本來就遺失，刪掉壞引用。

**目標：** 把現有三種圖片語法接到 Astro image pipeline，產出 AVIF/WebP/響應式 srcset 與 hashed URL。

**範圍：**
- Frontmatter `cover` 改用 `image()` schema helper：`cover: image().optional()`，自動拿到型別與尺寸
- Markdown 內 `![alt](images/0.png)`：Astro Content Collections 對 collection 內的相對路徑會自動處理，零改動
- Markdown 內 `![[file.jpg]]`（Obsidian wiki link）：port 既有 `remarkCustomImageSyntax`（從 `lib/image.ts`）成 Astro remark plugin，把它轉成相對路徑語法給 Astro 處理
- Markdown 內 `![alt](/posts/...)`（絕對路徑）：寫一次性 codemod 把這類路徑改寫成相對路徑，或 build-time remark plugin 處理（先看實際數量決定）
- Cover 在列表頁與單篇頁都用 `<Image>` 渲染
- 移除 POC 的 `passthroughImageService` + `ignorePublicContentImages` Vite plugin
- Build 必須繼續用合理時間完成（image processing 會增加，需要實測）

**驗收：**
- 抽樣頁面 DevTools 確認：cover、內文圖片都有 srcset、AVIF/WebP 變體、檔名 hashed
- 之前破圖的頁面現在全有圖
- Build 時間在可接受範圍（暫定 < 60s 為門檻，超過再評估 cache 策略）

**相依：** Phase 1a

**風險：** 中。1400+ 篇文章 × 數張圖 = 數千張圖，build 時間會跳。`![[]]` plugin port + 絕對路徑 codemod 都要小心測試。

### Phase 2 — ja / en 雙語 ✅ 已完成（2026-05-01）

**完成 commits：** `5d99b63` ~ `eb90ff8`（14 個 commits 含 2 個 fix-up）。spec：`docs/superpowers/specs/2026-05-01-phase-2-i18n-design.md`，plan：`docs/superpowers/plans/2026-05-01-phase-2-i18n.md`。

**完成備忘：**
- 採方案 A：單一 collection、glob 收回 ja/en、locale 由檔名 suffix 推斷（`index.ja` / `index.en` / 其他 = zh）；不啟用 Astro 內建 `i18n` config。
- 缺翻譯不 fallback：未翻譯文章在 `/ja/posts/<slug>` 與 `/en/posts/<slug>` 不產生（404），跟 Next.js prod 行為一致。Archives 限定 zh，`/ja/archives`、`/en/archives` 不存在。
- LanguageSwitcher 聰明切換：在文章頁切到「有翻譯的 locale」跳對應翻譯篇；無翻譯則跳目標 locale 首頁。其他頁保留路徑換 prefix。實作用 `<details>`/`<summary>` 原生 dropdown，零 JS。
- 純 helpers（`inferLocaleFromFilename`、`computeAvailableLocales`、`buildLanguageLinks`）抽出到 `src/lib/locale-helpers.ts` 與 `src/lib/i18n.ts`，避免 vitest 對 `astro:content` 虛擬模組的解析問題（plan 原本要寫在 `posts.ts`，實作時發現 mock alias 對虛擬模組無效，pivot 到純模組更乾淨）。
- 19 個新單元測試（vitest）：`i18n` 6 + `locale-helpers` 8 + `language-switcher-links` 5；總計 45 個全綠。
- Build：1564 頁、32.18s（cold），Phase 1b 基準 34.5s。新增 60 篇翻譯與 ja/en 列表頁對 build 時間影響可忽略。
- hreflang 已完成（spec 原本歸屬 Phase 4 SEO，但因資料剛好齊備順手做了）：每篇 post 產出 `availableLocales` 對應的 `<link rel="alternate">` 加上 `x-default` 指向 zh。OG / Twitter card / sitemap / canonical 仍留給 Phase 4。

**目標：** 把現有 `index.en.md` 與 `index.ja.md` 翻譯文章接進 Astro，建立 `/ja/`、`/en/` 路由，與 Phase 0 預留的 `[locale]` 路由結構對接，含語言 fallback 與切換 UI。

**範圍：**
- Content Collection schema 拆出 locale 維度（`locale: 'zh' | 'ja' | 'en'`），或拆成多 collection
- Glob pattern 收回 Phase 0 排除的 `index.en.md` / `index.ja.md`
- `getStaticPaths` 在 `[locale]/...` 各 page 改成 `['zh', 'ja', 'en'].flatMap(...)`
- 語言 fallback：缺翻譯時 fallback 到 zh，並在頁面標示「未翻譯」或自動 redirect
- Header 加語言切換 UI（沿用 Next.js 的設計）
- URL helper（從 reviewer 建議出發）：`localePath(locale, ...segments)`

**驗收：**
- `/ja/` 與 `/en/` 列表頁、文章頁、分類頁全跑得起來
- 切換語言時 stay on same post（`<slug>` 對應到對應 locale 版本）
- 缺翻譯時 fallback 行為符合既有 Next.js（具體規則寫 spec 時再對齊）

**相依：** Phase 1a（內容已搬進 src）

**風險：** 中。設計決策多（fallback、URL 形狀、UI 細節），spec 階段要明確。

### Phase 3 — RSS ✅ 已完成（2026-05-02）

**完成 commits：** `bfa0140` ~ `87e89d6`（9 個 commits）。spec：`docs/superpowers/specs/2026-05-02-phase-3-rss-design.md`，plan：`docs/superpowers/plans/2026-05-02-phase-3-rss.md`。

**完成備忘：**
- 改用 `@astrojs/rss` 取代 Next.js 的 `feed` 套件。Item 內容用 Astro Container API（`experimental_AstroContainer.renderToString(Content)`）渲染，與頁面 HTML 一致，圖片自動套用 image pipeline 的 `/_astro/...webp` hashed URL。
- 修掉 Next.js prod 三個 RSS bug：(1) `<language>` 全部硬寫 `zh-tw`；(2) 無 prefix 的 4 隻 feed 三 locale 文章混雜每篇出現 3 次；(3) channel meta 與 item 語言不一致。現在每隻 feed `<language>` 對應 locale（zh-Hant / ja / en），item 全是該 locale 文章。
- 12 隻 feed 結構：3 個 `/rss/{zh,ja,en}.xml`（per-locale all）+ 6 個 `/rss/{zh,ja,en}/{tech,life}.xml`（per-locale per-category）+ 3 個 legacy alias `/rss.xml`、`/rss/{tech,life}.xml`（內容與 zh 對應 feed byte-identical）。
- shorts category 已不存在於 schema 與 corpus，正式不產生 shorts feed。原 Next.js prod 的 `/rss/{zh,ja,en}/shorts.xml` 在 Phase 6 切換時隨 Next.js 程式一併刪除（部署平台 redirect 規則屆時補）。
- 11 個新 unit test：`channelMeta` 4 + `buildFeedItems` 7。加 i18n 6 個新欄位的測試共 60 個 vitest 測試全綠（前一階段 45 + 新增 15）。
- Build 時間 32.63s（Phase 2 baseline 32.18s，+0.45s 在 5s 預算內）。Container API 渲染 12 feeds × ≤20 篇 ≈ 60 篇 unique full-content render。
- spec 原本把 markdown-it 列為「item 全文渲染」首選、Container API 為備案；plan 階段直接押 Container API（spec 自身列舉的 markdown-it 限制：hashed image URL 拿不到、`![[]]` 語法漏出，對 corpus 都實際存在）。Task 2 spike 驗證一篇 4 張圖文章渲染後，img 全是 `/_astro/...webp` hashed URL，路線確認可行。
- `<atom:link rel="self">` 在 `@astrojs/rss` 不會自動寫出，所以 legacy alias 與對應 zh feed 是 byte-identical 而非「除 self-link 外相同」。對 reader 的訂閱實務影響極小。

**目標：** 重現現行 6 隻 RSS feed（`/rss/zh.xml`、`/rss/ja.xml`、`/rss/en.xml`、`/rss/tech.xml`、`/rss/life.xml`、`/rss/shorts.xml`）。

**範圍：**
- Astro endpoint route（`src/pages/rss/[name].xml.ts` 之類）
- 沿用現有 `feed` 套件 或改用 `@astrojs/rss`
- 內容由 `getAllPosts` / 過濾函式提供（Phase 0 helpers 已就緒）

**驗收：**
- 6 隻 feed 都產出，feed validator 通過
- 與既有 prod RSS 結構一致（讓 reader 訂閱不掉）

**相依：** Phase 2（要有三語言內容）

**風險：** 低。內容形狀已準備好，只是輸出格式。

### Phase 4 — SEO 與 metadata

**目標：** 補齊 sitemap、OG meta、canonical、結構化資料。

**範圍：**
- `@astrojs/sitemap` 整合
- 每頁 OG / Twitter card meta（標題、描述、cover image）
- `<link rel="canonical">` 全頁
- 文章頁 JSON-LD（`Article` schema）

**驗收：**
- `sitemap-index.xml` 含全部頁面、語言交叉連結
- 抽樣頁 OG / Twitter card debugger 都正確
- Google Rich Results Test 通過

**相依：** Phase 1b（cover image 才能用在 OG）、Phase 2（多語言交叉連結）

**風險：** 低。多半是 metadata 補齊。

### Phase 5 — 深色模式與其他樣式精修

**目標：** 補回 Phase 0「夠用就好」版的樣式：深色模式、prose 細節（OpenType `palt`、列表間距、引用排版等與既有設計對齊）。

**範圍：**
- 深色模式：CSS variables + `prefers-color-scheme` + 手動切換（Header 按鈕，沿用 next-themes 概念但用 vanilla JS / Astro 慣例）
- 字型 OpenType features（`palt`、`vert` 等）
- Prose 細節（heading 與 paragraph 間距、引用樣式、表格、code block 行間等）對齊現有設計

**驗收：**
- 視覺與 prod blog 對比抽樣相似（不必像素級完全一致，POC 已偏離一些）
- 深色模式系統偏好 + 手動切換都正常

**相依：** Phase 1a

**風險：** 低。純前端調樣式。

### Phase 6 — 切換上線

**目標：** 把 Astro 從 `astro/` 子目錄推到 root，刪除 Next.js 程式，部署 pipeline 切過去。

**範圍：**
- 移動：`astro/*` → root，刪除 `app/`、`lib/`（Next 用的）、`next.config.*`、`tsconfig.json`（root 那份 Next 的）等
- 合併 `astro/package.json` 與 root `package.json`
- 部署平台設定切換（Cloudflare Pages 的 build command、framework preset）
- 根目錄非 `/zh` 路徑 redirect 整理：`/tech`、`/life`、`/archives`、`/posts/<slug>`、`/about`、`/subscription`、`/about`、`/rss/*` 都應該 redirect 到對應 `/zh/...`。POC 只做了 `/` → `/zh/`，這個 phase 補齊。
  - 用部署平台的 `_redirects`（Cloudflare Pages）或對應檔案，避免每個 redirect 都產一個 HTML 檔。

**驗收：**
- 站台可在 yurenju.blog 正常 serve（先用 staging URL 驗）
- 既有所有 prod URL 都還能打得到（包含舊 Next 的 redirect 規則）
- Search Console 沒有 404 暴增

**相依：** Phase 1–5 全部完成

**風險：** 中高。部署 pipeline 切換會碰到實際環境問題；舊 URL 收斂要測徹底，不然 SEO 會掉。

---

## 未決問題 / TBD

- **部署平台**：是否仍用 Cloudflare Pages，還是趁機評估 Vercel / Netlify？影響 redirect 設定形式（`_redirects` vs `vercel.json` vs `netlify.toml`）。
- **Build 時間預算**：Phase 1b 開始 image processing，build 時間會明顯上升；要不要設 cache 策略（譬如 `@astrojs/markdoc` style local cache）。
- **Bear / Obsidian export 慣例是否要正規化**：2025+ 文章 frontmatter 缺 title/date、檔名為文章標題；要不要寫一次性 normalizer 把所有 markdown 拉齊到「`index.md` + 完整 frontmatter」格式？這會讓後續維護更乾淨，但是一次性大 diff。
- **shorts 分類**：現行 RSS 有 `shorts.xml`，但內容資料夾結構不清楚，Phase 3 之前要先釐清來源。
- **是否保留 `[locale]/about` 與 `subscription` 路由**：兩頁在所有語言內容相同，可考慮放單一 locale 或加 locale fallback 邏輯處理。

---

## 給未來 Claude 的提醒

- **不要把這份 roadmap 當成 spec**。每個 phase 開工時要走完整 brainstorming → spec → plan → 實作流程。這份只是「下一步該做什麼」的目錄。
- **每個 phase 都先 merge 上 main 再開下一個**。避免長 branch 累積 conflict。
- **遇到 schema / glob loader 邊界問題**，回頭看 POC 學到的事：先補偵測與 warn，不要 silently skip；該 throw 的就 throw、該放寬的就放寬，但 markdown 內容本身不要動（除非有 normalizer phase）。
