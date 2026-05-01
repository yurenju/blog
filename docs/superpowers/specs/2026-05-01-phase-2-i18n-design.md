# Phase 2 — ja / en 雙語接入

**狀態：** Spec
**前置 Phase：** Phase 0、1a、1b（已 merge）
**對應 roadmap：** `docs/research/2026-04-29-astro-migration-roadmap.md` 的 Phase 2

## 目標

把現有 30 篇 `index.ja.md` + 30 篇 `index.en.md` 翻譯文章接進 Astro，建立 `/ja/`、`/en/` 路由與 Phase 0 預留的 `[locale]` 結構對接，含跨語言切換 UI 與 hreflang metadata。**沒有翻譯的文章在 `/ja/`、`/en/` 路徑下不產生頁面（404），與 Next.js prod 行為一致。**

## 非目標（明確排除）

- Astro `i18n` config（不啟用，自家 helper 已足夠）
- 缺翻譯時 fallback 到 zh 的 rewrite/redirect 機制
- Browser locale detection / 自動 redirect
- Frontmatter parity 檢查（翻譯與原文 frontmatter 不需對齊）
- OG meta、sitemap、canonical metadata（Phase 4）
- 深色模式與 prose 樣式精修（Phase 5）

## 架構

延續 Phase 1a 建立的單一 `posts` Content Collection。Glob pattern 把先前排除的 `index.ja.md` 與 `index.en.md` 收回。`lib/posts.ts` 從檔名 suffix 推斷 locale，`PostMeta` 增加 `locale` 與 `availableLocales` 兩個欄位；後者一次性掃過所有 entry、依 dirname 聚合得出。所有 `[locale]/*` 頁面 `getStaticPaths` 回 `LOCALES.map(...)`，文章頁則由實際存在的 (locale, slug) 對驅動。新增 `src/lib/i18n.ts` 集中 locale 列表、HTML lang、UI 文字與 URL helper。

### 為什麼不用 Astro `i18n` config

Astro 內建的 i18n 提供 (1) locale 列表配置 (2) `prefixDefaultLocale` (3) `routing.fallback` (4) `getRelativeLocaleUrl()` (5) `Astro.preferredLocale`/middleware。我們的需求中：

- 三個 locale 都帶 prefix、沒有「預設 locale」概念 → (2) 不適用
- 缺翻譯就 404、不 fallback → (3) 不適用
- 純 static build → (5) 不適用
- (1) 自宣告即可（`LOCALES` 常數）
- (4) 唯一可用的 helper，但我們的 `localePath()` 兩行就寫完，不值得為此導入整套 config

結論：自家 helper 路線更直接，沒有與內建 routing 慣例打架的風險。

## 元件邊界

| 單元 | 職責 | 介面 | 依賴 |
|---|---|---|---|
| `src/lib/i18n.ts` | Locale 常數、HTML lang、UI 文字、URL helper | `LOCALES`、`Locale`、`HTML_LANG`、`localePath`、`t(locale)` | 無 |
| `src/lib/posts.ts` | Post 資料層；新增 locale 推斷與 availableLocales 計算 | `getAllPosts()`、`getActivePosts(locale)`、`getPostsByCategory(category, locale)`、`getArchivedPosts()`、`getPostBySlug(locale, slug)` | `astro:content`、`i18n.ts` |
| `src/content.config.ts` | Glob pattern；schema | 同 Phase 1b，僅 glob 改動 | `astro/loaders` |
| `src/components/LanguageSwitcher.astro` | 語言切換 UI | Props: `locale`、`availableLocales`、`pathname`、`slug?` | `i18n.ts` |
| `src/components/ArticleLanguageIndicator.astro` | 文章頁顯示「Also available in: X」 | Props: `currentLocale`、`availableLocales`、`slug` | `i18n.ts` |
| `src/components/LanguageNotice.astro` | ja/en 首頁的中文站提示 | Props: `locale`、`postCount` | `i18n.ts` |
| `src/components/Header.astro` | 站台 header；改用 `t(locale)`；條件渲染 Archives；嵌入 `LanguageSwitcher` | Props: `locale`、`availableLocales?`、`pathname`、`slug?` | `i18n.ts`、`LanguageSwitcher` |

## 資料模型

### Glob pattern

```ts
// src/content.config.ts
loader: glob({
  pattern: ['**/*.md'],  // 移除 Phase 1 的 '!**/index.en.md', '!**/index.ja.md'
  base: './src/content/posts',
}),
```

### `PostMeta` 增量

