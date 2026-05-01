import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      'astro:content': path.resolve(__dirname, 'src/__mocks__/astro-content.ts'),
      'astro': path.resolve(__dirname, 'src/__mocks__/astro.ts'),
    },
  },
  test: {
    include: ['src/**/__tests__/*.test.ts'],
    environment: 'node',
  },
});
