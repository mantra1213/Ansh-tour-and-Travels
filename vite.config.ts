
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the code to access process.env.API_KEY in the browser
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    // Ensure the service worker and manifest are handled
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
  }
});