```ts
export interface PostMeta {
  // ...既有欄位
  locale: 'zh' | 'ja' | 'en';
  availableLocales: ('zh' | 'ja' | 'en')[];  // 含自身，已排序為 ['zh', 'ja', 'en'] 子集
}
```

### Locale 推斷規則（檔名）

對 `parsePathSegments()` 取出的 `filename`：

- `index.ja` → locale `ja`
- `index.en` → locale `en`
- 其他（`index`、`<title>` 等）→ locale `zh`

### `availableLocales` 計算

於 `getAllPosts()` 內：

1. 解析每個 entry 取得 `(group, dirname, locale)`。
2. 以 `(group, dirname)` 為 key group by，得到每個 dirname 下的 locale set。
3. 把該 set 反塞回每篇的 `availableLocales`（排序為 `['zh', 'ja', 'en']` 子集，保證 stable order）。

### Slug 唯一性 assertion

從「全域 slug 唯一」改為「`(locale, slug)` 對唯一」。同 dirname 下三個 locale 必然共用 slug，這是預期行為；不同 dirname 撞同 locale 同 slug 才該 throw。

實作：用 `Map<string, string>` 以 `${locale}::${slug}` 為 key 偵測重複。

### `getStaticPaths` 模式

非文章 page（首頁、tech、life、about、subscription）：

```ts
export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}
```

Archives：

```ts
export function getStaticPaths() {
  return [{ params: { locale: 'zh' } }];  // ja/en 不產生
}
```

文章頁 `[locale]/posts/[slug].astro`：

```ts
export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    params: { locale: post.locale, slug: post.slug },
    props: { post },
  }));
}
```

## URL helper 與 i18n 文字

```ts
// src/lib/i18n.ts
export const LOCALES = ['zh', 'ja', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const HTML_LANG: Record<Locale, string> = {
  zh: 'zh-Hant-TW', ja: 'ja', en: 'en',
};

export const HREFLANG: Record<Locale, string> = {
  zh: 'zh-Hant', ja: 'ja', en: 'en',
};

export const LANGUAGE_NAMES: Record<Locale, string> = {
  zh: '繁體中文', ja: '日本語', en: 'English',
};

export function localePath(locale: Locale, ...segments: string[]): string {
  const parts = [locale, ...segments].filter(Boolean);
  return '/' + parts.join('/');
}

// UI 文字（從 Next.js lib/i18n/translations.ts 移植 Phase 2 用得到的子集）
export const UI_TEXT: Record<Locale, UiText> = { /* ... */ };
export function t(locale: Locale): UiText { return UI_TEXT[locale]; }
```

`UiText` 涵蓋本 phase 用到的鍵：`nav.{home,tech,life,archives,about,subscription}`、`post.alsoAvailableIn`、`languageNotice.{mainlyInChinese,currentlyHas,articles,switchToChinese}`、`switchLanguage` 等。Phase 5 再追加深色模式相關。

## UI 元件行為

### `LanguageSwitcher.astro`

Dropdown 顯示三個語言。建構連結邏輯：

```
for targetLocale in LOCALES (排除 currentLocale):
  if 在文章頁且 targetLocale ∈ availableLocales:
    href = /{targetLocale}/posts/{slug}
  elif 在文章頁且 targetLocale ∉ availableLocales:
    href = /{targetLocale}/
  else (非文章頁):
    href = pathname.replace(/^\/{currentLocale}/, /{targetLocale})
```

Dropdown 開關以一小段 inline `<script>` 實作（無框架），點擊外部關閉。

### `ArticleLanguageIndicator.astro`

僅當 `availableLocales.length > 1` 渲染。文字：`{t(locale).post.alsoAvailableIn}` + 其它 locale 連結。位置：文章標題下方、內容上方。

### `LanguageNotice.astro`

僅在 `/ja/`、`/en/` 首頁渲染。內容形如：「本站主要以繁體中文撰寫。目前有 30 篇日文文章。切換到中文版以瀏覽所有內容。」其中 `30` 由 props `postCount` 傳入。「切換到中文版」連結到 `/zh/`。

### `Header.astro` 變更

- nav 連結文字改 `t(locale).nav.*`
- 當 `locale !== 'zh'` 時不渲染 Archives 連結
- 末端嵌入 `<LanguageSwitcher>`，把 `locale`、`availableLocales`（文章頁才有）、`pathname`、`slug?`（文章頁）傳入

## SEO（本 phase 範圍）

文章頁 `<head>` 產出 hreflang alternates：

