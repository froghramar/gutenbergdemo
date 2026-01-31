import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['path', 'url'],
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      fs: path.resolve(__dirname, 'src/stubs/fs.ts'),
      'node:fs': path.resolve(__dirname, 'src/stubs/fs.ts'),
      // Force source-map-js to be bundled (Vite externalizes it for "browser compat")
      'source-map-js': path.resolve(__dirname, 'node_modules/source-map-js/source-map.js'),
    },
  },
  optimizeDeps: {
    include: [
      '@wordpress/blocks',
      '@wordpress/data',
      '@wordpress/block-editor',
      '@wordpress/block-library',
      '@wordpress/element',
      '@wordpress/components',
      'postcss',
      'source-map-js',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // Put all WordPress packages in one chunk so @wordpress/data stores
        // register only once (avoids "Store already registered")
        manualChunks(id) {
          if (id.includes('node_modules/@wordpress/')) {
            return 'wordpress'
          }
        },
      },
    },
  },
})
