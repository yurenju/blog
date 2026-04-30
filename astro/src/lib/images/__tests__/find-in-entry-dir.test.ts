import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { buildIndex } from '../find-in-entry-dir';

const fixtureDir = path.resolve(__dirname, 'fixtures/post-a');

describe('buildIndex', () => {
  it('indexes files at the root of the entry directory', () => {
    const index = buildIndex(fixtureDir);
    expect(index.get('cover.jpg')).toBe(path.join(fixtureDir, 'cover.jpg'));
  });

  it('recursively indexes subdirectories', () => {
    const index = buildIndex(fixtureDir);
    expect(index.get('0.png')).toBe(path.join(fixtureDir, 'images', '0.png'));
    expect(index.get('nested.gif')).toBe(
      path.join(fixtureDir, 'images', 'sub', 'nested.gif'),
    );
  });

  it('preserves filename case (no lowercasing)', () => {
    const index = buildIndex(fixtureDir);
    // Map 沒有 'COVER.JPG' 大寫 key
    expect(index.get('COVER.JPG')).toBeUndefined();
  });

  it('returns empty map for non-existent directory', () => {
    const index = buildIndex(path.join(fixtureDir, 'nope'));
    expect(index.size).toBe(0);
  });
});
