/**
 * Single entry for Gutenberg: load block-editor and block-library together
 * so @wordpress/data stores register only once (avoids "Store already registered").
 * All editor UI must import from here, not directly from @wordpress/block-editor.
 */
import {
  BlockEditorProvider,
  BlockCanvas,
  BlockInspector,
  Inserter,
} from '@wordpress/block-editor'
import { registerCoreBlocks } from '@wordpress/block-library'

export { BlockEditorProvider, BlockCanvas, BlockInspector, Inserter }

let registered = false
export function ensureGutenbergBlocks() {
  if (registered) return
  registerCoreBlocks()
  registered = true
}
