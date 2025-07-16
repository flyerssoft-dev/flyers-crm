/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@library': path.resolve(__dirname, 'src/library'),
      '@feature': path.resolve(__dirname, 'src/feature'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@enum': path.resolve(__dirname, 'src/enum'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    globals: true,
    include: ['**/*.test.tsx'],
    exclude: ['**/*.stories.tsx'], // Exclude Storybook files
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
  },
});
