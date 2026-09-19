import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

// Runs against the production build served by `astro preview` with the security
// headers from vercel.json. Set BASE_URL to test an already running server or a Vercel
// preview deployment instead.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.BASE_URL ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // CI reuses the dist/ from the first job; everywhere else the site is built first.
        command: `${process.env.GITHUB_ACTIONS ? '' : 'npm run build && '}npm run preview -- --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        // Never test a stale build left running from an earlier session.
        reuseExistingServer: false,
        timeout: 180_000,
        // Keeps `astro preview` in the foreground in runtimes that would otherwise send it
        // to the background (AI coding agents, for example); harmless everywhere else.
        env: { ASTRO_PREVIEW_BACKGROUND: '1' },
      },
})
