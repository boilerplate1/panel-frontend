const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

// https://vite.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  base: './',
  css: {
    modules: {
      generateScopedName: '[name]__[hash:base64:5]__[local]',
    },
    devSourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild', // Default for faster builds
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react') || id.includes('@tanstack')) {
              return 'vendor-ui';
            }
            return 'vendor-base';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
