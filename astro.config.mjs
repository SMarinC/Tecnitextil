import { readFileSync } from 'node:fs'
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
  server: ({ command }) => (command === 'preview' ? { headers: productionHeaders } : {}),
  vite: {
    // The CSP only allows same-origin files: never inline scripts or assets.
    build: { assetsInlineLimit: 0 },
  },
})