```html
<link rel="alternate" hreflang="zh-Hant" href="https://yurenju.blog/zh/posts/<slug>" />
<link rel="alternate" hreflang="ja" href="https://yurenju.blog/ja/posts/<slug>" />  <!-- 僅當 ja ∈ availableLocales -->
<link rel="alternate" hreflang="en" href="https://yurenju.blog/en/posts/<slug>" />  <!-- 僅當 en ∈ availableLocales -->
<link rel="alternate" hreflang="x-default" href="https://yurenju.blog/zh/posts/<slug>" />
```

OG / Twitter card / canonical / sitemap 留給 Phase 4。

## 測試策略

延續 Phase 1b 的 vitest 設置，新增單元測試：

- `lib/i18n.ts`：`localePath()` 邊界（empty segments、leading slash）。
- `lib/posts.ts`：locale 從檔名推斷、`availableLocales` 聚合（含「只有 zh」、「zh+ja」、「三 locale 全有」、「孤兒翻譯」案例）、slug uniqueness 在 (locale, slug) 對下不誤報。
- `LanguageSwitcher.astro` 的連結建構邏輯：抽出純函式 `buildLanguageLinks(currentLocale, availableLocales, pathname, slug?)` 測試（component 本身不測，邏輯函式測）。

整合測試（手動 + 腳本抽樣）：

- 全 build 綠燈、頁數匹配預期。
- 抽樣 10 篇有翻譯的文章，三 locale 都打開、`<head>` hreflang 正確、`ArticleLanguageIndicator` 顯示其它 locale 連結。
- 抽樣 10 篇無翻譯的文章，`/ja/posts/<slug>` 與 `/en/posts/<slug>` 確實 404。
- `/ja/`、`/en/` 首頁顯示 `LanguageNotice` 與正確文章數。
- `/ja/archives`、`/en/archives` 確實 404。
- LanguageSwitcher：在文章頁、首頁、分類頁三種情境下切換的 href 符合規格。

## 驗收

1. **Build 綠燈：** Astro build 通過，頁數約為 Phase 1b 的 1494 + 60 ja/en 文章 + 約 6 個 ja/en 列表分類頁 + 4 個 ja/en about/subscription = 約 1564 頁。
2. **列表頁過濾：** `/ja/`、`/en/`、`/ja/tech`、`/ja/life`、`/en/tech`、`/en/life` 顯示「該 locale 有翻譯」的文章子集。
3. **文章頁 404 行為：** 無翻譯的 slug 在 `/ja/posts/<slug>` 與 `/en/posts/<slug>` 不存在；有翻譯的正常顯示對應內容。
4. **Archives 限定 zh：** `/ja/archives`、`/en/archives` 404；`/zh/archives` 維持現狀。
5. **跨語言 metadata：** 翻譯文章頁有 hreflang alternates，含 `x-default`。
6. **Notice：** `/ja/`、`/en/` 首頁顯示 `LanguageNotice` 與正確 30/30 文章數。
7. **LanguageSwitcher：** 在文章頁切到「有翻譯的 locale」會跳對應翻譯；切到「無翻譯的 locale」會跳目標首頁；非文章頁保留路徑換 prefix。
8. **Header：** ja/en 模式下不顯示 Archives 連結；nav 文字使用對應 locale。
9. **Build 時間：** 預期與 Phase 1b 持平（< 60s），新增 entry 與頁面數相對 image processing 開銷可忽略。

## 風險

| 風險 | 機率 | 影響 | 緩解 |
|---|---|---|---|
| Slug uniqueness 改成 (locale, slug) 對後，某些 dirname 下三 locale slug 不一致 | 低 | 中（hreflang 對不齊） | 加 dirname 內 slug 一致性 assertion：同一 (group, dirname) 下所有 entry 的 derived slug 必須相同 |
| `availableLocales` 計算遺漏邊界（譬如 archives 下罕見 locale 檔名） | 低 | 低 | 寫覆蓋四種命名情境的單元測試 |
| LanguageSwitcher 的 dropdown vanilla JS 在 SSG 多頁複用時 ID 衝突 | 低 | 低 | 用 `aria-controls` 配 `crypto.randomUUID()` 在 frontmatter 生成 unique id；或用 `<details>`/`<summary>` 原生方案 |

## 範圍外的清理

- `Astro.params.locale!` non-null assertion 散落各 page → 改成 `const locale = Astro.params.locale as Locale;`，順便完成 POC reviewer 留下的 follow-up。

## 完成定義

- 全部驗收項目通過
- spec 與 plan 文件 commit
- branch 可獨立 merge 進 main
