# TECNITEXTIL

Production site of a Spanish business that repairs, maintains and sells industrial sewing machines. Its one job is to turn every visit into a WhatsApp chat or a call.

**[Live site](https://tecnitextil.vercel.app)** · [Leer en español](README.es.md)

[![checks](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml/badge.svg)](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml)

![TECNITEXTIL home page on desktop](.github/assets/screenshot-desktop.jpg)

## Highlights

- **Static HTML, JavaScript only where it's needed.** Astro renders every page at build time; the only client scripts are the header menu and Web Analytics, about 3 kB per page. A browser test fails if any page ships more than 15 kB of its own JavaScript.
- **Pages, not an endless scroll.** Home, technical service, awnings and the catalogue are separate pages linked from a menu that marks the current page in the HTML (`aria-current="page"`), checked in the browser tests.
- **A typed machine catalogue.** Machines live in a content collection validated by a Zod schema at build time. Each machine page has exactly one WhatsApp enquiry naming the model, and no page shows a price — a business decision, checked by a test that scans for `€`, `EUR` and `IVA`.
- **Conversion measured on the free plan.** WhatsApp clicks are counted as virtual `/contactar/...` pageviews in Vercel Web Analytics, which has no custom events on the free tier. The links stay plain `wa.me` anchors so the tap alone still opens the WhatsApp app on iOS.
- **Accessibility tested in three browsers.** Playwright runs axe against every page on Pixel 7 (Chromium), iPhone 15 (WebKit) and desktop Chrome, and fails on serious or critical violations.
- **Design tokens.** Shared colours and a gold "line" scale (`--line-subtle` to `--line-control`) whose strongest step keeps a measured ≥3:1 contrast for interactive borders, plus shared hero and card styles reused across pages.
- **Strict security headers.** A same-origin Content-Security-Policy plus the usual hardening headers, all set once in `vercel.json`; a browser test checks every one of them, with its exact value, on every page including the 404, and another fails if any page logs a CSP violation.
- **SEO from one source.** Canonical URLs, Open Graph tags, `LocalBusiness` and `BreadcrumbList` JSON-LD, `sitemap.xml`, noindex on the legal pages and a branded 404 all come from one site URL and one page list.

## Screenshots

<p>
  <img src=".github/assets/screenshot-catalogue.jpg" alt="Machine catalogue page on desktop, grouped by type" width="48%">
  <img src=".github/assets/screenshot-machine.jpg" alt="A machine page on desktop, with its WhatsApp enquiry and breadcrumb" width="48%">
</p>
<p>
  <img src=".github/assets/screenshot-mobile.jpg" alt="A machine page on a mobile screen" width="28%">
</p>

## Tech stack

Astro 7 · TypeScript · CSS Modules · Vitest 5 · Playwright and axe · Lighthouse CI · ESLint · Prettier · husky and lint-staged · GitHub Actions · Dependabot · Vercel

## Quality gates

Every pull request and every push to `main` runs three CI jobs:

| Job                        | What it checks                                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Lint, unit tests and build | Prettier formatting, ESLint, 161 unit/component/page tests (Vitest), and the build with type checking                               |
| Browser tests              | Playwright + axe on Pixel 7 (Chromium), iPhone 15 (WebKit) and desktop Chrome: accessibility, navigation, JavaScript budget and CSP |
| Lighthouse budgets         | Errors if accessibility is below 0.95, or performance, best practices or SEO are below 0.9, or CLS is above 0.1; warns on LCP       |

The main branch is protected: every change lands through a pull request, merged only once all three jobs are green. CodeQL scans every push for vulnerabilities (it flagged the tag-stripping helper this repo's own tests use), GitHub secret scanning watches for committed credentials, and Dependabot proposes npm updates weekly and GitHub Actions updates monthly.

## By the numbers

As of 2026-09-22, measured in CI:

- 20 pages built; 161 unit/component/page tests (Vitest) and 111 browser tests across 3 projects (106 run, 5 skipped with reasons)
- Lighthouse: performance 0.97–1.00, accessibility 1.00, SEO 1.00 on every indexable page, best practices 0.96 everywhere (Vercel Analytics' own script 404s outside Vercel and logs a console error)
- LCP 1.6–2.6 s on CI, page weight 165–390 KB including fonts and images
- About 3 kB of the site's own JavaScript per page, well under the 15 kB budget the CI enforces
- 17 URLs in the sitemap (home, technical service, awnings, catalogue and 13 machines); the legal pages and the 404 are noindex
- WhatsApp clicks tracked as `/contactar/...` virtual pageviews, verified in production

## Architecture decisions

- **Astro static instead of Next.js** — the content is fixed marketing copy plus a small catalogue, so a build-time renderer that ships zero client JS by default is enough — trade-off: no built-in server rendering if the site ever needs per-visitor personalization.
- **A content collection for the catalogue** — each machine is a typed Markdown file checked against a Zod schema at build time, so a bad entry fails the build instead of shipping — trade-off: adding a machine takes a pull request, not a CMS form.
- **No `Product` JSON-LD without a price** — Google treats a `Product` listing that omits a price as invalid, and prices are never published by business decision — trade-off: machine pages only get `BreadcrumbList` structured data, not product rich results.
- **CSP `'self'` and nothing inline** — a same-origin-only policy blocks the injected `<script>`/`<style>` tags most XSS relies on — trade-off: every asset, including Vercel Analytics, must be self-hosted, and Astro's `assetsInlineLimit` is forced to 0.
- **Clicks as virtual pageviews, not custom events or a bridge page** — the free analytics plan has no custom events, and a bridge page would delay the tap enough to break the iOS universal link to `wa.me` — trade-off: contact activity shows up as pageviews under `/contactar/...`, not as dedicated events.
- **Analytics via `inject()`** — `build.format: 'file'` makes `Astro.url.pathname` keep the built file name (`/index.html`), which is what `@vercel/analytics/astro`'s component reads; `inject()` reads `location.pathname` at runtime instead, always the clean URL — trade-off: one manual call instead of a drop-in component.
- **Legal pages are noindex** — the legal notice and privacy policy carry the owner's NIF and address, required by Spanish law but not something to expose in search results — trade-off: those two pages get no organic search traffic at all.
- **The Container API isolated in `src/test/render.ts`** — Astro's `experimental_AstroContainer` is still experimental and is the only way to render `.astro` components in Vitest; keeping every call behind one helper limits what breaks if the API changes — trade-off: one extra indirection for what is otherwise a single function.
- **Font preloads kept despite a WebKit double download** — preloading measurably improves LCP, and Android, most of the traffic, downloads each font once; WebKit's separate CORS/no-cors fetch downloads the same font twice — trade-off: iPhone visitors pay for one duplicate font fetch.

## Getting started

Requires Node.js 24 (pinned in `.nvmrc`; with nvm, run `nvm use`).

```sh
npm ci
npm run dev          # http://localhost:4321
```

## Scripts

| Command            | What it does                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm run dev`      | Development server with hot reload                                                                        |
| `npm run build`    | Type checks (`astro check`) and builds the static site in `dist/`                                         |
| `npm run preview`  | Serves `dist/` with the same security headers as production                                               |
| `npm test`         | Unit, component and page tests (Vitest)                                                                   |
| `npm run test:e2e` | Browser tests (Playwright and axe) against the build. First run: `npx playwright install chromium webkit` |
| `npm run lint`     | ESLint                                                                                                    |
| `npm run format`   | Formats the code with Prettier (`format:check` only checks)                                               |

## Project structure

```
src/
  data/             # all copy and business data (edit here)
    company.ts           #   name, phone, coverage
    contact.ts           #   phone number and WhatsApp link
    site.ts              #   WhatsApp labels, closing CTA and footer, shared by every page
    home.ts              #   text of the home page: hero, section cards, value props
    technicalService.ts  #   text of the technical service page
    awnings.ts            #   text of the awnings (toldos) page
    catalog.ts            #   catalogue labels and copy
    types.ts              #   content shapes shared across the data modules
    navigation.ts         #   menu and the closing contact block's anchor id
    legal.ts              #   legal notice, privacy policy and owner details
    seo.ts                #   site URL, structured data
    pages.ts              #   every page: title, description, indexing
  content/          # machines for sale: one folder per model (index.md + photos)
  pages/            # one file per URL, plus robots.txt and sitemap.xml
  layouts/          # <head>, the public page frame and the legal page template
  components/       # one component per section (.astro + .module.css)
  lib/              # pure, tested functions and the header menu script
  assets/           # images optimized at build time
  styles/           # design tokens and global styles
  test/             # page tests and the render helper
e2e/                # browser tests, one file per area (accessibility, architecture,
                    # catalogue, contact, navigation, SEO) plus support.ts
```

### Common changes

- **Text, phone number or brands:** edit `src/data/`.
- **A new page:** add a file to `src/pages/` and its entry to `src/data/pages.ts`. The sitemap picks it up unless the page is marked `noindex`. A public page also uses `SiteLayout`, gets a menu entry in `src/data/navigation.ts` when it belongs in the menu, and is added to `PAGES` in `e2e/support.ts`.
- **A custom domain:** set the `SITE_URL` environment variable in Vercel (or in a local `.env.local`). It defaults to `https://tecnitextil.vercel.app`.
- **A machine for sale:** add a folder `src/content/maquinas/<model-in-lowercase>/` with `index.md` and up to 4 photos; the schema in `src/content.config.ts` checks it at build time. Prices are never published.

## Deployment

Vercel builds with `npm run build` and serves `dist/` with clean URLs, security headers and asset caching (see `vercel.json`). Node.js is pinned to `24.x` through `engines`. Any unmatched path falls through to `dist/404.html`, which Vercel serves as the branded 404 with a 404 status.

Because the Content-Security-Policy only allows same-origin resources, the Vercel preview toolbar (loaded from `vercel.live`) is disabled on purpose with the `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` environment variable in the Vercel project.

## License

All rights reserved. Published as a portfolio piece with the client's consent; the code, content and brand may not be reused without permission.
