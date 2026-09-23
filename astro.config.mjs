import { readFileSync } from 'node:fs'
import http from 'node:http'
import { defineConfig } from 'astro/config'

// `astro preview` serves the build with the production security headers from
// vercel.json, so browser tests catch Content-Security-Policy violations before
// deploying. The dev server keeps none: Vite's dev client relies on inline code.
const vercelConfig = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
const productionHeaders = Object.fromEntries(
  vercelConfig.headers
    .find(({ source }) => source === '/(.*)')
    .headers.map(({ key, value }) => [key, value]),
)

// Vite's preview server only applies `server.headers` when it serves an actual file
// from disk (astro/dist/core/preview/vite-plugin-astro-preview.js swaps in its own
// handler for an unmatched route, which sets no headers at all). vercel.json's
// '/(.*)' rule has no such gap: Vercel attaches these headers to every response,
// including the branded 404. Patching the HTTP server's 'request' event, once, in the
// same process `astro preview` runs in, closes that gap locally: the headers land on
// the response object before any route handling runs, so nothing downstream misses them.
// Skip Vercel's own platform paths (Web Analytics' /_vercel/... script): they only
// exist on real Vercel, so locally they always 404, and adding
// X-Content-Type-Options: nosniff to that 404 makes the browser refuse to run the
// script it expected there — a purely local failure mode, since Vercel serves the
// real file at that path in production. e2e/support.ts's `isVercelOnly` carves out the
// same paths for the same reason.
let previewHeadersPatched = false
function forcePreviewHeadersOnEveryResponse() {
  if (previewHeadersPatched) return
  previewHeadersPatched = true
  const originalEmit = http.Server.prototype.emit
  http.Server.prototype.emit = function (event, ...args) {
    if (event === 'request') {
      const req = args[0]
      const res = args[1]
      if (!res.headersSent && !req.url?.startsWith('/_vercel/')) {
        for (const [key, value] of Object.entries(productionHeaders)) res.setHeader(key, value)
      }
    }
    return originalEmit.call(this, event, ...args)
  }
}

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://tecnitextil.vercel.app',
  output: 'static',
  build: {
    // aviso-legal.html instead of aviso-legal/index.html, and hashed files in /assets,
    // the paths vercel.json and lighthouserc.json already expect.
    format: 'file',
    assets: 'assets',
    inlineStylesheets: 'never',
  },
  server: ({ command }) => {
    if (command !== 'preview') return {}
    forcePreviewHeadersOnEveryResponse()
    return { headers: productionHeaders }
  },
  vite: {
    // The CSP only allows same-origin files: never inline scripts or assets.
    build: { assetsInlineLimit: 0 },
  },
})
