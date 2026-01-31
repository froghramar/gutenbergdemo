/**
 * Ensures the whole app uses a single registry from @wordpress/data.
 * useRegistry() with no provider above returns the default registry (with all
 * stores). We re-provide it so every subtree gets the same registry and
 * selector.registry is never undefined when selectors run.
 */
import type { ReactNode } from 'react'
import { useRegistry, RegistryProvider } from '@wordpress/data'

// #region agent log
const LOG = (msg: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7242/ingest/4c43da5b-e111-42d8-bec3-cb9fb53aaa55', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'RegistryBridge.tsx', message: msg, data, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId }) }).catch(() => {});
};
// #endregion

export function RegistryBridge({ children }: { children: ReactNode }) {
  const registry = useRegistry()
  // #region agent log
  const hasRegistry = registry != null;
  const hasSelect = typeof (registry as { select?: unknown })?.select === 'function';
  const storeNames = registry && typeof (registry as { stores?: Record<string, unknown> }).stores === 'object' ? Object.keys((registry as { stores: Record<string, unknown> }).stores) : [];
  const selectRef = (registry as { select?: unknown })?.select != null ? String((registry as { select: unknown }).select).slice(0, 80) : 'none';
  LOG('RegistryBridge useRegistry()', { hasRegistry, hasSelect, storeNames, storeCount: storeNames.length, selectRef }, 'H1');
  LOG('RegistryBridge registry identity', { registryType: typeof registry, selectRef }, 'H2');
  // #endregion
  return <RegistryProvider value={registry as never}>{children}</RegistryProvider>
}
