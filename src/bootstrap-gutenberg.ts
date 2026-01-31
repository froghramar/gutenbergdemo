/**
 * Load Gutenberg packages and register core blocks once before the app renders.
 * This ensures @wordpress/data stores (core/blocks, core/block-editor, etc.)
 * are registered only once and avoids "Store already registered" errors when
 * using Vite code-splitting.
 */
import { registerCoreBlocks } from '@wordpress/block-library'

let registered = false
export function ensureGutenbergBlocks() {
  if (registered) return
  registerCoreBlocks()
  registered = true
}
