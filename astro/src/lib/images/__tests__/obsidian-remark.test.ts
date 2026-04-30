import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import type { Root, Paragraph, Text } from 'mdast';
import { VFile } from 'vfile';
import { obsidianRemark } from '../obsidian-remark';

const fixtureDir = path.resolve(__dirname, 'fixtures/post-a');
const fixtureMd = path.join(fixtureDir, 'index.md');

async function process(src: string) {
  const file = await unified()
    .use(remarkParse)
    .use(obsidianRemark)
    .use(remarkStringify)
    .process({ value: src, path: fixtureMd });
  return String(file);
}

/** Run only parse + plugin, return the transformed mdast Root */
async function runPlugin(src: string, filePath?: string): Promise<Root> {
  const proc = unified().use(remarkParse).use(obsidianRemark);
  const vfile = new VFile({ value: src, ...(filePath ? { path: filePath } : {}) });
  const tree = proc.parse(vfile) as Root;
  return (await proc.run(tree, vfile)) as Root;
}

describe('obsidianRemark', () => {
  it('rewrites ![[name.ext]] to standard image syntax with relative path', async () => {
    const out = await process('See ![[0.png]] inline.');
    expect(out).toContain('![0.png](images/0.png)');
  });

  it('rewrites root-level files', async () => {
    const out = await process('![[cover.jpg]]');
    expect(out).toContain('![cover.jpg](cover.jpg)');
  });

  it('handles multiple wiki links in one paragraph', async () => {
    const out = await process('![[0.png]] and ![[cover.jpg]]');
    expect(out).toContain('![0.png](images/0.png)');
    expect(out).toContain('![cover.jpg](cover.jpg)');
  });

  it('warns and preserves text when file not found', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tree = await runPlugin('![[missing.png]] tail', fixtureMd);
    const para = tree.children[0] as Paragraph;
    // The paragraph should contain a text node preserving the original wiki-link
    const textNode = para.children.find(
      (n): n is Text => n.type === 'text' && n.value.includes('![[missing.png]]'),
    );
    expect(textNode).toBeDefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('not found: missing.png'),
    );
    warn.mockRestore();
  });

  it('leaves regular markdown images untouched', async () => {
    const out = await process('![alt](images/0.png)');
    expect(out).toContain('![alt](images/0.png)');
  });

  it('does nothing when vfile.path is missing', async () => {
    // Without a path, the plugin should preserve the original text verbatim as a text node
    const tree = await runPlugin('![[anything.png]]');
    const para = tree.children[0] as Paragraph;
    const textNode = para.children.find(
      (n): n is Text => n.type === 'text' && n.value.includes('![[anything.png]]'),
    );
    expect(textNode).toBeDefined();
  });
});
