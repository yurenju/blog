# 實作計畫

## 參考文件

**PRD 文件路徑：** `docs/specs/2026-02-07-post-archiving/prd.md`
**研究文件路徑：** `docs/research/2026-02-07-post-archiving-and-directory-restructure.md`

## 任務概要

- [ ] 修改文章讀取邏輯支援兩層目錄結構
- [ ] 撰寫並執行遷移腳本
- [ ] 修改文章列表頁面過濾歸檔文章
- [ ] 新增 Archives 頁面與分類歸檔頁面
- [ ] 在列表底部加入歸檔入口連結
- [ ] 執行驗收測試
- [ ] 更新專案文件

## 任務細節

### 修改文章讀取邏輯支援兩層目錄結構

**實作要點**
- 修改 `lib/posts.ts` 的 `getAllPostMetadata()` 函式，從一層目錄掃描改為兩層掃描：先讀取 `public/posts/` 下的分組目錄（如 `archives/`、`2020/`～`2026/`），再讀取各分組目錄下的文章目錄
- 在 `PostMetadata` interface 新增 `group: string` 欄位，記錄該文章所屬的分組目錄名稱（如 `"archives"`、`"2026"`）
- 在 `PostData` type 新增 `archived: boolean` 欄位，根據 `group` 是否為 `"archives"` 來判定
- 修改 `getPostData()` 函式，讓它能接收並傳遞 `archived` 資訊。由於 `getPostData()` 目前只接收 `filePath`，需要一種方式將 `group` 資訊傳遞下去。建議方案：在 `PostMetadata` 中保存 `group`，然後在呼叫 `getPostData()` 的地方從 metadata 取得 `group` 資訊，或者在 `getPostData()` 中從 `filePath` 推算 `group`（`filePath` 會包含分組目錄路徑）
- 確保跳過不含 `.md` 檔案的子目錄（如文章內的 `assets/` 目錄），避免誤判
- 確保空的分組目錄不會導致錯誤
- 修改 `getPostsByLocale()`、`fetchCategoryPosts()` 等函式，在回傳 `PostData` 時包含 `archived` 欄位

**相關檔案**
- `lib/posts.ts` - 核心文章管理邏輯，主要修改目標

**完成檢查**
- 在尚未執行遷移腳本的情況下，手動建立一個測試用的兩層結構（如 `public/posts/test-group/2026-02-06_the-door-opened-by-openclaw/`），執行 `npm run build` 確認能正確讀取
- 確認 `PostData` 的 `archived` 欄位根據分組目錄名稱正確設定

**實作備註**
<!-- 執行過程中填寫重要的技術決策、障礙和需要傳遞的上下文 -->

---

### 撰寫並執行遷移腳本

**實作要點**
- 建立遷移腳本 `scripts/migrate-posts.ts`，負責將 `public/posts/` 下的所有文章目錄搬遷到分組目錄中
- 遷移邏輯：
  - 在 `public/posts/` 下建立分組目錄：`archives/`、`2020/`、`2021/`、`2022/`、`2023/`、`2024/`、`2025/`、`2026/`
  - 掃描所有現有文章目錄，根據目錄名稱的日期前綴（`YYYY-MM-DD`）判斷年份
  - 2019 年（含）以前的文章 → 移入 `archives/`
  - 2020 年（含）以後的文章 → 移入對應年份目錄
- 腳本應先列出預計搬遷的統計（多少篇歸檔、各年份多少篇），確認無誤後再執行搬遷
- 搬遷使用 `fs.promises.rename()`（同一磁碟分區內的移動等同改名，速度極快）
- 腳本執行方式：`npx tsx scripts/migrate-posts.ts`

**相關檔案**
- `scripts/migrate-posts.ts` - 新建的遷移腳本
- `public/posts/` - 被搬遷的文章目錄

**完成檢查**
- 執行腳本後，確認 `public/posts/` 下只有分組目錄（`archives/`、`2020/`～`2026/`），不再有文章目錄直接平鋪
- 確認 `archives/` 下有約 1,396 個文章目錄
- 執行 `npm run build` 確認建置成功，所有頁面正常產生

**實作備註**
<!-- 執行過程中填寫重要的技術決策、障礙和需要傳遞的上下文 -->

---

### 修改文章列表頁面過濾歸檔文章

**實作要點**
- 修改 `lib/posts.ts` 新增 `getActivePostsByLocale()` 函式（或在 `getPostsByLocale()` 加入 `includeArchived` 參數），用於取得排除歸檔文章的文章列表
- 新增 `getArchivedPostsByLocale()` 函式，只回傳歸檔文章
- 新增 `fetchArchivedCategoryPosts()` 函式（或在 `fetchCategoryPosts()` 加入 `archived` 參數），用於取得特定分類的歸檔文章
- 修改 `components/pages/PostsPage.tsx`，使用過濾後的文章列表（排除歸檔文章）
- 修改 `components/pages/CategoryPage.tsx`，使用過濾後的文章列表（排除歸檔文章）
- 確保 `getPostCountByLocale()` 和 `getPostCountByCategoryAndLocale()` 也排除歸檔文章（這些用於 `LanguageNotice` 元件的文章數量顯示）

