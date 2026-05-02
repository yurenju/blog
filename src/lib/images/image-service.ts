/**
 * Custom Astro image service that extends the default Sharp service.
 *
 * The only difference from the built-in sharp service is that GIF files are
 * kept as GIFs (preserving animation) instead of being converted to WebP.
 * All other formats (jpg, png, webp, avif, svg) are processed by sharp.
 *
 * Background: Astro's DEFAULT_OUTPUT_FORMAT is "webp", so the base
 * validateOptions sets format="webp" for any non-svg input. This converts
 * GIFs to static WebP, losing the animation. We override validateOptions to
 * preserve format="gif" for GIF inputs, and override transform to return the
 * raw buffer for GIF (like SVG passthrough) so sharp never re-encodes them.
 */
import sharpService from 'astro/assets/services/sharp';
import type { LocalImageService } from 'astro';
import type { ImageTransform, ImageOutputFormat } from 'astro';

// LocalImageTransform is the parsed URL representation: src is a plain string.
// We reconstruct the type locally since it is not exported from astro.
type LocalImageTransform = Parameters<LocalImageService['transform']>[1];
type ImageConfig = Parameters<LocalImageService['transform']>[2];

function isGifSrc(src: unknown): boolean {
  return (
    src !== null &&
    typeof src === 'object' &&
    'format' in src &&
    (src as { format: string }).format === 'gif'
  );
}

export default {
  ...sharpService,

  async validateOptions(options: ImageTransform, imageConfig: ImageConfig) {
    const validated = await sharpService.validateOptions!(options, imageConfig);
    // For GIF inputs, keep the output format as gif so that the transform
    // below can passthrough the raw buffer without re-encoding.
    if (isGifSrc(validated.src)) {
      (validated as ImageTransform & { format: string }).format = 'gif';
    }
    return validated;
  },

  async transform(
    inputBuffer: Uint8Array,
    transformOptions: LocalImageTransform,
    imageConfig: ImageConfig,
  ) {
    // Pass GIFs through unchanged to preserve animation.
    if ((transformOptions as Record<string, unknown>).format === 'gif') {
      return { data: inputBuffer, format: 'gif' as ImageOutputFormat };
    }
    return sharpService.transform(inputBuffer, transformOptions, imageConfig);
  },
} satisfies LocalImageService;
