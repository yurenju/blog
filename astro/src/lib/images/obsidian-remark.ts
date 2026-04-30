import path from 'node:path';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, Image, PhrasingContent, Html } from 'mdast';
import type { VFile } from 'vfile';
import { buildIndex } from './find-in-entry-dir';

const WIKI_LINK = /!\[\[([^\]]+?)\]\]/g;

/**
 * Remark plugin: converts Obsidian wiki-link images `![[name.ext]]` into
 * standard mdast image nodes with paths relative to the markdown file.
 *
 * After this plugin runs, Astro Content Collections' built-in asset
 * pipeline picks up the relative path and produces hashed/optimized URLs.
 *
 * Lookup is scoped to the markdown file's directory tree (recursive).
 * Missing files: warn and preserve the original text node.
 * No vfile.path: preserve original text verbatim (no warn).
 */
export const obsidianRemark: Plugin<[], Root> = () => {
  return (tree, file: VFile) => {
    const filePath = file.path as string | undefined;
    const entryDir = filePath ? path.dirname(filePath) : null;
    let indexCache: Map<string, string> | null = null;
    const getIndex = () =>
      entryDir
        ? (indexCache ?? (indexCache = buildIndex(entryDir)))
        : new Map<string, string>();

    visit(tree, 'text', (node: Text, index, parent) => {
      if (typeof index !== 'number' || !parent) return;
      if (!node.value.includes('![[')) return;

      const replacements: PhrasingContent[] = [];
      let lastEnd = 0;
      let m: RegExpExecArray | null;
      WIKI_LINK.lastIndex = 0;
      while ((m = WIKI_LINK.exec(node.value)) !== null) {
        const [match, name] = m;
        const matchStart = m.index;
        const matchEnd = matchStart + match.length;

        if (matchStart > lastEnd) {
          replacements.push({
            type: 'text',
            value: node.value.slice(lastEnd, matchStart),
          });
        }

        if (!filePath || !entryDir) {
          // No vfile.path: emit verbatim via html node to avoid bracket escaping
          const htmlNode: Html = { type: 'html', value: match };
          replacements.push(htmlNode);
        } else {
          const abs = getIndex().get(name);
          if (abs) {
            const rel = path.relative(entryDir, abs).replaceAll('\\', '/');
            const img: Image = { type: 'image', url: rel, alt: name };
            replacements.push(img);
          } else {
            console.warn(
              `[obsidian-remark] not found: ${name} in ${filePath}`,
            );
            // Use an html node so remark-stringify emits the text verbatim
            // without escaping the brackets in `![[...]]`.
            const htmlNode: Html = { type: 'html', value: match };
            replacements.push(htmlNode);
          }
        }
        lastEnd = matchEnd;
      }

      if (replacements.length === 0) return;

      if (lastEnd < node.value.length) {
        replacements.push({
          type: 'text',
          value: node.value.slice(lastEnd),
        });
      }

      parent.children.splice(index, 1, ...replacements);
      return index + replacements.length;
    });
  };
};
