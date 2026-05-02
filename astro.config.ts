import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import type { InputOptions } from 'rollup';
import { obsidianRemark } from './src/lib/images/obsidian-remark';
import { remarkNormalizeImagePaths } from './src/lib/images/remark-normalize-image-paths';

/**
 * Vite plugin: fixes an Astro 6.2 bug on Windows where content-assets.mjs
 * contains image import URLs with the `importer` query parameter encoded via
 * URLSearchParams (which encodes "/" as "%2F"). Astro's
 * `astro:content-asset-propagation` plugin then calls
 * `fileURLToPath(new URL(importerParam, root))`, which throws
 * ERR_INVALID_FILE_URL_PATH on Windows because encoded slashes are not
 * allowed in file URL paths.
 *
 * Strategy: use the Rollup `options` hook to prepend a resolveId plugin
 * directly into Rollup's plugin list. This ensures our plugin runs BEFORE
 * Astro's `astro:content-asset-propagation` plugin regardless of Vite's
 * plugin ordering rules. The resolveId interceptor decodes %2F-encoded
 * importer paths, resolves the asset manually, and returns the result so
 * Astro's plugin never sees the broken URL.
 *
 * TODO: No upstream Astro issue filed yet. When this workaround is removed,
 * confirm against the latest Astro release that the %2F encoding bug on
 * Windows is actually fixed (test by removing this plugin and running build
 * on Windows).
 */
function fixContentAssetsImporterPaths(root: URL) {
  const CONTENT_IMAGE_FLAG = 'astroContentImageFlag';

  // The inner plugin that we inject at the start of Rollup's plugin list.
  const innerPlugin = {
    name: 'fix-content-image-importer-paths-inner',
    async resolveId(
      this: { resolve: (id: string, importer?: string, opts?: object) => Promise<{ id: string } | null> },
      id: string,
    ) {
      if (!id.includes(CONTENT_IMAGE_FLAG)) return;
      const qIdx = id.indexOf('?');
      if (qIdx === -1) return;
      const base = id.slice(0, qIdx);
      const query = id.slice(qIdx + 1);
      const params = new URLSearchParams(query);
      const importerParam = params.get('importer');
      if (!importerParam) return;
      // Decode %2F-encoded slashes so fileURLToPath works on Windows.
      const decoded = decodeURIComponent(importerParam);
      let importerPath: string;
      try {
        importerPath = fileURLToPath(new URL(decoded, root.href));
      } catch {
        return;
      }
      const resolved = await this.resolve(base, importerPath, { skipSelf: true });
      if (!resolved) return;
      return { id: `${resolved.id}?${CONTENT_IMAGE_FLAG}` };
    },
  };

  return {
    name: 'fix-content-assets-importer-paths',
    enforce: 'pre' as const,
    options(opts: InputOptions): InputOptions {
      const plugins = (Array.isArray(opts.plugins) ? opts.plugins : []) as unknown[];
      plugins.unshift(innerPlugin);
      return { ...opts, plugins } as InputOptions;
    },
  };
}

export default defineConfig({
  site: 'https://yurenju.blog',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-Hant', ja: 'ja', en: 'en' },
      },
      filter: (page) => !page.includes('/rss'),
    }),
  ],
  image: {
    service: {
      entrypoint: './src/lib/images/image-service',
      config: {},
    },
  },
  markdown: {
    remarkPlugins: [obsidianRemark, remarkNormalizeImagePaths],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'vitesse-dark',
      },
    },
  },
  vite: {
    plugins: [fixContentAssetsImporterPaths(new URL('.', import.meta.url))],
    // Disable PostCSS auto-discovery: this project's CSS is plain vanilla
    // (no Tailwind, no autoprefixer). Without this, Vite walks up the tree
    // and finds the Next.js side's postcss.config.mjs, which loads Tailwind
    // and warns because its content paths don't resolve from astro/.
    css: { postcss: { plugins: [] } },
  },
  output: 'static',
  trailingSlash: 'ignore',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans TC',
      cssVariable: '--font-sans',
      weights: [400, 500, 700],
      // Astro's auto fallback computes size-adjust against the full font
      // (including CJK glyphs), producing ~197% for Noto Sans TC vs Next.js's
      // Capsize-derived ~104%. The result: Latin fallback renders 2x oversized
      // before the web font loads, causing a visible size jump on swap.
      optimizedFallbacks: false,
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Serif TC',
      cssVariable: '--font-serif',
      weights: [400, 700],
      optimizedFallbacks: false,
      // Override Astro's default `['sans-serif']` so the variable resolves to
      // a serif fallback before the web font loads. Otherwise `var(--font-serif)`
      // emits `"Noto Serif TC-...", sans-serif` and headings briefly render in
      // sans-serif during the swap window.
      fallbacks: ['serif'],
    },
  ],
});
