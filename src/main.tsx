import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ensureGutenbergBlocks } from './bootstrap-gutenberg'
import './index.css'
import App from './App.tsx'

ensureGutenbergBlocks()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
