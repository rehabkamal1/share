import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@shareflow/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@shareflow/ui-tokens': path.resolve(__dirname, '../../packages/ui-tokens/src'),
    },
  },
});

