import { describe, it, expect } from 'vitest';
import { SITE_LOGO, absoluteUrl, buildArticleSchema } from '../seo';
import type { PostMeta } from '../posts';

const SITE = new URL('https://yurenju.blog');

describe('SITE_LOGO', () => {
  it('points to logo.jpg with valid dimensions', () => {
    expect(SITE_LOGO.url).toBe('https://yurenju.blog/logo.jpg');
    expect(SITE_LOGO.width).toBeGreaterThan(0);
    expect(SITE_LOGO.height).toBeGreaterThan(0);
  });
});

describe('absoluteUrl', () => {
  it('returns absolute http URL unchanged', () => {
    expect(absoluteUrl('https://example.com/x', SITE)).toBe('https://example.com/x');
  });
  it('returns absolute https URL unchanged', () => {
    expect(absoluteUrl('https://yurenju.blog/foo', SITE)).toBe('https://yurenju.blog/foo');
  });
  it('joins relative path against site', () => {
    expect(absoluteUrl('/foo/bar', SITE)).toBe('https://yurenju.blog/foo/bar');
  });
  it('handles _astro hashed asset path', () => {
    expect(absoluteUrl('/_astro/cover.HASH.webp', SITE)).toBe(
      'https://yurenju.blog/_astro/cover.HASH.webp',
    );
  });
});

function makePost(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    entry: { id: 'stub' } as PostMeta['entry'],
    slug: 'foo',
    group: '2024',
    archived: false,
    category: 'tech',
    title: 'Foo Title',
    date: new Date('2024-01-15T00:00:00Z'),
    description: 'Foo description',
    locale: 'zh',
    availableLocales: ['zh'],
    cover: null,
    ...overrides,
  };
}

describe('buildArticleSchema', () => {
  const img = 'https://yurenju.blog/_astro/cover.webp';

  it('produces zh-Hant inLanguage for zh', () => {
    const s = buildArticleSchema(makePost({ locale: 'zh' }), 'zh', img);
    const obj = s as Record<string, unknown>;
    expect(obj['@type']).toBe('Article');
    expect(obj['inLanguage']).toBe('zh-Hant');
    expect(obj['headline']).toBe('Foo Title');
    expect(obj['description']).toBe('Foo description');
    expect(obj['image']).toBe(img);
    expect(obj['datePublished']).toBe('2024-01-15T00:00:00.000Z');
  });

  it('produces ja inLanguage for ja', () => {
    const s = buildArticleSchema(makePost({ locale: 'ja' }), 'ja', img);
    expect((s as Record<string, unknown>)['inLanguage']).toBe('ja');
  });

  it('produces en inLanguage for en', () => {
    const s = buildArticleSchema(makePost({ locale: 'en' }), 'en', img);
    expect((s as Record<string, unknown>)['inLanguage']).toBe('en');
  });

  it('contains author Person', () => {
    const s = buildArticleSchema(makePost(), 'zh', img);
    const author = (s as Record<string, unknown>)['author'] as Record<string, unknown>;
    expect(author['@type']).toBe('Person');
    expect(author['name']).toBe('Yuren Ju');
  });

  it('@context is schema.org', () => {
    const s = buildArticleSchema(makePost(), 'zh', img);
    expect((s as Record<string, unknown>)['@context']).toBe('https://schema.org');
  });
});
