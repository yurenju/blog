import { describe, it, expect } from 'vitest';
import { channelMeta, buildFeedItems } from '../rss-feed';
import type { PostMeta } from '../posts';

function makePost(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    entry: { id: 'stub' } as PostMeta['entry'],
    slug: 'stub',
    group: '2024',
    archived: false,
    category: 'tech',
    title: 'stub title',
    date: new Date('2024-01-01'),
    locale: 'zh',
    availableLocales: ['zh'],
    cover: null,
    ...overrides,
  };
}

describe('channelMeta', () => {
  it('zh all-posts has zh-Hant language and 全部文章 title suffix', () => {
    const m = channelMeta('zh', 'all');
    expect(m.title).toBe("Yuren's Blog - 全部文章");
    expect(m.language).toBe('zh-Hant');
    expect(m.description).toContain('撰寫');
  });

  it('ja tech has ja language and 技術 title suffix', () => {
    const m = channelMeta('ja', 'tech');
    expect(m.title).toBe("Yuren's Blog - 技術");
    expect(m.language).toBe('ja');
    expect(m.description).toContain('書く');
  });

  it('en life has en language and Life title suffix', () => {
    const m = channelMeta('en', 'life');
    expect(m.title).toBe("Yuren's Blog - Life");
    expect(m.language).toBe('en');
    expect(m.description).toContain('Writing');
  });

  it('zh tech', () => {
    const m = channelMeta('zh', 'tech');
    expect(m.title).toBe("Yuren's Blog - 技術");
    expect(m.language).toBe('zh-Hant');
  });
});

describe('buildFeedItems', () => {
  const fakeRender = async (p: PostMeta) => `<p>html for ${p.slug}</p>`;

  it('caps at 20 items even if more posts given', async () => {
    const posts = Array.from({ length: 25 }, (_, i) =>
      makePost({ slug: `s${i}`, date: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`) }),
    );
    const items = await buildFeedItems(posts, fakeRender, 'zh');
    expect(items).toHaveLength(20);
  });

  it('returns fewer items when posts < 20', async () => {
    const posts = [makePost({ slug: 'a' }), makePost({ slug: 'b' })];
    const items = await buildFeedItems(posts, fakeRender, 'zh');
    expect(items).toHaveLength(2);
  });

  it('preserves caller-supplied order', async () => {
    const posts = [
      makePost({ slug: 'old', date: new Date('2020-01-01') }),
      makePost({ slug: 'new', date: new Date('2024-01-01') }),
    ];
    const items = await buildFeedItems(posts, fakeRender, 'zh');
    expect((items[0] as { link: string }).link).toContain('old');
  });

  it('item link includes locale prefix even for zh', async () => {
    const posts = [makePost({ slug: 'foo', locale: 'zh' })];
    const items = await buildFeedItems(posts, fakeRender, 'zh');
    expect((items[0] as { link: string }).link).toBe('/zh/posts/foo');
  });

  it('item link uses ja prefix for ja post', async () => {
    const posts = [makePost({ slug: 'foo', locale: 'ja' })];
    const items = await buildFeedItems(posts, fakeRender, 'ja');
    expect((items[0] as { link: string }).link).toBe('/ja/posts/foo');
  });

  it('item content is the rendered HTML', async () => {
    const posts = [makePost({ slug: 'foo' })];
    const items = await buildFeedItems(posts, fakeRender, 'zh');
    expect((items[0] as { content: string }).content).toBe('<p>html for foo</p>');
  });

  it('item categories localized via locale arg', async () => {
    const posts = [makePost({ slug: 'foo', category: 'tech' })];
    const items = await buildFeedItems(posts, fakeRender, 'ja');
    expect((items[0] as { categories: string[] }).categories).toEqual(['技術']);
  });
});
