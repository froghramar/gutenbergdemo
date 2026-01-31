import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ensureGutenbergBlocks } from './bootstrap-gutenberg'
import { RegistryBridge } from './RegistryBridge'
import './index.css'
import App from './App'

// #region agent log
const LOG = (msg: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7242/ingest/4c43da5b-e111-42d8-bec3-cb9fb53aaa55', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'main.tsx', message: msg, data, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId }) }).catch(() => {});
};
if (typeof window !== 'undefined') {
  window.addEventListener('error', (ev) => {
    if (ev.message?.includes('select') || ev.error?.stack?.includes('wrappedSelector')) {
      LOG('global error (select/selector)', { message: ev.message, stack: ev.error?.stack ?? null }, 'H6');
    }
  });
}
// #endregion

// Register blocks (and their stores) on the default registry before first render
// #region agent log
LOG('before ensureGutenbergBlocks', {}, 'H4');
// #endregion
ensureGutenbergBlocks()
// #region agent log
LOG('after ensureGutenbergBlocks', {}, 'H4');
// #endregion

// #region agent log
LOG('about to render RegistryBridge', {}, 'H1');
// #endregion
createRoot(document.getElementById('root')!).render(
  <RegistryBridge>
    <StrictMode>
      <App />
    </StrictMode>
  </RegistryBridge>,
)