**相關檔案**
- `lib/posts.ts` - 新增過濾函式
- `components/pages/PostsPage.tsx` - 修改為只顯示非歸檔文章
- `components/pages/CategoryPage.tsx` - 修改為只顯示非歸檔文章

**完成檢查**
- 執行 `npm run dev` 開啟開發伺服器，瀏覽 `/zh/posts` 確認只顯示 2020 年以後的文章
- 瀏覽 `/zh/tech` 和 `/zh/life` 確認也只顯示非歸檔文章

**實作備註**
<!-- 執行過程中填寫重要的技術決策、障礙和需要傳遞的上下文 -->

---

### 新增 Archives 頁面與分類歸檔頁面

**實作要點**
- 新增多語言翻譯字串：在 `lib/i18n/translations.ts` 的 `Translations` type 和各語言物件中加入 archives 相關翻譯
  - `archives.title`：「歸檔文章」（zh）、「アーカイブ」（ja）、「Archives」（en）
  - `archives.viewArchived`：「查看歸檔文章」（zh）、「アーカイブ記事を見る」（ja）、「View archived posts」（en）
  - `archives.moreCategoryArchived`：「更多歸檔文章」（zh）、「その他のアーカイブ記事」（ja）、「More archived posts」（en）
- 新增 Archives 主頁面路由：
  - `app/archives/page.tsx` - redirect 到 `/zh/archives`（與現有 `/posts` → `/zh/posts` 的模式一致）
  - `app/[locale]/archives/page.tsx` - Archives 主頁面，列出所有歸檔文章
- 新增分類歸檔頁面路由：
  - `app/[locale]/archives/tech/page.tsx` - tech 分類歸檔文章
  - `app/[locale]/archives/life/page.tsx` - life 分類歸檔文章
- 建立 `components/pages/ArchivesPage.tsx`，使用現有 `PostsList` 元件渲染歸檔文章列表
- 頁面結構應與現有 `PostsPage` 和 `CategoryPage` 一致（包含 `Navbar`、`LanguageNotice`）
- 為每個新頁面新增 `generateMetadata()` 以產生正確的 SEO metadata

**相關檔案**
- `lib/i18n/translations.ts` - 新增翻譯字串
- `app/archives/page.tsx` - 新建，redirect 頁面
- `app/[locale]/archives/page.tsx` - 新建，Archives 主頁面
- `app/[locale]/archives/tech/page.tsx` - 新建，tech 歸檔頁面
- `app/[locale]/archives/life/page.tsx` - 新建，life 歸檔頁面
- `components/pages/ArchivesPage.tsx` - 新建，Archives 頁面元件

**完成檢查**
- 瀏覽 `/archives` 確認 redirect 到 `/zh/archives`
- 瀏覽 `/zh/archives` 確認列出所有歸檔文章，按年份分組顯示
- 瀏覽 `/ja/archives` 和 `/en/archives` 確認多語言正確
- 瀏覽 `/zh/archives/tech` 和 `/zh/archives/life` 確認分類歸檔頁面正確篩選

**實作備註**
<!-- 執行過程中填寫重要的技術決策、障礙和需要傳遞的上下文 -->

---

### 在列表底部加入歸檔入口連結

**實作要點**
- 修改 `components/pages/PostsPage.tsx`，在 `PostsList` 元件之後（`LanguageNotice` 之前或之後）加入歸檔入口連結，連結到 `/[locale]/archives`
- 修改 `components/pages/CategoryPage.tsx`，在列表底部加入分類歸檔入口連結，連結到 `/[locale]/archives/[category]`
- 入口連結的樣式應與列表有所區隔但不過於搶眼，建議使用 `text-muted-foreground` 搭配 hover 效果
- 使用翻譯字串：
  - 主列表：「查看歸檔文章」/ 「アーカイブ記事を見る」/「View archived posts」
  - 分類頁面：「更多歸檔文章」/「その他のアーカイブ記事」/「More archived posts」

**相關檔案**
- `components/pages/PostsPage.tsx` - 加入 Archives 入口連結
- `components/pages/CategoryPage.tsx` - 加入分類歸檔入口連結

**完成檢查**
- 瀏覽 `/zh/posts` 確認底部有「查看歸檔文章」連結，點擊後導向 `/zh/archives`
- 瀏覽 `/zh/tech` 確認底部有「更多歸檔文章」連結，點擊後導向 `/zh/archives/tech`
- 切換語言確認連結文案正確顯示

**實作備註**
<!-- 執行過程中填寫重要的技術決策、障礙和需要傳遞的上下文 -->

---

### 執行驗收測試

