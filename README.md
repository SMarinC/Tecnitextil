# TECNITEXTIL

Production website for TECNITEXTIL, an industrial sewing machine repair and maintenance business in Spain. A fast, accessible and fully tested static site whose one job is to turn every visit into a WhatsApp chat or a phone call.

**[Live site](https://tecnitextil.vercel.app)** · [Leer en español](README.es.md)

[![checks](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml/badge.svg)](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml)

![TECNITEXTIL home page on desktop](.github/assets/screenshot-desktop.jpg)

## Highlights

- **Prerendered static HTML.** A client build and a server build run together, and `scripts/prerender.js` writes the final HTML for every route before React hydrates it. Search engines and link previews get the full page without running JavaScript.
- **Content separated from code.** All copy and business data live in `src/content/`, so text changes never touch components. Tests guarantee every menu link points to a section that exists.
- **Accessibility tested in the browser.** Playwright runs axe on every page and fails on serious or critical violations. It also checks that pages reflow at 200% text size on a 320px screen, that menu navigation respects reduced motion, and that keyboard focus follows the section you jump to.
- **Performance by default.** Self-hosted Latin-subset fonts with preloads, WebP images with explicit dimensions, analytics loaded from a deferred chunk, and cache headers for hashed build assets.
- **Strict security headers.** A Content-Security-Policy that only allows same-origin resources, plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.
- **SEO from a single source.** Canonical URLs, Open Graph tags, `LocalBusiness` structured data, `robots.txt` and `sitemap.xml` are all generated from one site URL.

## Screenshots

<p>
  <img src=".github/assets/screenshot-toldos.jpg" alt="Specialised section for automated awning sewing machines on desktop" width="68%">
  <img src=".github/assets/screenshot-mobile.jpg" alt="Home page on a mobile screen" width="28%">
</p>

## Tech stack

React 19 · Vite 8 · CSS Modules · Vitest 5 and Testing Library · Playwright and axe · Lighthouse CI · ESLint · Prettier · husky and lint-staged · GitHub Actions · Dependabot · Vercel

## Quality gates

Every pull request and every push to `main` runs three CI jobs:

| Job                        | What it checks                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Lint, unit tests and build | Prettier formatting, ESLint, 129 unit and component tests, and the full production build with prerendering      |
| Browser tests              | 16 Playwright scenarios on a mobile device (Pixel 7) and on desktop, including axe accessibility audits         |
| Lighthouse budgets         | Fails if accessibility is below 95, SEO below 90 or CLS above 0.1; warns on performance, best practices and LCP |

A pre-commit hook formats and lints the staged files, and Dependabot proposes npm updates weekly and GitHub Actions updates monthly.

## Getting started

Requires Node.js 24 (pinned in `.nvmrc`; with nvm, run `nvm use`).

```sh
npm ci
npm run dev          # http://localhost:5173
```

## Scripts

| Command            | What it does                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `npm run dev`      | Development server with hot reload                                                                           |
| `npm run build`    | Production build in `dist/`: client, server render, prerendered pages, `robots.txt` and `sitemap.xml`        |
| `npm run preview`  | Serves `dist/` with the same security headers as production                                                  |
| `npm test`         | Unit and component tests (Vitest and Testing Library)                                                        |
| `npm run test:e2e` | Browser tests (Playwright and axe) against the build. First run: `npx playwright install chromium`           |
| `npm run lint`     | ESLint                                                                                                       |
| `npm run format`   | Formats the code with Prettier (`format:check` only checks)                                                  |
| `npm run images`   | Regenerates `public/logo.webp` from `public/logo.png` (run it after changing the logo and commit the result) |

## Project structure

```
src/
  content/          # all copy and business data (edit here)
    company.js      #   name, phone, coverage
    home.js         #   text for each section of the home page
    sections.js     #   section ids and menu
    legal.js        #   legal notice, privacy policy and owner details
    seo.js          #   site URL, titles, structured data
  components/       # one component per section (.jsx + .module.css)
  pages/            # full pages (home)
  hooks/            # reusable React logic (active section, media queries)
  lib/              # pure, tested functions (head tags, sitemap, scrolling)
  styles/           # design tokens and global styles
  routes.js         # list of site pages
  entry-server.jsx  # server render used by the prerender step
scripts/
  prerender.js      # writes the final HTML for each page
e2e/                # browser tests, one per use case (UC-xx)
```

### Common changes

- **Text, phone number or brands:** edit `src/content/`.
- **A new page:** add it to `src/routes.js`. The prerender step, the sitemap and the route tests pick it up automatically.
- **A custom domain:** set the public `VITE_SITE_URL` environment variable in Vercel (or in a local `.env.local`). It defaults to `https://tecnitextil.vercel.app`.

## Deployment

Vercel builds with `npm run build` and serves `dist/` with clean URLs, security headers and asset caching (see `vercel.json`). Node.js is pinned to `24.x` through `engines`.

Because the Content-Security-Policy only allows same-origin resources, the Vercel preview toolbar (loaded from `vercel.live`) is disabled on purpose with the `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` environment variable in the Vercel project.
