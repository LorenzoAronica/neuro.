import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seo } from './scripts/seo';

export default defineConfig({
  // Relative asset URLs also work under /repository/ on GitHub Pages.
  base: process.env.VITE_BASE_PATH || './',
  plugins: [react(), seo()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (/node_modules\/(three|@react-three)/.test(id)) return 'brain-engine';
          if (/node_modules\/(jspdf|fflate|fast-png|iobuffer)/.test(id)) return 'pdf-engine';
        },
      },
    },
  },
});
