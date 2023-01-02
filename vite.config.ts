import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import builtins from 'rollup-plugin-node-builtins';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

const builtinsPlugin = builtins({ crypto: true });
builtinsPlugin.name = 'builtins';

export default defineConfig({
  plugins: [react(), builtinsPlugin],
  build: {
    target: 'ESNext',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill({
          exclude: ['node_modules/@trustwallet/**'],
        }),
      ],
    },
  },
  server: {
    open: '/index.html',
    port: 3000,
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
});
