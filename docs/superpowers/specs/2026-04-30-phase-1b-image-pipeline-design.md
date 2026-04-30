# Phase 1b — 圖片 pipeline 設計

**狀態：** Brainstorming 完成，待 plan。
**前置：** Phase 1a（內容已 `cp` 進 `astro/src/content/posts/`，已 merge 進 main）。
**所屬 roadmap：** `docs/research/2026-04-29-astro-migration-roadmap.md` 的 Phase 1b。

---

## 目標

把現行 corpus 內三種圖片語法接上 Astro image pipeline，產出 AVIF/WebP/響應式 srcset/hashed 檔名；同時清掉 Phase 0 為了讓 build 不掛而加的 workaround（`passthroughImageService` + `ignorePublicContentImages` Vite plugin）。

GIF 動畫保留原檔不轉，cover image 沿用 prod 行為（frontmatter 優先，否則抓內文第一張圖）。

## 範圍

### Corpus 觀察（決定設計的事實依據）

- `![alt](images/0.png)` 相對路徑：常見於舊 `index.md` 文章
- `![[file.jpg]]` Obsidian wiki link：577 處 / 250 檔，多在 2024+ Bear/Obsidian export 的 `<title>.md` 文章。**使用者持續用 Obsidian 寫作**，這語法不會消失，因此採 build-time remark plugin 而非一次性 codemod。
- `![alt](/posts/...)` 絕對路徑：corpus 內 0 處（roadmap 提及但實際不存在），不處理
- 圖片資產：~2,300 張（jpg/png/jpeg/JPG/webp 為大宗，gif 45 個，svg 1 個，mp4 1 個，無副檔名 4 個 archives 破檔）
- Post 目錄深度：最多 1 層子目錄（depth=1: 1614 檔、depth=2: 2247 檔、depth=3+: 0）

### 範圍內

- 移除 POC workaround：`passthroughImageService` 改回預設 sharp service；刪掉 `ignorePublicContentImages` Vite plugin
- 新增 remark plugin 把 `![[file.ext]]` 轉成 mdast image node
- 新增 cover 解析（frontmatter `cover` 優先，否則抓 body 第一張符合副檔名的圖）
- 列表頁 cover 改用 `<Image>` 元件渲染
- GIF / SVG / MP4 passthrough（不走 sharp transform，保留原檔）
- 文章內文 `![alt](images/...)` 直接吃 Astro Content Collections 預設 asset pipeline（無需自寫 plugin）

### 範圍外

- ja / en 翻譯版（glob 仍排除，由 Phase 2 自然接手）
- 站台預設 cover placeholder（後續再做）
- OG / Twitter card 用的 cover 處理（Phase 4）
- 一次性 codemod 改寫 source markdown
- prod blog 視覺細節對齊、深色模式（Phase 5）
- markdown source 內容變更

## 架構

新增三個 build-time 模組，集中放在 `astro/src/lib/images/`：

```
astro/src/lib/images/
  obsidian-remark.ts    -- remark plugin: ![[name]] → mdast image
  cover.ts              -- resolveCover(entry): frontmatter or first body image
  passthrough.ts        -- rehype plugin: gif/svg/mp4 不走 sharp
  find-in-entry-dir.ts  -- 共用 helper: 在 entry 目錄遞迴找 filename
```

`astro.config.ts` 改動：
- 移除 `passthroughImageService` import 與 `image.service` 設定（回到預設 sharp）
- 移除 `ignorePublicContentImages` Vite plugin 與 `vite.plugins`
- 註冊 `markdown.remarkPlugins` += `[obsidianRemark]`
- 註冊 `markdown.rehypePlugins` += `[passthroughGifSvg]`

`lib/posts.ts` 改動：
- `PostMeta` 加 `cover?: ImageMetadata`
- `toMeta` 改 async，呼叫 `resolveCover(entry)` 後寫入 `cover`
- `getAllPosts` 對應改 `await Promise.all(entries.map(toMeta))`

`content.config.ts` 改動：維持 `cover: z.string().optional()`，**不**改用 `image()` helper（理由見下）。

### 模組職責與介面

#### `obsidian-remark.ts`

remark plugin。輸入 mdast tree + vfile（含 source path），輸出改寫過 mdast。

