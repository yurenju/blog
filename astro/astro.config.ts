import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';

/**
 * Vite plugin that prevents build failures when markdown content in
 * public/posts/ references images via relative paths (e.g. images/0.png).
 * Those images are served as static assets and don't need Vite processing.
 */
function ignorePublicContentImages() {
  return {
    name: 'ignore-public-content-images',
    enforce: 'pre' as const,
    resolveId(id: string, importer?: string) {
      // Intercept relative image paths from content collection entries.
      // Posts in public/posts/ are served as static assets and don't need
      // Vite bundling; return a stub to prevent build failure.
      if (!importer || !id.match(/^images\//)) return;
      return { id: '\0virtual:missing-image', external: false };
    },
    load(id: string) {
      if (id.startsWith('\0virtual:missing-image')) {
        return 'export default ""';
      }
    },
  };
}

export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  vite: {
    plugins: [ignorePublicContentImages()],
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
