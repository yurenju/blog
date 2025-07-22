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
  - Category pages: `/tech`, `/life`, `/shorts` (photos)
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
- Tailwind CSS with dark mode support
- Early returns for readability
- Descriptive naming with "handle" prefix for events
- Accessibility features on interactive elements

### Content Format
Posts use markdown with YAML frontmatter:
```yaml
---
title: "Post Title"
date: "2024-01-01"
category: "tech" | "life" | "shorts"
cover: "/path/to/image" (optional)
description: "SEO description" (optional)
---
```

### Site Configuration
- Language: zh-tw (Traditional Chinese)
- Site URL: https://yurenju.blog
- Author: Yuren
- Theme: Light/Dark mode with system preference