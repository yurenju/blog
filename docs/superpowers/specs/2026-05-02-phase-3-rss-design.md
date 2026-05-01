# Phase 3 — RSS

**狀態：** Spec
**前置 Phase：** Phase 0、1a、1b、2（已 merge）
**對應 roadmap：** `docs/research/2026-04-29-astro-migration-roadmap.md` Phase 3

## 目標

用 `@astrojs/rss` 在 Astro 重做 12 隻 RSS feed，修掉 Next.js prod 既有的 `<language>` 硬寫與三語混雜 bug；每隻 feed 只裝對應 locale 的文章，最新 20 篇全文，排除 archives。Legacy 無 locale prefix 的 4 隻 feed 沿用既有 URL 但內容對齊 zh。

## 非目標（明確排除）

- shorts category（schema 已不存在，所有 prod 文章皆 tech/life）
- atom / json feed（沿用 Next.js 只 RSS 2.0）
- 完整每 locale author/email/copyright（沿用 site config 一致值）
- Feed icon、OPML、WebSub
- HTTP redirect 處理 legacy URL（直接寫實體檔，避免 RSS reader 處理 redirect 差異）
- 修 Phase 4 SEO 範疇的 sitemap、OG、canonical

## Next.js prod 既有 bug 摘要（必修）

從 `out/rss/*.xml` 抽樣（2026-05-01 確認）：

1. `<language>` 全部硬寫成 `zh-tw`，包括 `/rss/ja.xml`、`/rss/en.xml`、`/rss/{ja,en}/tech.xml`
2. 無 locale prefix 的 4 隻 feed (`/rss.xml`、`/rss/tech.xml`、`/rss/life.xml`、`/rss/shorts.xml`) 把同篇文章在三 locale 各放一筆 item，title 隨機是其中一個 locale，URL 三個不同
3. Channel meta 與 item 語言不一致（譬如 `/rss/tech.xml` channel title 中文「技術」但 item title 英文）
4. `/rss.xml` 與 `/rss/zh.xml` 內容不同：前者混雜、後者純 zh

Phase 3 完成後上述 1–4 全部解決。

## 架構

延續 Phase 2 的 `posts` Content Collection 與 `getActivePosts(locale)` / `getPostsByCategory(category, locale)` 查詢 API。新增 endpoint route 在 `src/pages/rss/`，每個 endpoint 在 build 時呼叫 `@astrojs/rss` 的 `rss()` 並回傳 `Response`。Item 資料層集中到 `src/lib/rss-feed.ts` 的 `buildFeedItems()` helper，純函式可測。Item 的 `description` 由 markdown body 渲染為 HTML。

### 為什麼用 `@astrojs/rss` 而非沿用 `feed`

- 與 Astro endpoint pattern 整合，type 自帶
- 比 `feed` 更精簡（我們沒用到 atom/json）
- 文件與社群範例多

## URL / 檔案矩陣

```
/rss.xml                          ← legacy alias，內容 = zh all
/rss/zh.xml                       ← per-locale all (zh)
/rss/ja.xml                       ← per-locale all (ja)
/rss/en.xml                       ← per-locale all (en)
/rss/tech.xml                     ← legacy alias，內容 = zh tech
/rss/life.xml                     ← legacy alias，內容 = zh life
/rss/zh/tech.xml                  ← per-locale per-category
/rss/zh/life.xml
/rss/ja/tech.xml
/rss/ja/life.xml
/rss/en/tech.xml
/rss/en/life.xml
```

12 個輸出檔。其中 3 個 legacy alias 內容 byte-for-byte 等於對應 zh feed，差別只在 `<atom:link rel="self">` 指向自身 URL（避免 RSS reader 跟丟）。

## 元件邊界

