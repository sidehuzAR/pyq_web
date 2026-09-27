import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/cdn/scans': {
        target: 'https://sxgdwnxvrdtjbucwlpgu.supabase.co/storage/v1/object/public/paper-scans',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn\/scans/, '')
      }
    }
  }
});
