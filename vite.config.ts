import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: 'esnext',
    minify: false, // 프로토타입이므로 minify 비활성화
    sourcemap: true
  }
});
