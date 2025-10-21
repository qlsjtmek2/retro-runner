import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/retro-runner/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