**演算法：**
1. 從 `vfile.path` 推 entry 所在目錄 `dir`
2. 用 `findInEntryDir.buildIndex(dir)` 一次性建立 `filename → absolutePath` 索引（遞迴所有子目錄；corpus 觀察最多 1 層，遞迴成本可忽略）。**整個 plugin invocation 共用此索引**，不每個 match 重掃。
3. 用 `unist-util-visit` 走 `text` node，regex `/!\[\[(.+?)\]\]/g`
4. 對每個 match：
   - 在索引找 filename（大小寫敏感、跟 fs 一致）
   - 找到 → splice 成 mdast `image` node，`url` 為相對於 markdown 檔的相對路徑、`alt` 為 filename
   - 找不到 → `console.warn('[obsidian-images] not found: <name> in <entry>')`，**保留原文字節點**（遵守 roadmap「該 warn 就 warn」原則，不 silently 吞）
5. 一段 text 內可能多個 `![[]]`，splice 行為照搬既有 `lib/image.ts:remarkCustomImageSyntax`

#### `cover.ts`

```ts
export async function resolveCover(entry: PostEntry): Promise<ImageMetadata | null>
```

**模組頂層常數（build-time eager）：**
```ts
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/posts/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}'
);
```

**演算法：**
1. 若 `entry.data.cover` 存在：解成 project-absolute 路徑（基於 entry 目錄），查 `imageModules` → 載入 → return `ImageMetadata`。查不到 → warn + fallback 到 body scan
2. 否則掃 `entry.body`：regex 同時抓 `![alt](path)` 與 `![[name]]`（後者要再認一次因為 cover 解析跑在 markdown render 之前）。**取第一個符合副檔名 `.png/.jpg/.jpeg/.webp` 的 match**，副檔名比對小寫不分大小寫；`.gif/.svg/.mp4`/無副檔名/外部 URL（`http://`/`https://`/`//`/`/` 開頭）跳過繼續找下一個
3. 對候選路徑：
   - `![[name]]` → 用 `findInEntryDir` 索引找絕對路徑
   - `![](path)` → 直接拼 entry 目錄 + path（path 是相對路徑）
4. 查 `imageModules` 拿 `ImageMetadata`
5. 都沒有 → return `null`

**為什麼不用 `image()` schema helper：** 它只解 frontmatter 字面路徑、且強制要求 frontmatter 提供。而 corpus 0 篇有 `cover:` frontmatter，主要 source 永遠是 body scan。把兩條路徑都走自寫解析器以共用 `imageModules` 查詢、語意一致。未來若要全面改 frontmatter cover 模式，再評估切換。

#### `passthrough.ts`

rehype plugin。在 HTML 層攔截 `<img>`，若 src 副檔名為 `.gif/.svg/.mp4`：
- 把 src 改寫成「不走 sharp、走 Vite raw asset emit」的 URL（檔名仍要 hash 以避快取，但用 Astro asset emit API）
- mp4 雖然 1 個檔且 `<img>` 放影片必破，仍 passthrough；不為單一 14 年前 archives 檔寫特例

**Spike 任務（plan 階段先做）：** 確認 rehype plugin 能否搶在 Astro 內建 image transform 之前生效。若不行，fallback 路線是用 Astro `markdown.image` / `image.experimentalLayout` config 級的排除設定。

#### `find-in-entry-dir.ts`

```ts
export function buildIndex(dir: string): Map<string, string>  // filename → absolutePath
```

從 dir 開始 `fs.readdirSync` 遞迴所有子目錄，建索引。`obsidian-remark` 與 `cover.ts` 的 `![[]]` 解析共用此 helper，避免兩處實作分叉。

**重名處理：** 同一篇 entry 內若有兩個同名檔（e.g. `images/a.jpg` 與 `images/sub/a.jpg`），保留**第一個遇到**的（深度優先順序），warn 提示有重名。Obsidian 的 `![[]]` 語法本身就無法 disambiguate 同名檔，這是 source 端問題，不在 plugin 處理。

### 元件邊界與資料流

