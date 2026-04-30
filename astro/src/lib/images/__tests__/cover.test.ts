import { describe, it, expect } from 'vitest';
import { findFirstBodyImage } from '../cover';

describe('findFirstBodyImage', () => {
  it('returns first ![](path) match with allowed extension', () => {
    const body = 'Intro\n\n![alt](images/foo.jpg)\n\nmore';
    expect(findFirstBodyImage(body)).toEqual({ kind: 'rel', path: 'images/foo.jpg' });
  });

  it('returns first ![[name]] match with allowed extension', () => {
    expect(findFirstBodyImage('![[foo.png]]')).toEqual({ kind: 'wiki', name: 'foo.png' });
  });

  it('skips gif/svg/mp4 and returns next allowed image', () => {
    const body = '![](a.gif)\n\n![](b.svg)\n\n![](c.jpg)';
    expect(findFirstBodyImage(body)).toEqual({ kind: 'rel', path: 'c.jpg' });
  });

  it('skips external URLs (http, https, //, leading /)', () => {
    const body = '![](https://x/a.jpg)\n\n![](/posts/b.jpg)\n\n![](c.jpg)';
    expect(findFirstBodyImage(body)).toEqual({ kind: 'rel', path: 'c.jpg' });
  });

  it('case-insensitive extension matching', () => {
    expect(findFirstBodyImage('![](a.JPG)')).toEqual({ kind: 'rel', path: 'a.JPG' });
  });

  it('returns null when no allowed image is found', () => {
    expect(findFirstBodyImage('No images here')).toBeNull();
    expect(findFirstBodyImage('![](a.gif)')).toBeNull();
  });

  it('returns the earlier of mixed wiki and standard syntax', () => {
    expect(findFirstBodyImage('![[a.png]] then ![](b.jpg)')).toEqual({
      kind: 'wiki',
      name: 'a.png',
    });
    expect(findFirstBodyImage('![](a.jpg) then ![[b.png]]')).toEqual({
      kind: 'rel',
      path: 'a.jpg',
    });
  });
});
