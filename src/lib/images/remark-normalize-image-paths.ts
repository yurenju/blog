import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Image } from 'mdast';

/**
 * Remark plugin: ensures all relative image URLs start with "./" so that
 * Vite resolves them as relative file imports rather than bare module
 * specifiers.
 *
 * Without this, a path like `images/0.png` in markdown becomes a bare import
 * in Astro's generated `content-assets.mjs`, which Vite cannot resolve and
 * throws an ImageNotFound error at build time.
 *
 * Only affects local relative paths (i.e. paths that don't start with "/",
 * "./", "../", or a URL scheme).
 */
export const remarkNormalizeImagePaths: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'image', (node: Image) => {
      const url = node.url;
      const isAbsolute = url.startsWith('/');
      const isExplicitRelative = url.startsWith('./') || url.startsWith('../');
      const isUrl = /^[a-z][a-z0-9+\-.]*:/i.test(url); // RFC 3986 scheme (http:, https:, data:, mailto:, tel:, ftp:, etc.)
      const isProtocolRelative = url.startsWith('//');

      if (!isAbsolute && !isExplicitRelative && !isUrl && !isProtocolRelative) {
        node.url = './' + url;
      }
    });
  };
};
