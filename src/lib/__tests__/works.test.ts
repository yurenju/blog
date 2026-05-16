import { describe, it, expect } from 'vitest';
// Imported from `works-path` (pure helper) instead of `works` so the test
// doesn't load the `astro:content` virtual module at unit-test time.
import { parseWorkPathSegments } from '../works-path';

describe('parseWorkPathSegments', () => {
  it('parses zh main file under works dir', () => {
    const result = parseWorkPathSegments({
      filePath: 'src/content/works/2026-05-15_fujisan/富士山 — 日落的位移.md',
      id: '2026-05-15_fujisan/富士山 — 日落的位移',
    });
    expect(result).toEqual({
      dirname: '2026-05-15_fujisan',
      filename: '富士山 — 日落的位移',
    });
  });

  it('parses ja translation file', () => {
    const result = parseWorkPathSegments({
      filePath: 'src/content/works/2026-05-15_fujisan/index.ja.md',
      id: '2026-05-15_fujisan/index.ja',
    });
    expect(result).toEqual({
      dirname: '2026-05-15_fujisan',
      filename: 'index.ja',
    });
  });

  it('returns null for unparseable path', () => {
    const result = parseWorkPathSegments({ filePath: undefined, id: 'broken' });
    expect(result).toBeNull();
  });
});
