import { describe, it, expect } from 'vitest';
import { buildLanguageLinks } from '../i18n';

describe('buildLanguageLinks', () => {
  it('on home page: keeps the path, swaps locale prefix', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh',
      isPostPage: false,
    });
    expect(links).toEqual([
      { locale: 'ja', href: '/ja' },
      { locale: 'en', href: '/en' },
    ]);
  });

  it('on category page: keeps the suffix, swaps locale prefix', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/tech',
      isPostPage: false,
    });
    expect(links).toEqual([
      { locale: 'ja', href: '/ja/tech' },
      { locale: 'en', href: '/en/tech' },
    ]);
  });

  it('on post page with full availableLocales: links to translation', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/posts/foo',
      isPostPage: true,
      slug: 'foo',
      availableLocales: ['zh', 'ja', 'en'],
    });
    expect(links).toEqual([
      { locale: 'ja', href: '/ja/posts/foo' },
      { locale: 'en', href: '/en/posts/foo' },
    ]);
  });

  it('on post page with partial availableLocales: links missing locale to home', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/posts/foo',
      isPostPage: true,
      slug: 'foo',
      availableLocales: ['zh', 'ja'],
    });
    expect(links).toEqual([
      { locale: 'ja', href: '/ja/posts/foo' },
      { locale: 'en', href: '/en' },
    ]);
  });

  it('on zh-only /archives: switching to ja/en falls back to home', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/archives',
      isPostPage: false,
    });
    expect(links).toEqual([
      { locale: 'ja', href: '/ja' },
      { locale: 'en', href: '/en' },
    ]);
  });

  it('on zh-only /archives/tech: switching to ja/en falls back to home', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/archives/tech',
      isPostPage: false,
    });
    expect(links).toEqual([
      { locale: 'ja', href: '/ja' },
      { locale: 'en', href: '/en' },
    ]);
  });

  it('excludes the current locale from results', () => {
    const links = buildLanguageLinks({
      currentLocale: 'ja',
      pathname: '/ja/tech',
      isPostPage: false,
    });
    expect(links.map((l) => l.locale)).toEqual(['zh', 'en']);
  });
});

describe('buildLanguageLinks for work pages', () => {
  it('links to /[target]/studio/[slug] when translation available', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/studio/2026-05-15_fujisan',
      isPostPage: false,
      isWorkPage: true,
      slug: '2026-05-15_fujisan',
      availableLocales: ['zh', 'ja', 'en'],
    });
    expect(links.find((l) => l.locale === 'ja')?.href).toBe('/ja/studio/2026-05-15_fujisan');
    expect(links.find((l) => l.locale === 'en')?.href).toBe('/en/studio/2026-05-15_fujisan');
  });

  it('falls back to /[target] home when translation missing', () => {
    const links = buildLanguageLinks({
      currentLocale: 'zh',
      pathname: '/zh/studio/2026-05-15_fujisan',
      isPostPage: false,
      isWorkPage: true,
      slug: '2026-05-15_fujisan',
      availableLocales: ['zh'],
    });
    expect(links.find((l) => l.locale === 'ja')?.href).toBe('/ja');
  });
});
