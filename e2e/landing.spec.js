import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Each test is named after the landing-page use case it protects (UC-xx).
const WHATSAPP_URL = /^https:\/\/wa\.me\/34685018086\?text=.+/

// "Contáctanos" is also a menu label, so scope the closing CTA to its section.
const closingCta = (page) => page.locator('#contacto').getByRole('link', { name: 'Contáctanos' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('UC-01: every WhatsApp call to action opens the business chat in a new tab', async ({
  page,
}) => {
  const links = page.locator('a[href*="wa.me"]')
  const count = await links.count()
  expect(count).toBeGreaterThanOrEqual(3)

  for (let index = 0; index < count; index += 1) {
    const link = links.nth(index)
    await expect(link).toHaveAttribute('href', WHATSAPP_URL)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }

  await expect(page.getByRole('link', { name: 'Escribir por WhatsApp' })).toBeVisible()
  await expect(closingCta(page)).toBeVisible()
})

test('UC-02: the phone number is a tappable tel: link', async ({ page }) => {
  const phone = page.getByRole('link', { name: '+34 685 01 80 86' })
  await expect(phone).toHaveAttribute('href', 'tel:+34685018086')
  await expect(phone).toBeVisible()
})

test('UC-03: choosing a menu item scrolls to its section and moves focus there', async ({
  page,
  isMobile,
}) => {
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click()
  }
  const navName = isMobile ? 'Navegación móvil' : 'Navegación principal'
  await page
    .getByRole('navigation', { name: navName })
    .getByRole('link', { name: 'Máquinas y marcas' })
    .click()

  const section = page.locator('#tipos-de-maquina')
  await expect(section).toBeFocused()
  await expect(section).toBeInViewport()

  if (isMobile) {
    await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeHidden()
  }
})

test('UC-08: menu navigation jumps without animation when reduced motion is preferred', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click()
  }
  const navName = isMobile ? 'Navegación móvil' : 'Navegación principal'
  await page
    .getByRole('navigation', { name: navName })
    .getByRole('link', { name: 'Cómo es el servicio' })
    .click()
  await expect(page.locator('#como-es-el-servicio')).toBeFocused()

  // An instant jump is already at its final position when focus moves.
  const scrollAtFocus = await page.evaluate(() => window.scrollY)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollAtFocus)
})

test('the floating WhatsApp button never covers the closing call to action', async ({ page }) => {
  const closing = closingCta(page)
  await closing.scrollIntoViewIfNeeded()

  const floating = await page.getByRole('link', { name: 'Escribir por WhatsApp' }).boundingBox()
  const cta = await closing.boundingBox()
  const overlaps =
    floating.x < cta.x + cta.width &&
    floating.x + floating.width > cta.x &&
    floating.y < cta.y + cta.height &&
    floating.y + floating.height > cta.y

  expect(overlaps).toBe(false)
})

test('UC-06: share preview metadata points to absolute URLs', async ({ page }) => {
  await expect(page).toHaveTitle(/TECNITEXTIL/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /^https:\/\/.+\/og-image\.png$/,
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https:\/\//)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/.+\/$/)
})

test('UC-05: the home page publishes LocalBusiness structured data', async ({ page }) => {
  const json = await page.locator('script[type="application/ld+json"]').textContent()
  const data = JSON.parse(json)
  expect(data['@type']).toBe('LocalBusiness')
  expect(data.telephone).toBe('+34685018086')
})

const PAGES = ['/', '/aviso-legal', '/privacidad']

test('UC-08: no page has serious or critical accessibility violations', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path)
    const { violations } = await new AxeBuilder({ page }).analyze()
    const blocking = violations
      .filter(({ impact }) => impact === 'serious' || impact === 'critical')
      .map(({ id, impact, nodes }) => `${path} ${impact}: ${id} (${nodes.length} nodes)`)

    expect(blocking).toEqual([])
  }
})

test('UC-08: pages reflow without horizontal scroll when text is enlarged to 200%', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 })
  for (const path of PAGES) {
    await page.goto(path)
    const overflow = await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
      return document.documentElement.scrollWidth - document.documentElement.clientWidth
    })
    expect(overflow, path).toBe(0)
  }
})

test('UC-07: the footer links to the legal notice and privacy policy pages', async ({ page }) => {
  for (const name of ['Aviso legal', 'Política de privacidad']) {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Información legal' })
      .getByRole('link', { name })
      .click()
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible()
    await expect(page).toHaveTitle(`${name} | TECNITEXTIL`)
  }
})

