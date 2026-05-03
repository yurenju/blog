// src/lib/__tests__/excerpt.test.ts
import { describe, it, expect } from 'vitest';
import { extractExcerpt } from '../excerpt';

describe('extractExcerpt', () => {
  describe('source priority', () => {
    it('uses frontmatter description when provided', () => {
      const body = '這是內文。';
      const desc = '這是 description。';
      expect(extractExcerpt(body, desc)).toBe('這是 description。');
    });

    it('falls back to body when description is empty string', () => {
      expect(extractExcerpt('內文。', '')).toBe('內文。');
    });

    it('falls back to body when description is undefined', () => {
      expect(extractExcerpt('內文。', undefined)).toBe('內文。');
    });
  });

  describe('cleaning markdown', () => {
    it('strips Obsidian wiki image links at the start', () => {
      const body = '![[cover.jpg]]\n\n這是首段。';
      expect(extractExcerpt(body)).toBe('這是首段。');
    });

    it('strips standard markdown image at the start', () => {
      const body = '![alt text](./cover.jpg)\n\n這是首段。';
      expect(extractExcerpt(body)).toBe('這是首段。');
    });

    it('preserves text from inline markdown links', () => {
      const body = '請看[這裡](https://example.com)的說明。';
      expect(extractExcerpt(body)).toBe('請看這裡的說明。');
    });

    it('skips heading lines and uses next paragraph', () => {
      const body = '# 標題\n\n這是首段。';
      expect(extractExcerpt(body)).toBe('這是首段。');
    });

    it('strips inline HTML tags', () => {
      const body = '這是<strong>重點</strong>內容。';
      expect(extractExcerpt(body)).toBe('這是重點內容。');
    });

    it('collapses repeated whitespace inside each paragraph', () => {
      // Both paragraphs are short, so they get concatenated (see "paragraph
      // accumulation" tests below). Internal whitespace is collapsed.
      const body = '前段。\n\n\n   多   餘   空白。';
      expect(extractExcerpt(body)).toBe('前段。 多 餘 空白。');
    });
  });

  describe('paragraph accumulation', () => {
    it('joins short opening paragraph with the next when below soft limit', () => {
      // First paragraph is a 16-char dialogue, well under 80; concatenate
      // until total cleaned length reaches the soft limit.
      const opener = '「你來東京有什麼感想？」'; // 12 chars
      const body2 =
        '幾個朋友在不同時間問了這問題，剛開始來的時候、過了幾個月後、甚至到最近這個問題偶爾就會蹦出來，我也經常問自己。';
      const body = `${opener}\n\n${body2}`;
      // Combined length > 80, so truncate kicks in. Last terminator within
      // 80 chars of the joined string falls inside body2.
      const result = extractExcerpt(body);
      expect(result.startsWith(opener + ' ')).toBe(true);
      expect(result.endsWith('。')).toBe(true);
      expect(result.length).toBeLessThanOrEqual(80);
    });

    it('stops accumulating once soft limit is reached', () => {
      // First paragraph alone is over 80 chars → second paragraph never
      // contributes.
      const long = '長'.repeat(80) + '。';
      const body = `${long}\n\n後段不應該被讀到。`;
      expect(extractExcerpt(body)).toBe(long);
    });

    it('concatenates multiple short paragraphs separated by spaces', () => {
      const body = '一句。\n\n二句。\n\n三句。';
      expect(extractExcerpt(body)).toBe('一句。 二句。 三句。');
    });
  });

  describe('truncation by sentence terminators', () => {
    it('returns the whole paragraph if shorter than 80 chars', () => {
      const body = '一個短句。';
      expect(extractExcerpt(body)).toBe('一個短句。');
    });

    it('cuts at the last sentence terminator within 80 chars', () => {
      const s1 = '一'.repeat(34) + '。';
      const s2 = '二'.repeat(34) + '。';
      const s3 = '三'.repeat(50) + '。';
      expect(extractExcerpt(s1 + s2 + s3)).toBe(s1 + s2);
    });

    it('extends search to 100 chars when no terminator within 80', () => {
      const head = '甲'.repeat(85);
      const body = head + '。後面文字。';
      expect(extractExcerpt(body)).toBe(head + '。');
    });

    it('hard-cuts to 80 chars + ellipsis when no terminator within 100', () => {
      const body = '無'.repeat(150);
      const result = extractExcerpt(body);
      expect(result).toBe('無'.repeat(80) + '⋯');
    });

    it('recognises ASCII period as a terminator', () => {
      const body = 'This is a sentence. And another one that goes on much longer than expected to see truncation behavior.';
      const result = extractExcerpt(body);
      expect(result).toBe('This is a sentence.');
    });

    it('recognises full-width comma exclamation and question marks', () => {
      const body = '真的嗎？我不確定欸。' + '其'.repeat(100);
      expect(extractExcerpt(body)).toBe('真的嗎？我不確定欸。');
    });
  });

  describe('empty cases', () => {
    it('returns empty string for empty body', () => {
      expect(extractExcerpt('')).toBe('');
    });

    it('returns empty string for body with only images', () => {
      expect(extractExcerpt('![[a.jpg]]\n![[b.jpg]]')).toBe('');
    });

    it('returns empty string for body with only headings', () => {
      expect(extractExcerpt('# 標題一\n\n## 標題二')).toBe('');
    });

    it('returns empty string for body with only fenced code block', () => {
      const body = '```ts\nconst x = 1;\n```';
      expect(extractExcerpt(body)).toBe('');
    });
  });
});
