import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'node:http': 'http',
      'node:http2': 'http2',
      'node:fs': 'fs',
      'node:events': 'events',
      'node:https': 'https',
      'node:net': 'net',
      'node:url': 'url',
      'node:stream': 'stream',
    },
  },
});