| 單元 | 職責 | 介面 | 依賴 |
|---|---|---|---|
| `src/lib/rss-feed.ts` | 純資料層：把 `PostMeta[]` 渲染為 `RSSFeedItem[]`，截 20 篇 | `buildFeedItems(posts: PostMeta[]): Promise<RSSFeedItem[]>`；`channelMeta(locale, kind: 'all' \| 'tech' \| 'life'): { title, description, language }` | `astro:content`、`i18n.ts` |
| `src/pages/rss/[locale].xml.ts` | per-locale all-posts feed | export `GET`、`getStaticPaths` (3) | `rss-feed.ts`、`@astrojs/rss` |
| `src/pages/rss/[locale]/[category].xml.ts` | per-locale per-category feed | export `GET`、`getStaticPaths` (6) | 同上 |
| `src/pages/rss.xml.ts` | legacy `/rss.xml` | export `GET`（內部呼叫 zh all） | 同上 |
| `src/pages/rss/[category].xml.ts` | legacy `/rss/{tech,life}.xml` | export `GET`、`getStaticPaths` (2) | 同上 |
| `src/lib/i18n.ts`（擴充） | 加 `site.description`、`rss.allPosts/tech/life` 字典 | 沿用 `t(locale)` | 無 |

## 內容規則

每隻 feed 一致：

| 欄位 | 值 |
|---|---|
| Channel `<title>` | `Yuren's Blog - {分類本地化名稱}` |
| Channel `<description>` | `t(locale).site.description` |
| Channel `<language>` | `zh-Hant` / `ja` / `en`（**修 prod bug**） |
| Channel `<link>` | `https://yurenju.blog/{locale}` |
| Channel `<atom:link rel="self">` | 對應 feed 自身 URL |
| Item 來源 | `getActivePosts(locale)` 或 `getPostsByCategory(category, locale)` |
| Item 排序 | 日期新到舊 |
| Item 數量 | **最新 20 篇**（不足則全收） |
| Item `<title>` | `post.title`（已 per-locale） |
| Item `<link>` | `https://yurenju.blog/{locale}/posts/{slug}`（zh 也帶 prefix） |
| Item `<description>` | post 全文渲染為 HTML |
| Item `<pubDate>` | `post.date` |
| Item `<category>` | `post.category` 本地化字串（`t(locale).rss.tech` / `rss.life`） |

### Item 全文渲染策略

`@astrojs/rss` 的 item 透過 `content` 欄位接 HTML 字串。兩條路：

**首選：`markdown-it` 直接從 `entry.body` 渲染**。簡單、build 快、不需 Container API。**已知限制**：
- Astro `<Image>` pipeline 處理過的圖片 URL 是 hashed asset path，markdown-it 渲染原始 markdown 拿到的是相對路徑 `images/0.png`，要在 RSS item 裡轉成絕對 URL（`https://yurenju.blog/_astro/...`）才能在 reader 裡顯示。如果做不到，圖片在 reader 顯示破圖。
- Phase 1b 的 `remarkObsidianImages`、`remarkNormalizeImagePaths` plugins 不會被 markdown-it 套用，`![[]]` 語法可能直接漏出。

**備案：Astro Container API（`AstroContainer.create()` + `container.renderToString(Content)`）**。完整套用所有 remark plugins 與 image pipeline，但慢且 API 還在 experimental 階段。

**Plan 第一個 task 做 spike**：選一篇含圖文章渲染兩種路線比對 HTML，決定是否能用首選或要切備案。本 spec 押首選為 baseline；若 spike 結果不行，plan 會調整。

## 資料流

```
endpoint GET 被 build 呼叫
  ↓
取 posts via getActivePosts(locale) 或 getPostsByCategory(cat, locale)
  ↓
buildFeedItems(posts) 截 20 篇、產 RSSFeedItem[]
  ↓
@astrojs/rss rss({ title, description, site, items, customData: <language> }) 回 Response
  ↓
Astro 寫成 dist/rss/.../{name}.xml
```

Legacy alias endpoint 內部直接呼叫 zh 版本的同邏輯，唯一差別 `customData` 與 `xmlns` 不變、`<atom:link self>` 透過 `rss()` 的 `site` + 路徑自動帶到自身 URL。

## i18n 文字擴充

`src/lib/i18n.ts` 的 `UiText` interface 加：

```ts
interface UiText {
  // ... 既有
  site: { description: string };
  rss: {
    allPosts: string;   // "全部文章" / "すべての記事" / "All Posts"
    tech: string;       // "技術" / "技術" / "Tech"
    life: string;       // "生活" / "生活" / "Life"
  };
}
```