test('UC-05: every page is served as prerendered HTML, readable without JavaScript', async ({
  request,
}) => {
  const expectedText = {
    '/': 'Qué hacemos',
    '/aviso-legal': 'Datos del titular',
    '/privacidad': 'Tus derechos',
  }
  for (const path of PAGES) {
    const response = await request.get(path)
    expect(response.ok(), path).toBe(true)
    const html = await response.text()
    expect(html, path).toContain(expectedText[path])
    expect(html, path).not.toContain('<div id="root"></div>')
  }
})

test('the preloaded fonts are the ones the page uses, downloaded once', async ({ page }) => {
  const fonts = []
  page.on('response', (response) => {
    if (response.url().endsWith('.woff2')) fonts.push(new URL(response.url()).pathname)
  })
  await page.goto('/', { waitUntil: 'networkidle' })

  const preloaded = await page
    .locator('link[rel="preload"][as="font"]')
    .evaluateAll((links) => links.map((link) => new URL(link.href).pathname))
  expect(preloaded.length).toBeGreaterThan(0)
  for (const font of preloaded) {
    expect(
      fonts.filter((downloaded) => downloaded === font),
      font,
    ).toHaveLength(1)
  }
  expect(fonts.every((font) => font.includes('-latin-'))).toBe(true)
})

test('Vercel Web Analytics is still loaded, from a deferred chunk', async ({ page }) => {
  const analyticsScript = page.waitForRequest((request) =>
    request.url().includes('/_vercel/insights/script.js'),
  )
  await page.reload()
  await analyticsScript
})

test('UC-09: the awning machines section is reachable from the menu and shows its photos', async ({
  page,
  isMobile,
}) => {
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click()
  }
  const navName = isMobile ? 'Navegación móvil' : 'Navegación principal'
  await page
    .getByRole('navigation', { name: navName })
    .getByRole('link', { name: 'Toldos' })
    .click()

  const section = page.locator('#toldos')
  await expect(section).toBeFocused()
  await expect(
    section.getByRole('heading', {
      level: 2,
      name: 'Asistencia para máquinas de coser toldos automatizadas',
    }),
  ).toBeInViewport()

  const photos = section.locator('img')
  await expect(photos).toHaveCount(3)
  for (let index = 0; index < 3; index += 1) {
    const photo = photos.nth(index)
    await photo.scrollIntoViewIfNeeded()
    await expect
      .poll(() => photo.evaluate((image) => image.complete && image.naturalWidth > 0))
      .toBe(true)
  }
})

test('the header call to action fits inside the header from the desktop breakpoint', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'desktop header only')
  const DESKTOP_BREAKPOINT = 1040

  // `justify-content: space-between` keeps the CTA's right edge inside the
  // padding even when its label is squeezed or wraps onto two lines, so the
  // right-edge check alone can't catch that failure mode. Compare the CTA's
  // own size at the breakpoint against its unconstrained size at 1280px,
  // which does catch it.
  async function measureCta(width) {
    await page.setViewportSize({ width, height: 800 })
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible()
    const cta = await page.locator('header a[href*="wa.me"]').boundingBox()
    expect(cta.x + cta.width, `width ${width}`).toBeLessThanOrEqual(width - 24)
    return cta
  }

  const reference = await measureCta(1280)
  const atBreakpoint = await measureCta(DESKTOP_BREAKPOINT)
  expect(Math.round(atBreakpoint.width)).toBe(Math.round(reference.width))
  expect(Math.round(atBreakpoint.height)).toBe(Math.round(reference.height))

  await page.setViewportSize({ width: DESKTOP_BREAKPOINT - 1, height: 800 })
  await expect(page.getByRole('button', { name: 'Abrir menú de navegación' })).toBeVisible()
})

test('every page hydrates without console errors', async ({ page }) => {
  const errors = []
  // Vercel Web Analytics only exists on Vercel; its script 404s on a local preview.
  const isAnalyticsNoise = (text, url = '') => url.includes('/_vercel/') || text.includes('Vercel')
  page.on('console', (message) => {
    if (message.type() === 'error' && !isAnalyticsNoise(message.text(), message.location().url)) {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(error.message))

  for (const path of PAGES) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }

  expect(errors).toEqual([])
})
