import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Browser, type Locator, type Page } from '@playwright/test'
import { LEGAL_NOTICE, LEGAL_OWNER, PRIVACY_POLICY } from '../src/data/legal'
import { DESKTOP_BREAKPOINT_PX } from '../src/lib/breakpoints'

// Grouped by what each test protects: contact, navigation, SEO and sharing, accessibility and architecture.
const WHATSAPP_URL = /^https:\/\/wa\.me\/34685018086\?text=.+/
const PAGES = [
  '/',
  '/servicio-tecnico',
  '/toldos',
  '/maquinas',
  '/maquinas/jk-t1900gsk-dii',
  '/aviso-legal',
  '/privacidad',
]
// Each page's <h1>, as literals: src/data/home.ts imports images Playwright cannot load.
const TITLES = {
  home: 'Reparación y mantenimiento de maquinaria textil',
  technicalService: 'Servicio técnico de maquinaria textil',
  awnings: 'Asistencia para máquinas de coser toldos automatizadas',
  catalogue: 'Venta de máquinas de coser industriales',
}

// Vercel Web Analytics only exists on Vercel; locally its script request fails.
const isVercelOnly = (text: string, url = '') =>
  url.includes('/_vercel/') || text.includes('Vercel')

// Scoped to the closing block: the hero also has WhatsApp links.
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

type Box = { x: number; y: number; width: number; height: number }

function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
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

