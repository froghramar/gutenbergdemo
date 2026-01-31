/**
 * Ensures the whole app uses a single registry from @wordpress/data.
 * useRegistry() with no provider above returns the default registry (with all
 * stores). We re-provide it so every subtree gets the same registry and
 * selector.registry is never undefined when selectors run.
 */
import type { ReactNode } from 'react'
import { useRegistry, RegistryProvider } from '@wordpress/data'

export function RegistryBridge({ children }: { children: ReactNode }) {
  const registry = useRegistry()
  return <RegistryProvider value={registry as never}>{children}</RegistryProvider>
}
