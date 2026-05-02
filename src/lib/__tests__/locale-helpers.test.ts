// src/lib/__tests__/locale-helpers.test.ts
import { describe, it, expect } from 'vitest';
import { inferLocaleFromFilename, computeAvailableLocales } from '../locale-helpers';
import type { Locale } from '../i18n';

describe('inferLocaleFromFilename', () => {
  it('returns ja for index.ja', () => {
    expect(inferLocaleFromFilename('index.ja')).toBe('ja');
  });
  it('returns en for index.en', () => {
    expect(inferLocaleFromFilename('index.en')).toBe('en');
  });
  it('returns zh for plain index', () => {
    expect(inferLocaleFromFilename('index')).toBe('zh');
  });
  it('returns zh for any other filename', () => {
    expect(inferLocaleFromFilename('2025-01-01_foo')).toBe('zh');
    expect(inferLocaleFromFilename('我的文章')).toBe('zh');
  });
});

describe('computeAvailableLocales', () => {
  type Row = { group: string; dirname: string; locale: Locale };

  it('returns single zh for posts with no translations', () => {
    const rows: Row[] = [{ group: '2024', dirname: '2024-01-01_a', locale: 'zh' }];
    const map = computeAvailableLocales(rows);
    expect(map.get('2024::2024-01-01_a')).toEqual(['zh']);
  });

  it('aggregates locales by (group, dirname) and sorts as zh,ja,en', () => {
    const rows: Row[] = [
      { group: '2024', dirname: '2024-02-02_b', locale: 'en' },
      { group: '2024', dirname: '2024-02-02_b', locale: 'ja' },
      { group: '2024', dirname: '2024-02-02_b', locale: 'zh' },
    ];
    const map = computeAvailableLocales(rows);
    expect(map.get('2024::2024-02-02_b')).toEqual(['zh', 'ja', 'en']);
  });

  it('handles orphan translation (ja-only, no zh)', () => {
    const rows: Row[] = [
      { group: '2024', dirname: '2024-03-03_c', locale: 'ja' },
    ];
    const map = computeAvailableLocales(rows);
    expect(map.get('2024::2024-03-03_c')).toEqual(['ja']);
  });

  it('does not cross-pollute different dirnames', () => {
    const rows: Row[] = [
      { group: '2024', dirname: 'a', locale: 'zh' },
      { group: '2024', dirname: 'b', locale: 'ja' },
    ];
    const map = computeAvailableLocales(rows);
    expect(map.get('2024::a')).toEqual(['zh']);
    expect(map.get('2024::b')).toEqual(['ja']);
  });
});
