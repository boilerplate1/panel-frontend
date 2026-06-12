const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

// https://vite.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: '[name]__[hash:base64:5]__[local]',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
