# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build for production (generates static export and RSS feeds)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### RSS Generation
- RSS feeds are automatically generated during build via prebuild script
- Manual generation: `npx tsx scripts/generate-rss.ts`

## Architecture Overview

This is a Next.js 15 blog with static export, built for Traditional Chinese content. The blog uses markdown files for content and generates a fully static site.

### Core Structure
- **app/** - Next.js App Router pages and components
  - Dynamic routes: `/posts/[slug]` for blog posts
  - Category pages: `/tech`, `/life`
- **lib/** - Core logic
  - `posts.ts` - Post management with singleton caching
  - `markdown.ts` - Markdown to HTML conversion
  - `image.ts` - Image extraction from posts
  - `rss.ts` - RSS feed generation
- **public/posts/** - Markdown content organized by date-based slugs
- **public/pages/** - Static markdown pages (about, subscription)

### Key Patterns
1. **Post Slugs**: Date-based format `YYYY-MM-DD_title` with URL encoding/decoding
2. **Metadata**: Extracted from frontmatter or inferred from slug
3. **Categories**: Defined in frontmatter, default is "tech"
4. **Cover Images**: First image in post or explicit cover in frontmatter
5. **Static Export**: All pages pre-rendered at build time

### Styling

#### Design System
- **Tailwind CSS** with dark mode support
- **Typography Plugin**: @tailwindcss/typography for prose styles
- **Localized Plugin**: tailwindcss-localized for language-specific styles
- Early returns for readability
- Descriptive naming with "handle" prefix for events
- Accessibility features on interactive elements

#### Typography System
The blog uses a multilingual typography system supporting Traditional Chinese, English, and Japanese:

**Font Strategy (Mixed Typography)**:
- **Headings**: Serif fonts (Noto Serif family)
- **Body Text**: Sans Serif fonts (Noto Sans family)
- **Code**: Monospace fonts (Noto Sans Mono)

**Font Families** (defined in `tailwind.config.ts`):
- `font-sans`: Noto Sans TC → Noto Sans JP → Noto Sans (Latin)
- `font-serif`: Noto Serif TC → Noto Serif JP → Noto Serif (Latin)
- `font-mono`: Noto Sans Mono → system monospace fonts

**Important**: CJK fonts are ordered first to ensure proper rendering of Chinese/Japanese characters.

**Prose Variants**:
- `prose`: Default English styles (1rem base, 1.75 line-height)
- `prose-zh`: Traditional Chinese styles (1.125rem base, 2.0 line-height, 0.05em letter-spacing)
- `prose-ja`: Japanese styles (1rem base, 1.85 line-height, 0.02em letter-spacing)

**OpenType Features** (in `app/globals.css`):
- `[lang="ja"]` and `[lang="zh-Hant-TW"]` use `font-feature-settings: 'palt' 1` for proportional CJK punctuation spacing
- Code blocks disable font features for proper monospace rendering

**Color System**:
- Uses CSS variables for theme colors (defined in `app/globals.css`)
- `foreground`: Main text color (adapts to light/dark mode)
- `muted-foreground`: Secondary text color
- `primary`: Accent color for links and interactive elements
- All prose elements (including `strong`, `b`) use `theme('colors.foreground')` for proper dark mode support

#### Component Styling Patterns

**Page Layout**:
- Max width: `max-w-3xl` (applies to all content)
- Container: `container mx-auto p-4`
- Vertical centering (HomePage): `flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]`

**Typography Classes**:
- Page titles (h1): `font-serif text-4xl font-bold mb-6`
- Section headings (h2): `font-serif text-2xl font-semibold mb-6`
- Article content: `prose prose-lg zh:prose-zh ja:prose-ja dark:prose-invert max-w-none`
- Byline/metadata: `font-serif text-sm text-muted-foreground text-right mt-8`

**List Styling** (PostsList):
- Category title: `font-serif text-4xl font-bold mb-12`
- Year headings: `font-serif text-2xl font-semibold mb-6 text-foreground/80`
- List spacing: `space-y-3` between items, `mb-12` between year sections
- Date display: `text-sm text-muted-foreground min-w-[80px]`
- Post titles: `flex-1 group-hover:underline underline-offset-4`
- Hover state: `hover:text-primary transition-colors`

**Spacing Guidelines**:
- Large sections: `mb-12` (3rem)
- Medium sections: `mb-6` (1.5rem)
- Small elements: `space-y-3` or `space-y-4`
- Inline gaps: `gap-4` (1rem)

**Interactive States**:
- Links: Use `group` with `group-hover:` variants
- Transitions: `transition-colors` for smooth color changes
- Underlines: `underline-offset-4` for better readability

### Content Format
Posts use markdown with YAML frontmatter:
```yaml
---
title: "Post Title"
date: "2024-01-01"
category: "tech" | "life"
cover: "/path/to/image" (optional)
description: "SEO description" (optional)
---
```

### Site Configuration
- Language: zh-tw (Traditional Chinese)
- Site URL: https://yurenju.blog
- Author: Yuren
- Theme: Light/Dark mode with system preference