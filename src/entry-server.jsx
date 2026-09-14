// Server entry used only at build time by scripts/prerender.js.
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { applyHead } from './lib/applyHead.js'

export { ROUTES } from './routes.js'

export function renderPage(template, route) {
  const appHtml = renderToString(<App path={route.path} />)
  const withHead = applyHead(template, route.head)
  if (!withHead.includes('<div id="root"></div>')) {
    throw new Error('Template is missing an empty <div id="root"></div>')
  }
  return withHead.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
}