```
Markdown source (astro/src/content/posts/<group>/<dirname>/<title>.md)
        │
        ├─ frontmatter ─────────────────────────────┐
        │                                            │
        └─ body                                      │
              │                                      │
              ├─[remark phase]                       │
              │    obsidian-remark: ![[]] → image    │
              │    Astro built-in: image → asset import
              │                                      │
              ├─[mdast → hast]                       │
              │                                      │
              ├─[rehype phase]                       │
              │    passthrough: gif/svg/mp4 不走 sharp
              │                                      │
              └─[render to HTML w/ <Image> 變體]     │
                                                     │
PostMeta.cover ← resolveCover(entry) ←──────────────┘
        (frontmatter cover OR first body image w/ allowed ext)
        │
        └─ 列表頁 <Image> 渲染
```

## 驗收條件

**Build 健康度：**
- `cd astro && npm run build` 全綠、1494 頁不變、無 import resolve 錯誤
- 記錄 build 時間並寫進 roadmap 完成備忘（Phase 0 基準 8.7s）

**圖片實際輸出（DevTools 抽樣 5 篇）：**
- 樣本至少包含：純 `![[]]` 一篇、純 `![](images/)` 一篇、兩種混用一篇、含 GIF 一篇、無圖一篇
- PNG/JPG/JPEG/WEBP 內文圖應有 `srcset`、AVIF 與 WebP 變體、檔名 hashed、`width`/`height` attr
- GIF 應為原檔（非 webp 動圖）、檔名 hashed、動畫播放正常

**列表頁（首頁 / `/zh/tech` / `/zh/life` / `/zh/archives`）：**
- 有 cover 的文章 cover 走 sharp pipeline 有 srcset
- 無 cover 的文章 cover 區塊不撐空位

**邏輯正確性：**
- POC 破圖頁面全部有圖
- `![[]]` 找不到檔案有 warn log（造一個 fixture 驗）
- 測試新建一篇有 frontmatter `cover` → 用 frontmatter
- body 第一張是 GIF 的文章 → 跳過找下一張符合副檔名的圖

**Workaround 清乾淨：**
- `astro.config.ts` 不再含 `passthroughImageService`、`ignorePublicContentImages`
- `git grep ignorePublicContentImages astro/` 0 結果

## 風險與對策

| 風險 | 影響 | 對策 |
|---|---|---|
| Build 時間爆炸（2300+ 圖 sharp transform） | 開發體驗 | 先實測；超過 60s 再評估 cache 或拆 phase；不訂死門檻 |
| GIF passthrough rehype 跟 Astro 內建 image transform 時序衝突 | GIF 動畫壞 | Plan 階段先 spike；fallback 用 Astro config 排除 |
| Cover body scan 與 obsidian-remark `![[]]` 解析重複 | 邏輯分叉 | 抽 `findInEntryDir` helper 共用 |
| Windows 大小寫不敏感 vs CI Linux 敏感 | 平台間 build 差異 | 用 `fs.readdirSync` 實際檔名比對、不 toLowerCase；warn 印實際 case |
| 邊角檔（1 mp4 / 1 svg / 4 無副檔名 archives 破檔） | 個別頁面破圖 | 接受、不寫特例 |

## Phase 邊界（明確不做）

- 不動 markdown source 內容（不跑 codemod）
- 不處理 ja / en 翻譯版（Phase 2）
- 不做 OG / Twitter card cover（Phase 4）
- 不做站台 default placeholder
- 不動文章頁 / 列表頁的版型 styling，僅把 `<img>` → `<Image>` 並設 `sizes`

## 預期 plan 切分（給 writing-plans skill 預覽）

1. 移除 POC workaround、回到預設 sharp service（獨立 commit，先看 Astro 預設能 build 多少篇 / 哪裡掛）
2. 新增 `find-in-entry-dir` helper + `obsidian-remark` plugin
3. 新增 `cover.ts` + `PostMeta.cover` 整合
4. 列表頁 `<Image>` 改寫
5. GIF/SVG passthrough（spike + 實作）
6. 抽樣驗收 + roadmap 完成備忘更新

## 相依與後續

- **相依：** Phase 1a（已完成）
- **後續解鎖：** Phase 4 OG cover（用本 phase 的 `PostMeta.cover`）、Phase 2 ja/en（glob 收回後自動套用本 phase 的 plugin）
