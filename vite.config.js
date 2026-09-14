import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    // Unit/component tests only; browser tests in e2e/ run with Playwright.
    include: ['src/**/*.test.{js,jsx}'],
  },
})
