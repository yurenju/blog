import { describe, it, expect } from 'vitest';
import imageService from '../image-service';

describe('image-service GIF passthrough', () => {
  it('returns input buffer unchanged for GIF format', async () => {
    const inputBuffer = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]); // "GIF89a"
    const result = await imageService.transform(
      inputBuffer,
      { format: 'gif' } as any,
      {} as any,
    );
    expect(result.data).toBe(inputBuffer);
    expect(result.format).toBe('gif');
  });

  it('does not return raw input for non-gif formats (delegates to sharp)', async () => {
    // We cannot invoke sharp in unit tests (requires binary deps and Astro runtime).
    // This test merely confirms the GIF early-return guard is format-specific:
    // a non-gif format must NOT hit the passthrough branch, so the function will
    // attempt to call sharpService.transform. We verify this by checking that
    // the returned data is NOT the same buffer reference (or that it throws,
    // which means sharp tried to process — either outcome confirms delegation).
    const inputBuffer = new Uint8Array([0xff, 0xd8, 0xff]); // JPEG magic bytes
    let threw = false;
    let result: { data: Uint8Array } | undefined;
    try {
      result = await imageService.transform(
        inputBuffer,
        { format: 'jpeg' } as any,
        {} as any,
      );
    } catch {
      threw = true;
    }
    // Either sharp threw (no binary context) or returned a different buffer.
    // In both cases, the raw input was NOT returned directly.
    if (!threw && result) {
      expect(result.data).not.toBe(inputBuffer);
    } else {
      expect(threw).toBe(true);
    }
  });
});
