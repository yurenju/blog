# Astro 遷移路線圖

**狀態：** Phase 0（POC）已完成並 merge 進 main。後續 phase 待執行。

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

### Phase 1a — 內容大遷移

**目標：** 把 markdown 與圖片從 `public/posts/` 搬進 `src/content/posts/`，為 Phase 1b 的 image pipeline 鋪路。

**範圍：**
- `git mv public/posts/ astro/src/content/posts/`（一次性大 mv）
- 更新 `astro/src/content.config.ts` 的 glob `base` 指到新位置
- 更新 `lib/posts.ts` 的 `parsePathSegments` 偵測新路徑前綴
- Build 仍要保持綠燈、URL 結構不變、所有頁面內容一致

**驗收：**
- 1494+ 頁 build 通過
- 抽樣首頁、tech、life、archives、5 篇文章 — 跟 Phase 0 結果一致
- `git log` 顯示 mv 是純 rename（`-M` 偵測到）
- 不動圖片邏輯（仍然是破圖）

**相依：** 無（POC 已完成）

**風險：** 低。是體力活、邏輯改動極小。Git rename detection 處理得當的話 history 不會斷。

### Phase 1b — 圖片 pipeline

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

### Phase 2 — ja / en 雙語

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

### Phase 3 — RSS

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
