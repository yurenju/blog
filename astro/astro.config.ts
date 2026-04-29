import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://yurenju.blog',
  trailingSlash: 'ignore',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans TC',
      cssVariable: '--font-sans',
      weights: [400, 500, 700],
    },
    {
      provider: fontProviders.google(),
      name: 'Noto Serif TC',
      cssVariable: '--font-serif',
      weights: [400, 700],
    },
  ],
});
