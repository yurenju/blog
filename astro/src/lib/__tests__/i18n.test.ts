import { describe, it, expect } from 'vitest';
import { localePath, LOCALES, HTML_LANG, HREFLANG, LANGUAGE_NAMES, t } from '../i18n';

describe('LOCALES', () => {
  it('contains zh, ja, en in this order', () => {
    expect(LOCALES).toEqual(['zh', 'ja', 'en']);
  });
});

describe('localePath', () => {
  it('builds locale-only path when no segments', () => {
    expect(localePath('zh')).toBe('/zh');
  });

  it('joins segments with single slash', () => {
    expect(localePath('ja', 'tech')).toBe('/ja/tech');
    expect(localePath('en', 'posts', '2024-foo')).toBe('/en/posts/2024-foo');
  });

  it('drops empty segments', () => {
    expect(localePath('zh', '', 'tech')).toBe('/zh/tech');
  });
});

describe('HTML_LANG / HREFLANG / LANGUAGE_NAMES', () => {
  it('maps every locale', () => {
    expect(HTML_LANG.zh).toBe('zh-Hant-TW');
    expect(HTML_LANG.ja).toBe('ja');
    expect(HTML_LANG.en).toBe('en');
    expect(HREFLANG.zh).toBe('zh-Hant');
    expect(LANGUAGE_NAMES.zh).toBe('繁體中文');
    expect(LANGUAGE_NAMES.ja).toBe('日本語');
    expect(LANGUAGE_NAMES.en).toBe('English');
  });
});

describe('t(locale)', () => {
  it('returns nav strings per locale', () => {
    expect(t('zh').nav.tech).toBe('技術');
    expect(t('ja').nav.tech).toBe('技術');
    expect(t('en').nav.tech).toBe('Tech');
  });
});

describe('UI_TEXT site.description', () => {
  it('zh has zh description', () => {
    expect(t('zh').site.description).toContain('撰寫');
  });
  it('ja has ja description', () => {
    expect(t('ja').site.description).toContain('書く');
  });
  it('en has en description', () => {
    expect(t('en').site.description).toContain('Writing');
  });
});

describe('UI_TEXT rss labels', () => {
  it('per-locale rss labels for tech/life/allPosts', () => {
    expect(t('zh').rss.tech).toBe('技術');
    expect(t('zh').rss.life).toBe('生活');
    expect(t('zh').rss.allPosts).toBe('全部文章');
    expect(t('ja').rss.tech).toBe('技術');
    expect(t('ja').rss.life).toBe('生活');
    expect(t('ja').rss.allPosts).toBe('すべての記事');
    expect(t('en').rss.tech).toBe('Tech');
    expect(t('en').rss.life).toBe('Life');
    expect(t('en').rss.allPosts).toBe('All Posts');
  });
});
