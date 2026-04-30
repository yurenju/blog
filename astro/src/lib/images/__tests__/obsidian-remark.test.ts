import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
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
    const out = await process('![[missing.png]] tail');
    expect(out).toContain('![[missing.png]]');
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
    const file = await unified()
      .use(remarkParse)
      .use(obsidianRemark)
      .use(remarkStringify)
      .process('![[anything.png]]');
    expect(String(file)).toContain('![[anything.png]]');
  });
});
