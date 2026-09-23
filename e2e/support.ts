import type { Browser, Locator, Page } from '@playwright/test'
import { AWNING_MACHINES } from '../src/data/awnings'
import { CATALOG_COPY } from '../src/data/catalog'
import { HERO } from '../src/data/home'
import { MENU_TOGGLE_LABELS, NAV_ITEMS } from '../src/data/navigation'
import { FINAL_CTA } from '../src/data/site'
import { TECHNICAL_SERVICE_HERO } from '../src/data/technicalService'

// Shared constants and helpers for the browser tests, grouped by what they protect:
// contact, navigation, catalogue, SEO and sharing, accessibility and architecture.
export const WHATSAPP_URL = /^https:\/\/wa\.me\/34685018086\?text=.+/
export const PAGES = [
  '/',
  '/servicio-tecnico',
  '/toldos',
  '/maquinas',
  '/maquinas/jk-t1900gsk-dii',
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
