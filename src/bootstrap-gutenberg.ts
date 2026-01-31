/**
 * Single entry for Gutenberg: load block-editor and block-library together
 * so @wordpress/data stores register only once (avoids "Store already registered").
 * All editor UI must import from here, not directly from @wordpress/block-editor.
 */
import {
  BlockEditorProvider,
  BlockCanvas,
  BlockInspector,
} from '@wordpress/block-editor'
import { registerCoreBlocks } from '@wordpress/block-library'

export { BlockEditorProvider, BlockCanvas, BlockInspector }

// #region agent log
const LOG = (msg: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7242/ingest/4c43da5b-e111-42d8-bec3-cb9fb53aaa55', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'bootstrap-gutenberg.ts', message: msg, data, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId }) }).catch(() => {});
};
// #endregion

let registered = false
export function ensureGutenbergBlocks() {
  // #region agent log
  LOG('ensureGutenbergBlocks entry', { registered }, 'H4');
  // #endregion
  if (registered) return
  registerCoreBlocks()
  registered = true
  // #region agent log
  LOG('ensureGutenbergBlocks done registerCoreBlocks', { registered }, 'H4');
  // #endregion
}
