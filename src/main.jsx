import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
// Self-hosted fonts: no request to Google servers (GDPR) and no third-party
// round trip before first paint. Only the weights used in tokens.css.
import '@fontsource/oswald/600.css'
import '@fontsource/oswald/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './styles/global.css'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App path={window.location.pathname} />
    <Analytics />
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.js), so hydrate it.
// The dev server serves an empty root, so render from scratch there.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
