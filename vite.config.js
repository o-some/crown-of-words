import { defineConfig } from 'vite';

const base = process.env.CROWN_BASE_PATH || '/';

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
