import { describe, it, expect } from 'vitest';
import { channelMeta } from '../rss-feed';

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
