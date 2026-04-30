import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Root, Image, Paragraph } from 'mdast';
import { remarkNormalizeImagePaths } from '../remark-normalize-image-paths';

async function runPlugin(src: string): Promise<Root> {
  const proc = unified().use(remarkParse).use(remarkNormalizeImagePaths);
  const tree = proc.parse(src) as Root;
  return (await proc.run(tree)) as Root;
}

function getImageUrl(tree: Root): string {
  const para = tree.children[0] as Paragraph;
  const img = para.children.find((n): n is Image => n.type === 'image');
  if (!img) throw new Error('No image node found in tree');
  return img.url;
}

describe('remarkNormalizeImagePaths', () => {
  it('adds ./ prefix to bare relative path', async () => {
    const tree = await runPlugin('![alt](images/0.png)');
    expect(getImageUrl(tree)).toBe('./images/0.png');
  });

  it('leaves explicitly relative path unchanged', async () => {
    const tree = await runPlugin('![alt](./x.png)');
    expect(getImageUrl(tree)).toBe('./x.png');
  });

  it('leaves parent-relative path unchanged', async () => {
    const tree = await runPlugin('![alt](../foo/x.png)');
    expect(getImageUrl(tree)).toBe('../foo/x.png');
  });

  it('leaves absolute path unchanged', async () => {
    const tree = await runPlugin('![alt](/posts/x.png)');
    expect(getImageUrl(tree)).toBe('/posts/x.png');
  });

  it('leaves HTTP URL unchanged', async () => {
    const tree = await runPlugin('![alt](https://example.com/x.png)');
    expect(getImageUrl(tree)).toBe('https://example.com/x.png');
  });

  it('leaves data URI unchanged', async () => {
    const dataUri = 'data:image/png;base64,iVBORw0KG';
    const tree = await runPlugin(`![alt](${dataUri})`);
    expect(getImageUrl(tree)).toBe(dataUri);
  });

  it('leaves protocol-relative URL unchanged', async () => {
    const tree = await runPlugin('![alt](//cdn.example.com/x.png)');
    expect(getImageUrl(tree)).toBe('//cdn.example.com/x.png');
  });
});