test.describe('contact', () => {
  test('every WhatsApp call to action opens the business chat in a new tab', async ({ page }) => {
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

  test('the phone number is a tappable tel: link', async ({ page }) => {
    const phone = page.getByRole('link', { name: '+34 685 01 80 86' })
    await expect(phone).toHaveAttribute('href', 'tel:+34685018086')
    await expect(phone).toBeVisible()
  })

  test('the hero shows its WhatsApp call to action without scrolling', async ({ page }) => {
    await expect(page.locator('#quienes-somos a[href*="wa.me"]')).toBeInViewport({ ratio: 1 })
  })

  test('inner pages show WhatsApp in their page hero without scrolling', async ({ page }) => {
    for (const path of ['/servicio-tecnico', '/toldos']) {
      await page.goto(path)
      await expect(page.locator('[data-page-hero] a[href*="wa.me"]'), path).toBeInViewport({
        ratio: 1,
      })
    }
  })

  test('the floating WhatsApp button never covers the closing call to action', async ({ page }) => {
    const closing = closingCta(page)
    await closing.scrollIntoViewIfNeeded()

    const floating = await box(page.getByRole('link', { name: 'Escribir por WhatsApp' }))
    const cta = await box(closing)

    expect(overlaps(floating, cta)).toBe(false)
  })

  test('the floating WhatsApp button does not cover the hero call to action on a short phone', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 548 })
    for (const [path, selector] of [
      ['/', '#quienes-somos a[href*="wa.me"]'],
      ['/servicio-tecnico', '[data-page-hero] a[href*="wa.me"]'],
      ['/toldos', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas/jk-t1900gsk-dii', 'article a[href*="wa.me"]'],
      // Longest `nombre` of the 13 machines (src/content/maquinas/*/index.md),
      // so its 3+ line <h1> is the worst case for this overlap.
      ['/maquinas/jk-n9-t-d', 'article a[href*="wa.me"]'],
    ] as const) {
      await page.goto(path)
      const floating = await box(page.getByRole('link', { name: 'Escribir por WhatsApp' }))
      const hero = await box(page.locator(selector))

      expect(overlaps(floating, hero), path).toBe(false)
    }
  })

  test('every page keeps its WhatsApp enquiry clear of the floating button on the narrowest phone', async ({
    page,
  }) => {
    // 320x568: the narrowest supported phone.
    await page.setViewportSize({ width: 320, height: 568 })
    for (const [path, selector] of [
      ['/', '#quienes-somos a[href*="wa.me"]'],
      ['/servicio-tecnico', '[data-page-hero] a[href*="wa.me"]'],
      ['/toldos', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas/jk-t1900gsk-dii', 'article a[href*="wa.me"]'],
      ['/maquinas/jk-n9-t-d', 'article a[href*="wa.me"]'],
    ] as const) {
      await page.goto(path)
      const floating = await box(page.getByRole('link', { name: 'Escribir por WhatsApp' }))
      const cta = await box(page.locator(selector))

      expect(overlaps(floating, cta), path).toBe(false)
    }
  })
})

test.describe('navigation', () => {
  test('menu jumps are smooth unless reduced motion is preferred', async ({ page }) => {
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

  test('the menu leads to each section page and marks it as the current page', async ({
    page,
    isMobile,
  }) => {
    for (const [name, path, title] of [
      ['Servicio técnico', '/servicio-tecnico', TITLES.technicalService],
      ['Toldos', '/toldos', TITLES.awnings],
    ] as const) {
      const menu = await openMenu(page, isMobile)
      await menu.getByRole('link', { name }).click()

      await expect(page).toHaveURL(new RegExp(`${path}$`))
      await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
      // A CSS locator: the desktop menu is in the DOM (though hidden) on mobile too.
      await expect(
        page.locator(`nav[aria-label="Navegación principal"] a[href="${path}"]`),
      ).toHaveAttribute('aria-current', 'page')
      await expect(page.locator('[data-nav-link][aria-current]')).toHaveCount(2)
    }
  })

  test('"Contacto" jumps to the closing block, below the sticky header', async ({
    page,
    isMobile,
  }) => {
    // Reduced motion turns the jump into an instant scroll, so the final resting
    // position (not a mid-scroll frame) is what the assertions below check.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/servicio-tecnico')
    const menu = await openMenu(page, isMobile)
    await menu.getByRole('link', { name: 'Contacto' }).click()

    await expect(page).toHaveURL(/\/servicio-tecnico#contacto$/)
    const section = page.locator('#contacto')
    await expect(section).toBeInViewport()
    const headerOffset = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')),
    )
    await expect
      .poll(async () => {
        const header = await box(page.locator('[data-site-header]'))
        const top = (await box(section)).y
        return top >= header.y + header.height - 1 && top <= headerOffset + 1
      })
      .toBe(true)
    if (isMobile) {
      await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeHidden()
    }
  })

  test('the back button returns from a section page to the home page', async ({
    page,
    isMobile,
  }) => {
    const menu = await openMenu(page, isMobile)
    await menu.getByRole('link', { name: 'Toldos' }).click()
    await expect(page).toHaveURL(/\/toldos$/)

    await page.goBack()
    await expect(page.getByRole('heading', { level: 1, name: TITLES.home })).toBeVisible()
  })

  test('the logo takes the reader back to the home page', async ({ page }) => {
    await page.goto('/toldos')
    await page.locator('header a[href="/"]').click()
    await expect(page.getByRole('heading', { level: 1, name: TITLES.home })).toBeVisible()
  })

  test('the awnings page shows its three machine photos', async ({ page }) => {
    await page.goto('/toldos')
    const photos = page.locator('main img')
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
})

test.describe('catalogue', () => {
  const MACHINE = '/maquinas/jk-t1900gsk-dii'
  const TYPES = ['ojales', 'botones', 'presillas-y-botones']

  test('the menu leads to the catalogue, grouped by type, with 13 machines and no WhatsApp on the cards', async ({
    page,
    isMobile,
  }) => {
    const menu = await openMenu(page, isMobile)
    await menu.getByRole('link', { name: 'Venta de máquinas' }).click()

    await expect(page).toHaveURL(/\/maquinas$/)
    await expect(page.getByRole('heading', { level: 1, name: TITLES.catalogue })).toBeVisible()
    for (const type of TYPES) {
      await expect(page.locator(`main section#${type} h2`)).toBeVisible()
    }
    await expect(page.locator('main h3 a[href^="/maquinas/"]')).toHaveCount(13)
    await expect(
      page.locator(TYPES.map((type) => `#${type} a[href*="wa.me"]`).join(', ')),
    ).toHaveCount(0)
  })

  test('a machine page offers one WhatsApp enquiry naming the model, also on the floating button', async ({
    page,
  }) => {
    await page.goto('/maquinas')
    await page.locator(`main a[href="${MACHINE}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${MACHINE}$`))

    const enquiry = page.locator('article a[href*="wa.me"]')
    await expect(enquiry).toHaveCount(1)
    const href = await enquiry.getAttribute('href')
    expect(decodeURIComponent(href ?? '')).toContain('JACK JK-T1900GSK-DII')
    await expect(page.getByRole('link', { name: 'Escribir por WhatsApp' })).toHaveAttribute(
      'href',
      href ?? '',
    )
    await expect(
      page.locator(`nav[aria-label="Navegación principal"] a[href="/maquinas"]`),
    ).toHaveAttribute('aria-current', 'page')
  })

  test('the machine page shows its WhatsApp enquiry without scrolling', async ({ page }) => {
    await page.goto(MACHINE)
    await expect(page.locator('article a[href*="wa.me"]')).toBeInViewport({ ratio: 1 })
  })

  test('catalogue pages never show a price', async ({ page }) => {
    for (const path of ['/maquinas', MACHINE]) {
      await page.goto(path)
      expect(await page.locator('main').innerText(), path).not.toMatch(/€|\bEUR\b|\bIVA\b/)
    }
  })

  test('the machine gallery loads its main photo', async ({ page }) => {
    await page.goto(MACHINE)
    const photo = page.locator('#foto-1 img')
    await expect
      .poll(() =>
        photo.evaluate((element) => {
          const image = element as HTMLImageElement
          return image.complete && image.naturalWidth > 0
        }),
      )
      .toBe(true)
  })
})

test.describe('SEO and sharing', () => {
  test('share preview metadata points to absolute URLs', async ({ page }) => {
    await expect(page).toHaveTitle(/TECNITEXTIL/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /^https:\/\/.+\/og-image\.png$/,
    )
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /^https:\/\//)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/.+\/$/)
  })

  test('the home page publishes LocalBusiness structured data', async ({ page }) => {
    const json = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(json ?? '{}') as { '@type'?: string; telephone?: string }
    expect(data['@type']).toBe('LocalBusiness')
    expect(data.telephone).toBe('+34685018086')
  })

  test('the sitemap lists all 17 pages, including the machine catalogue', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.ok()).toBe(true)

    const xml = await response.text()
    const locCount = (xml.match(/<loc>/g) ?? []).length
    expect(locCount).toBe(17)
    expect(xml).toMatch(/<loc>https:\/\/[^<]*\/maquinas<\/loc>/)
    expect(xml).toMatch(/<loc>https:\/\/[^<]*\/maquinas\/jk-t1900gsk-dii<\/loc>/)
  })

  test('every page is served as static HTML, readable without JavaScript', async ({ request }) => {
    const expectedText: Record<string, string> = {
      '/': TITLES.home,
      '/servicio-tecnico': 'Qué hacemos',
      '/toldos': 'Qué intervenimos',
      '/maquinas': 'Presillas y botones',
      '/maquinas/jk-t1900gsk-dii': 'JK-T1900GSK-DII',
      '/aviso-legal': LEGAL_NOTICE.identification.heading,
      '/privacidad': 'Tus derechos',
    }
    for (const path of PAGES) {
      const response = await request.get(path)
      expect(response.ok(), path).toBe(true)
      expect(await response.text(), path).toContain(expectedText[path])
    }
  })

  test('the footer links to the legal notice and privacy policy pages', async ({ page }) => {
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

  test('Vercel Web Analytics is still loaded', async ({ page }) => {
    const analyticsScript = page.waitForRequest((request) =>
      request.url().includes('/_vercel/insights/script.js'),
    )
    await page.reload()
    await analyticsScript
  })
})

test.describe('accessibility', () => {
  test('no page has serious or critical accessibility violations', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path)
      const { violations } = await new AxeBuilder({ page }).analyze()
      const blocking = violations
        .filter(({ impact }) => impact === 'serious' || impact === 'critical')
        .map(({ id, impact, nodes }) => `${path} ${impact}: ${id} (${nodes.length} nodes)`)

      expect(blocking).toEqual([])
    }
  })

  test('pages reflow without horizontal scroll when text is enlarged to 200%', async ({ page }) => {
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

  test('a keyboard user can skip straight to the main content', async ({ page }) => {
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href$="#contenido"]')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#contenido$/)
    // The next Tab continues inside the main content instead of going back through the header.
    await page.keyboard.press('Tab')
    await expect(page.locator('#contenido :focus')).toHaveCount(1)
  })
})

test.describe('architecture', () => {
  test('the preloaded fonts are the ones the page uses, downloaded once', async ({ page }) => {
    const fonts: string[] = []
    page.on('response', (response) => {
      if (response.url().endsWith('.woff2')) fonts.push(new URL(response.url()).pathname)
    })
    await page.goto('/', { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)

    const preloaded = await page
      .locator('head link[rel="preload"][as="font"]')
      .evaluateAll((links) => links.map((link) => new URL((link as HTMLLinkElement).href).pathname))
    expect(preloaded.length).toBeGreaterThan(0)
    for (const font of preloaded) {
      await expect
        .poll(() => fonts.filter((downloaded) => downloaded === font).length, font)
        .toBeGreaterThan(0)
      expect(
        fonts.filter((downloaded) => downloaded === font),
        font,
      ).toHaveLength(1)
    }
    expect(fonts.every((font) => font.includes('-latin-'))).toBe(true)
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
})
