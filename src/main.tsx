import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupApiFetchMock } from './api-fetch-mock'
import { ensureGutenbergBlocks } from './bootstrap-gutenberg'
import { RegistryBridge } from './RegistryBridge'
import './index.css'
import App from './App'

// Mock WP REST API so block editor works without a backend
setupApiFetchMock()

// Register blocks (and their stores) on the default registry before first render
ensureGutenbergBlocks()

createRoot(document.getElementById('root')!).render(
  <RegistryBridge>
    <StrictMode>
      <App />
    </StrictMode>
  </RegistryBridge>,
)