**實作要點**
- 使用 AI 讀取 acceptance.feature 檔案
- 透過指令或 MCP 瀏覽器操作執行每個場景
- 驗證所有場景通過並記錄結果
- 如發現問題，記錄詳細的錯誤資訊和重現步驟

**相關檔案**
- `docs/specs/2026-02-07-post-archiving/acceptance.feature` - Gherkin 格式的驗收測試場景
- `docs/specs/2026-02-07-post-archiving/acceptance-report.md` - 詳細的驗收測試執行報告（執行時生成）

**實作備註**
<!-- 執行過程中填寫 -->

---

### 更新專案文件

**實作要點**
- 審查 README.md，根據新功能更新使用說明和功能清單
- 審查 CLAUDE.md，更新專案架構和技術考量說明
  - 更新 `public/posts/` 的目錄結構說明（從單層改為兩層分組目錄）
  - 新增 Archives 相關路由說明
  - 更新 `PostData` type 的欄位說明（新增 `archived`）
- 審查其他專案層級文件（如 API 文件、部署指南、貢獻指南等）
- 注意文件長度控制：適時摘要舊內容，抽象化技術細節
- 確保所有程式碼範例和指令都是最新且可執行的
- **注意**：不需要更新 docs/research 和 docs/specs 目錄中的歷史文件

**相關檔案**
- `README.md` - 專案主要說明文件
- `CLAUDE.md` - AI 助手的專案指引文件
- 其他專案層級的 `.md` 文件（根據實際需求識別）

**實作備註**
<!-- 執行過程中填寫 -->

---

## 實作參考資訊

### 來自研究文件的技術洞察
> **文件路徑：** `docs/research/2026-02-07-post-archiving-and-directory-restructure.md`

- **兩層掃描的程式碼模式**：研究文件提供了 `getAllPostMetadata()` 改為兩層掃描的具體範例，使用巢狀 `Promise.all()` 先遍歷分組目錄再遍歷文章目錄
- **Slug 與路徑完全獨立**：slug 來源優先順序為 frontmatter `slug` → 中文主檔案 `slug` → 目錄名稱，因此搬遷後 URL 不受影響
- **歸檔資訊攜帶方式**：在 `PostMetadata` 加入 `group: string`，在 `PostData` 加入 `archived: boolean`，歸檔判定基於 `group === "archives"`
- **文章數量統計**：Archives 1,396 篇（2000-2019）、主列表 90 篇（2020-2026），2004-2007 年間最為密集（共 987 篇）
- **邊緣情況**：需注意文章目錄中的 `assets/` 子目錄不被誤認為文章目錄（檢查是否含 `.md` 檔案）、空分組目錄不應報錯、Markdown 中使用絕對路徑引用圖片的情況（如 `/posts/slug/images/photo.jpg`）
- **圖片路徑不受影響**：相對路徑圖片引用（如 `./assets/photo.jpg`）不會因為加入分組目錄而斷掉，因為它們相對於 Markdown 文件的位置。但絕對路徑引用（如 `/posts/2024-01-01_title/images/photo.jpg`）不會受到影響，因為 `public/posts/` 下的靜態檔案是由 Next.js 提供

### 來自 PRD 的實作細節
> **文件路徑：** 參考上方「參考文件」章節

- **歸檔判定規則**：基於文章所在的分組目錄名稱（`archives`），而非文章日期
- **URL 不變性**：所有文章的 URL 路徑必須維持 `/posts/{slug}` 格式不變
- **Archives 頁面 URL 方案**：頂層路由 `/archives`、`/archives/tech`、`/archives/life`，搭配 locale 前綴 `/[locale]/archives`
- **Archives 入口連結位置**：位於文章列表最後一個年份區塊之後
- **設計考量**：Archives 頁面使用現有 `PostsList` 元件渲染，視覺風格與主列表一致
- **非目標明確排除**：不提供手動歸檔標記、不做搜尋功能、不分頁、不修改導覽列、archives 目錄內部不再按年份細分

### 關鍵技術決策
- **分組目錄名稱自由命名**：分組目錄可以是任意名稱（年份或 `archives`），程式遍歷時自動略過這一層，對上層應用透明
- **歸檔判定使用目錄名稱而非日期**：這樣設計讓未來可以靈活調整歸檔規則（例如把某個年份從歸檔移出），只需搬移目錄即可
- **RSS feed 保持現有邏輯不變**：RSS 只取最新 20 篇文章（`slice(0, 20)`），由於歸檔文章都是舊文章，不會出現在 RSS 中，因此 RSS 邏輯不需要特別修改
- **`generateStaticParams()` 自動正確運作**：靜態路由參數由 `getSingletonPostMetadata()` 產生，只要底層掃描邏輯正確，所有文章（含歸檔）都會被產生靜態頁面
- **現有路由模式**：根路徑（如 `/posts`、`/tech`）redirect 到 `/zh/posts`、`/zh/tech`，Archives 應遵循相同模式
