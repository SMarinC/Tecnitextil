import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Browser, type Locator, type Page } from '@playwright/test'
import { LEGAL_NOTICE, LEGAL_OWNER, PRIVACY_POLICY } from '../src/data/legal'
import { DESKTOP_BREAKPOINT_PX } from '../src/lib/breakpoints'

// Each test is named after the landing-page use case it protects (UC-xx).
const WHATSAPP_URL = /^https:\/\/wa\.me\/34685018086\?text=.+/
const PAGES = ['/', '/aviso-legal', '/privacidad']

// Vercel Web Analytics only exists on Vercel; locally its script request fails.
const isVercelOnly = (text: string, url = '') =>
  url.includes('/_vercel/') || text.includes('Vercel')

// "Contáctanos" is also a menu label, so scope the closing CTA to its section.
const closingCta = (page: Page) =>
  page.locator('#contacto').getByRole('link', { name: 'Contáctanos' })

// On mobile the menu links live in a panel that opens from the header button.
async function openMenu(page: Page, isMobile: boolean): Promise<Locator> {
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click()
  }
  return page.getByRole('navigation', {
    name: isMobile ? 'Navegación móvil' : 'Navegación principal',
  })
}

async function box(locator: Locator) {
  const bounds = await locator.boundingBox()
  if (!bounds) throw new Error('Element is not visible')
  return bounds
}

// Scripts a first visit downloads with an empty cache, excluding Vercel-only ones.
async function downloadScripts(
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

test('UC-03: choosing a menu item jumps to its section with a shareable link', async ({
  page,
  isMobile,
}) => {
  const menu = await openMenu(page, isMobile)
  const link = menu.getByRole('link', { name: 'Máquinas y marcas' })
  await link.click()

  await expect(page).toHaveURL(/#tipos-de-maquina$/)
  const section = page.locator('#tipos-de-maquina')
  // The jump ends with the section right below the sticky header (scroll-margin-top).
  const headerOffset = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')),
  )
  await expect
    .poll(async () => {
      const top = (await box(section)).y
      const header = await box(page.locator('[data-site-header]'))
      return top >= header.y + header.height - 1 && top <= headerOffset + 1
    })
    .toBe(true)
  // A CSS locator, not a role query: on mobile the panel has already closed (removing
  // it from the accessibility tree), but markActiveLink sets aria-current on every
  // matching [data-nav-link], including the always-present desktop copy.
  const activeLink = page.locator(
    'nav[aria-label="Navegación principal"] a[href="#tipos-de-maquina"]',
  )
  await expect(activeLink).toHaveAttribute('aria-current', 'true')

  await page.keyboard.press('Tab')
  const focusFollowsSection = await page.evaluate(() => {
    const target = document.querySelector('#tipos-de-maquina')
    const active = document.activeElement
    if (!target || !active || active === document.body) return false
    return (
      target.contains(active) ||
      Boolean(target.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING)
    )
  })
  expect(focusFollowsSection).toBe(true)

  if (isMobile) {
    await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeHidden()
  }
})

test('the back button returns from a menu jump to where the reader was', async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const menu = await openMenu(page, isMobile)
  await menu.getByRole('link', { name: 'Cómo es el servicio' }).click()
  await expect(page).toHaveURL(/#como-es-el-servicio$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

  await page.goBack()
  await expect.poll(() => new URL(page.url()).hash).toBe('')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})

test('UC-08: menu jumps are smooth unless reduced motion is preferred', async ({ page }) => {
  const scrollBehavior = () =>
    page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  expect(await scrollBehavior()).toBe('smooth')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await scrollBehavior()).toBe('auto')
})

test('the mobile menu opens, closes and closes itself at the desktop breakpoint', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'mobile menu only')
  const panel = page.getByRole('navigation', { name: 'Navegación móvil' })
  const openButton = page.getByRole('button', { name: 'Abrir menú de navegación' })

  await openButton.click()
  const closeButton = page.getByRole('button', { name: 'Cerrar menú de navegación' })
  await expect(closeButton).toHaveAttribute('aria-expanded', 'true')
  await expect(panel).toBeVisible()

  await closeButton.click()
  await expect(panel).toBeHidden()
  await expect(openButton).toHaveAttribute('aria-expanded', 'false')

  await openButton.click()
  await page.setViewportSize({ width: DESKTOP_BREAKPOINT_PX, height: 800 })
  // At the desktop breakpoint the CSS hides .mobileNav *and* the toggle button itself,
  // so a role query for either finds nothing regardless of the script's state — read
  // the toggle by its data attribute instead, which stays queryable while hidden. Its
  // aria-expanded is the only evidence the matchMedia listener actually closed the
  // panel; awaiting it also stops the two resizes from firing back to back, which some
  // runners coalesce into one matchMedia change (or none), racing `setMenuOpen(false)`.
  await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded', 'false')

  await page.setViewportSize({ width: DESKTOP_BREAKPOINT_PX - 1, height: 800 })
  await expect(panel).toBeHidden()
  await expect(openButton).toHaveAttribute('aria-expanded', 'false')
})

