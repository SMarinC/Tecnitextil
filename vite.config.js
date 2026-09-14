import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Apply the same security headers as production (vercel.json) to
// `vite preview`, so browser tests catch Content-Security-Policy violations
// before deploying.
const vercelConfig = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
const productionHeaders = Object.fromEntries(
  vercelConfig.headers
    .find(({ source }) => source === '/(.*)')
    .headers.map(({ key, value }) => [key, value]),
)

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: productionHeaders,
  },
  test: {
    environment: 'node',
    // Unit/component tests only; browser tests in e2e/ run with Playwright.
    include: ['src/**/*.test.{js,jsx}'],
  },
})
