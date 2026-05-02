# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Conventions

`docs/superpowers/specs/` and `docs/superpowers/plans/` 一律使用**繁體中文**撰寫，包含章節標題、任務標題、步驟敘述、預期結果說明等。即使 skill 提供的模板使用英文 heading（如 `Goal`、`Architecture`、`Task N`、`Files`、`Step N`、`Notes`），也要翻譯成中文。程式碼 block 內、commit message、檔案路徑、函式/變數/型別名稱、shell 指令仍保留英文。

## Commands

### Development
- `npm run dev` - Start Astro dev server on http://localhost:4321
- `npm run build` - Build for production (static export to dist/, ~40s for 1564 pages)
- `npm run preview` - Serve the production build locally for verification
- `npm run check` - Run `astro check` (type checking + content collection validation)
- `npm run test` - Run vitest unit tests

### RSS Generation
- RSS feeds are produced at build time by `@astrojs/rss` endpoints in `src/pages/rss/`
- 12 feeds: 3 per-locale (`/rss/{zh,ja,en}.xml`), 6 per-locale-per-category, 3 legacy aliases (`/rss.xml`, `/rss/{tech,life}.xml`)

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
  - Post directory: `<group>/YYYY-MM-DD_<slug>/`
  - Main (zh) file: `<post-title>.md` — filename is the human-readable title (Chinese or English), **not** `index.md`. `title` and `date` are inferred from this filename and the parent directory name.
  - Translations: `index.ja.md` / `index.en.md` (optional). These files may carry only `title` in frontmatter; `slug`, `date`, `category`, etc. are inherited from the zh sibling.
  - Co-located assets live under `assets/` and are referenced via Obsidian wiki links (`![[image.jpg]]`).
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

### Key Patterns
1. **Post Slugs**: Date-based format `YYYY-MM-DD_title` with URL encoding/decoding
2. **Metadata**: Extracted from frontmatter or inferred from slug. `PostMetadata` includes `group` field (directory group name). `PostData` includes `archived` boolean (true when `group === "archives"`)
3. **Categories**: Defined in frontmatter, default is "tech"
4. **Cover Images**: First image in post or explicit cover in frontmatter
5. **Static Export**: All pages pre-rendered at build time
6. **Archiving**: Posts in `src/content/posts/archives/` are excluded from main listings. Archives pages (`/[locale]/archives`) display only archived posts. Batch processing (`processInBatches()`) is used for file I/O to avoid EMFILE errors with 1,400+ posts

### Styling

The blog uses **plain CSS** (no Tailwind). All global styles live in `src/styles/global.css`; component-scoped styles go in `<style>` blocks inside `.astro` files.

#### Theming
- Light/dark mode via `:root` and `:root[data-theme="dark"]` CSS custom properties (e.g. `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-link`).
- Theme is applied by an inline script in `BaseLayout.astro` before paint to avoid FOUC; `ThemeToggle.astro` flips `data-theme` on `<html>`.
- Components must read CSS variables (e.g. `color: var(--color-text)`) — never hard-code colors.

#### Typography
- **Headings**: serif (Noto Serif TC → Noto Serif JP → Noto Serif). `font-family: var(--font-serif), 'Times New Roman', serif;`
- **Body**: sans-serif (Noto Sans TC → Noto Sans JP → Noto Sans). `font-family: var(--font-sans), system-ui, sans-serif;`
- **Code**: monospace (Noto Sans Mono fallback to system mono).
- Fonts are loaded via Astro's Font API in `astro.config.ts` and exposed as the `--font-sans` / `--font-serif` / `--font-mono` CSS variables.
- CJK fonts are ordered **first** in each stack so Chinese/Japanese glyphs render correctly.
- Site brand title (`.site-title`, `.brand`) uses a Latin-only system-serif stack to skip the CJK web font on the homepage.
- `[lang="ja"]` and `[lang="zh-Hant-TW"]` set `font-feature-settings: 'palt' 1` for proportional CJK punctuation; code blocks override this.

#### Layout
- Page container: `.container { max-width: 48rem; margin: 0 auto; padding: 1.5rem 1rem; }`
- Article body uses the `.prose` class (defined in `global.css`) — not `@tailwindcss/typography`.

### Content Format
Frontmatter is intentionally minimal — most posts only declare `slug` and `categories`. `title` comes from the filename, `date` from the `YYYY-MM-DD` prefix of the directory name.

Typical zh post:
```yaml
---
slug: 2025-02-03_point-card-belonging
categories:
  - life            # or `tech`
---
```

Schema (`src/content.config.ts`) accepts both `categories` (array, used in practice) and `category` (string enum `tech|life`, default `tech`). `resolveCategory()` in `src/lib/posts.ts` prefers `categories[0]`, then falls back to `category`. `cover` and `description` are optional and rarely set. `title` / `date` may also be supplied in frontmatter to override what is inferred from the filename.

Translation files (`index.ja.md`, `index.en.md`) typically only carry `title`; everything else is inherited from the zh sibling.

### Site Configuration
- Language: zh-tw (Traditional Chinese)
- Site URL: https://yurenju.blog
- Author: Yuren
- Theme: Light/Dark mode with system preference