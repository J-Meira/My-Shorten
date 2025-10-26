import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: '../MyShorten.API/wwwroot',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~': '/src',
      '~/@types': '/src/@types',
      '~/components': '/src/components',
      '~/config': '/src/config',
      '~/pages': '/src/pages',
      '~/redux': '/src/redux',
      '~/routes': '/src/routes',
      '~/services': '/src/services',
      '~/utils': '/src/utils',
    },
  },
});