`UI_TEXT.zh.site.description` 沿用 Phase 2 的 `BaseLayout` siteDescription 字串；ja、en 從 Next.js `lib/i18n/translations.ts` 的 `site.description` 移植過來。

## 測試策略

vitest 新增：

- `src/lib/__tests__/rss-feed.test.ts`：
  - `buildFeedItems(posts)` 限 20 篇、排序新→舊
  - Item link 永遠帶 locale prefix（包括 zh）
  - Mock 一篇 post.locale='ja' 看 item link 是 `/ja/posts/...`
  - Item 數量不足 20 時 return 實際筆數
- `channelMeta(locale, kind)` 對 9 組合的回傳值（title、description、language tag 對 locale）

整合驗證（plan Task 13 / 自動化腳本）：

```bash
# Build 後
xmllint --noout dist/rss.xml dist/rss/*.xml dist/rss/*/*.xml
# 預期：全部 well-formed
```

抽樣手動驗證：
- Open `dist/rss/zh.xml`、`dist/rss/ja.xml`：item 全是該 locale title、`<language>` 正確
- Diff `dist/rss.xml` vs `dist/rss/zh.xml`：除了 `<atom:link rel="self">` 不同，items 完全一致
- 上傳 `dist/rss/zh.xml`、`dist/rss/ja.xml`、`dist/rss/en.xml` 到 [feedvalidator.org](https://www.feedvalidator.org/)：valid

## 驗收

1. **12 個 RSS 檔案建出來**：`/rss.xml`、`/rss/{zh,ja,en}.xml`、`/rss/{tech,life}.xml`、`/rss/{zh,ja,en}/{tech,life}.xml`
2. **`<language>` 對應 locale**：`zh-Hant` / `ja` / `en`，無 `zh-tw` 硬寫
3. **不混雜**：每隻 feed item 全是該 locale 文章
4. **內容量**：zh feed 最新 20 篇、ja feed ≤30、en feed ≤30
5. **不含 archives**：抽樣 feed 中無任何 2019 以前文章
6. **排序**：新到舊
7. **Legacy alias 對齊**：`/rss.xml` items ≡ `/rss/zh.xml` items；`/rss/{tech,life}.xml` items ≡ `/rss/zh/{tech,life}.xml` items
8. **XML well-formed**：`xmllint --noout` 全部過
9. **feedvalidator.org**：zh/ja/en all-posts feed 抽樣 valid
10. **Build 時間**：相對 Phase 2 增加 < +5s
11. **Item 全文 HTML**：抽樣 item 的 `<description>` 含 HTML tag（不是 raw markdown）

## 風險

| 風險 | 機率 | 影響 | 緩解 |
|---|---|---|---|
| markdown-it 路線無法處理 `![[]]` 或圖片絕對 URL | 中 | 中 | Plan 第一個 task spike 確認；不行就切 Container API |
| Container API（如果用）build 時間明顯增加 | 中 | 低 | 60 篇全文渲染應仍在預算內；用 cache 進一步降 |
| `@astrojs/rss` 對 RSS 2.0 `<language>` 標籤的支援需要 `customData` | 低 | 低 | 已知用法 `customData: '<language>...</language>'` |
| ja 文章標題含特殊字元造成 XML escape 問題 | 低 | 低 | `@astrojs/rss` 預設 escape，加 vitest 測一篇含 `&<>` 標題的 item |
| 訂閱 `/rss.xml` 的舊 reader 看到 self-link 不同會以為是新 feed | 低 | 低 | Legacy alias 設計上接受此狀態，不另做 redirect |

## 範圍外明示

- 自動化檢查所有 RSS reader 顯示效果（手動抽樣即可）
- 站內提供 RSS 訂閱 UI（Phase 5 樣式精修可順手）
- Sitemap、OG、canonical（Phase 4）
- 部署平台層級的 redirect 規則（Phase 6）
- shorts category 還原（已決定不還原）

## 完成定義

- 所有驗收項目通過
- spec 與 plan commit
- branch 可獨立 merge 進 main
