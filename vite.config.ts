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
    },
  },
  optimizeDeps: {
    // Force WordPress + postcss deps into one pre-bundle so (1) Node polyfills
    // apply and (2) @wordpress/data stores register only once
    include: [
      '@wordpress/blocks',
      '@wordpress/data',
      '@wordpress/block-editor',
      '@wordpress/block-library',
      '@wordpress/element',
      '@wordpress/components',
      'source-map-js',
    ],
  },
})