test('the floating WhatsApp button never covers the closing call to action', async ({ page }) => {
  const closing = closingCta(page)
  await closing.scrollIntoViewIfNeeded()

  const floating = await box(page.getByRole('link', { name: 'Escribir por WhatsApp' }))
  const cta = await box(closing)
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
  const data = JSON.parse(json ?? '{}')
  expect(data['@type']).toBe('LocalBusiness')
  expect(data.telephone).toBe('+34685018086')
})

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

test('UC-05: every page is served as static HTML, readable without JavaScript', async ({
  request,
}) => {
  const expectedText: Record<string, string> = {
    '/': 'Qué hacemos',
    '/aviso-legal': LEGAL_NOTICE.identification.heading,
    '/privacidad': 'Tus derechos',
  }
  for (const path of PAGES) {
    const response = await request.get(path)
    expect(response.ok(), path).toBe(true)
    expect(await response.text(), path).toContain(expectedText[path])
  }
})

test('the preloaded fonts are the ones the page uses, downloaded once', async ({ page }) => {
  const fonts: string[] = []
  page.on('response', (response) => {
    if (response.url().endsWith('.woff2')) fonts.push(new URL(response.url()).pathname)
  })
  await page.goto('/', { waitUntil: 'networkidle' })

  const preloaded = await page
    .locator('head link[rel="preload"][as="font"]')
    .evaluateAll((links) => links.map((link) => new URL((link as HTMLLinkElement).href).pathname))
  expect(preloaded.length).toBeGreaterThan(0)
  for (const font of preloaded) {
    expect(
      fonts.filter((downloaded) => downloaded === font),
      font,
    ).toHaveLength(1)
  }
  expect(fonts.every((font) => font.includes('-latin-'))).toBe(true)
})

test('Vercel Web Analytics is still loaded', async ({ page }) => {
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
  const menu = await openMenu(page, isMobile)
  await menu.getByRole('link', { name: 'Toldos' }).click()

  await expect(page).toHaveURL(/#toldos$/)
  const section = page.locator('#toldos')
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
      .poll(() =>
        photo.evaluate((element) => {
          const image = element as HTMLImageElement
          return image.complete && image.naturalWidth > 0
        }),
      )
      .toBe(true)
  }
})

test('the header call to action fits inside the header from the desktop breakpoint', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'desktop header only')

  // `justify-content: space-between` keeps the CTA's right edge inside the padding even
  // when its label is squeezed or wraps, so the right-edge check alone can't catch that.
  // Compare the CTA's size at the breakpoint with its unconstrained size at 1280px.
  async function measureCta(width: number) {
    await page.setViewportSize({ width, height: 800 })
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible()
    const cta = await box(page.locator('header a[href*="wa.me"]'))
    expect(cta.x + cta.width, `width ${width}`).toBeLessThanOrEqual(width - 24)
    return cta
  }

  const reference = await measureCta(1280)
  const atBreakpoint = await measureCta(DESKTOP_BREAKPOINT_PX)
  expect(Math.round(atBreakpoint.width)).toBe(Math.round(reference.width))
  expect(Math.round(atBreakpoint.height)).toBe(Math.round(reference.height))

  await page.setViewportSize({ width: DESKTOP_BREAKPOINT_PX - 1, height: 800 })
  await expect(page.getByRole('button', { name: 'Abrir menú de navegación' })).toBeVisible()
})

test('no page logs console errors or Content-Security-Policy violations', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' && !isVercelOnly(message.text(), message.location().url)) {
      errors.push(message.text())
    }
  })
  page.on('pageerror', (error) => errors.push(error.message))

  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'load' })
  }

  await expect.poll(() => errors).toEqual([])
})

test('every page downloads at most 15 000 bytes of its own JavaScript', async ({
  browser,
  baseURL,
}) => {
  for (const path of PAGES) {
    const scripts = await downloadScripts(browser, baseURL, path)
    expect(scripts.length, path).toBeGreaterThan(0)
    const bytes = scripts.reduce((total, script) => total + script.length, 0)
    expect(bytes, path).toBeLessThanOrEqual(15_000)
  }
})

test('no script repeats the owner details or the legal texts', async ({ browser, baseURL }) => {
  // Short headings ("Objeto", "Cookies") could appear in library code by chance.
  const legalHeadings = [LEGAL_NOTICE, PRIVACY_POLICY]
    .flatMap(({ identification, sections }) => [
      identification.heading,
      ...sections.map(({ heading }) => heading),
    ])
    .filter((heading) => heading.length > 10)

  for (const path of PAGES) {
    for (const script of await downloadScripts(browser, baseURL, path)) {
      const code = script.toString('utf8')
      expect(code, path).not.toContain(LEGAL_OWNER.taxId)
      expect(code, path).not.toContain(LEGAL_OWNER.legalName)
      for (const heading of legalHeadings) {
        expect(code, `${path}: ${heading}`).not.toContain(heading)
      }
    }
  }
})

test('pages carry no inline styles or executable inline scripts', async ({ request }) => {
  for (const path of PAGES) {
    const html = await (await request.get(path)).text()
    expect(html, path).not.toMatch(/<style[\s>]/)
    const inlineScripts = (html.match(/<script\b[^>]*>/g) ?? []).filter(
      (tag) => !tag.includes(' src=') && !tag.includes('application/ld+json'),
    )
    expect(inlineScripts, path).toEqual([])
  }
})
