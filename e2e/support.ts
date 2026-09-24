import { readFileSync, readdirSync } from 'node:fs'
import type { Browser, Locator, Page } from '@playwright/test'
import { AWNING_MACHINES } from '../src/data/awnings'
import { CATALOG_COPY, MACHINE_FAMILIES } from '../src/data/catalog'
import { HERO } from '../src/data/home'
import { MENU_TOGGLE_LABELS, NAV_ITEMS } from '../src/data/navigation'
import { FINAL_CTA } from '../src/data/site'
import { TECHNICAL_SERVICE_HERO } from '../src/data/technicalService'

// Shared constants and helpers for the browser tests, grouped by what they protect:
// contact, navigation, catalogue, SEO and sharing, accessibility and architecture.
export const WHATSAPP_URL = /^https:\/\/wa\.me\/34685018086\?text=.+/

// The catalogue as it is on disk, since Playwright cannot load Astro's content
// collection: each category's machine folders, which are also their URLs.
const MACHINES_DIR = 'src/content/maquinas'
export const CATALOGUE = MACHINE_FAMILIES.map((family) => ({
  family,
  path: `/maquinas/${family.id}`,
  // Sorted so local (NTFS) and CI (ext4) file systems pick the same machine on a tie.
  models: readdirSync(`${MACHINES_DIR}/${family.id}`, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(),
}))
export const MACHINE_PATHS = CATALOGUE.flatMap(({ path, models }) =>
  models.map((model) => `${path}/${model}`),
)
const frontMatter = (machinePath: string) =>
  readFileSync(`src/content${machinePath}/index.md`, 'utf8')
// Prettier folds long YAML values onto indented continuation lines, so a field is read
// by unfolding them first, then collapsing whitespace and stripping surrounding quotes.
const unfoldedField = (text: string, field: string) =>
  text
    .match(new RegExp(`^${field}:(.*(?:\\r?\\n[ \\t]+.*)*)`, 'm'))?.[1]
    .replace(/\r?\n[ \t]+/g, ' ')
    .trim()
    .replace(/^['"]|['"]$/g, '')
const nameOf = (machinePath: string) => unfoldedField(frontMatter(machinePath), 'nombre') ?? ''

// A machine page with photos, used wherever any machine will do.
export const SAMPLE_MACHINE = '/maquinas/ojales-botones-presillas/jk-t1900gsk-dii'
// The longest-name machine of each category: its <h1> is the worst case for the call to
// action staying in view. Bounded by MACHINE_FAMILIES, not by catalogue size.
export const LONGEST_NAME_MACHINES = CATALOGUE.map(({ path, models }) =>
  models
    .map((model) => `${path}/${model}`)
    .reduce((longest, candidate) =>
      nameOf(candidate).length > nameOf(longest).length ? candidate : longest,
    ),
)
// A machine whose supplier published no photo, if any: its pages show a placeholder.
export const MACHINE_WITHOUT_PHOTOS = MACHINE_PATHS.find(
  (path) => unfoldedField(frontMatter(path), 'fotos') === '[]',
)
// The category with the most machines: the longest listing page.
export const LARGEST_CATEGORY = CATALOGUE.reduce((largest, category) =>
  category.models.length > largest.models.length ? category : largest,
).path

export const PAGES = [
  '/',
  '/servicio-tecnico',
  '/toldos',
  '/maquinas',
  LARGEST_CATEGORY,
  SAMPLE_MACHINE,
  ...(MACHINE_WITHOUT_PHOTOS ? [MACHINE_WITHOUT_PHOTOS] : []),
  '/condiciones-de-venta',
  '/aviso-legal',
  '/privacidad',
]
// PAGES plus the 404 page, for checks that must also hold on an unknown route.
export const ROUTES_WITH_ERRORS = [...PAGES, '/no-existe']
// Each page's <h1>, read from the content modules themselves: none of them imports
// images or reads import.meta.env, so Playwright can load every one of them.
export const TITLES = {
  home: HERO.title,
  technicalService: TECHNICAL_SERVICE_HERO.title,
  awnings: AWNING_MACHINES.heading,
  catalogue: CATALOG_COPY.hero.title,
}

// Vercel Web Analytics only exists on Vercel; locally its script request fails.
export const isVercelOnly = (text: string, url = '') =>
  url.includes('/_vercel/') || text.includes('Vercel')

// A menu item's accessible name, looked up by the page (or anchor) it links to.
export function navLabel(href: string): string {
  const item = NAV_ITEMS.find((navItem) => navItem.href === href)
  if (!item) throw new Error(`No nav item links to ${href}`)
  return item.label
}

// Scoped to the closing block: the hero also has WhatsApp links.
export const closingCta = (page: Page) =>
  page.locator('#contacto').getByRole('link', { name: FINAL_CTA.ctaLabel })

// On mobile the menu links live in a panel that opens from the header button.
export async function openMenu(page: Page, isMobile: boolean): Promise<Locator> {
  if (isMobile) {
    await page.getByRole('button', { name: MENU_TOGGLE_LABELS.open }).click()
  }
  return page.getByRole('navigation', {
    name: isMobile ? 'Navegación móvil' : 'Navegación principal',
  })
}

export async function box(locator: Locator) {
  const bounds = await locator.boundingBox()
  if (!bounds) throw new Error('Element is not visible')
  return bounds
}

export type Box = { x: number; y: number; width: number; height: number }

export function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

// Scripts a first visit downloads with an empty cache, excluding Vercel-only ones.
export async function downloadScripts(
  browser: Browser,
  baseURL: string | undefined,
  path: string,
): Promise<Buffer[]> {
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()
  const bodies: Promise<Buffer>[] = []
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script' && !isVercelOnly('', response.url())) {
      bodies.push(response.body())
    }
  })
  await page.goto(path, { waitUntil: 'load' })
  const scripts = await Promise.all(bodies)
  await context.close()
  return scripts
}
