import { defineConfig, fontProviders } from 'astro/config';
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
  image: {
    service: {
      entrypoint: './src/lib/images/image-service',
      config: {},
    },
  },
  markdown: {
    remarkPlugins: [obsidianRemark, remarkNormalizeImagePaths],
  },
  vite: {
    plugins: [fixContentAssetsImporterPaths(new URL('.', import.meta.url))],
  },
  output: 'static',
  site: 'https://yurenju.blog',
  trailingSlash: 'ignore',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans TC',
      cssVariable: '--font-sans',
      weights: [400, 500, 700],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Serif TC',
      cssVariable: '--font-serif',
      weights: [400, 700],
    },
  ],
});
