import { expect, test } from '@playwright/test'
import { WHATSAPP_CTA } from '../src/data/site'
import { WHATSAPP_URL, box, closingCta, overlaps } from './support'

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

    await expect(page.getByRole('link', { name: WHATSAPP_CTA.floatingLabel })).toBeVisible()
    await expect(closingCta(page)).toBeVisible()
  })

  test('the phone number is a tappable tel: link', async ({ page }) => {
    const phone = page.getByRole('link', { name: '+34 685 01 80 86' })
    await expect(phone).toHaveAttribute('href', 'tel:+34685018086')
    await expect(phone).toBeVisible()
  })

  test('the hero shows its WhatsApp call to action without scrolling', async ({ page }) => {
    await expect(page.locator('[data-hero] a[href*="wa.me"]')).toBeInViewport({ ratio: 1 })
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

    const floating = await box(page.getByRole('link', { name: WHATSAPP_CTA.floatingLabel }))
    const cta = await box(closing)

    expect(overlaps(floating, cta)).toBe(false)
  })

  test('the floating WhatsApp button does not cover the hero call to action on a short phone', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 548 })
    for (const [path, selector] of [
      ['/', '[data-hero] a[href*="wa.me"]'],
      ['/servicio-tecnico', '[data-page-hero] a[href*="wa.me"]'],
      ['/toldos', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas/jk-t1900gsk-dii', 'article a[href*="wa.me"]'],
      // Longest `nombre` of the 13 machines (src/content/maquinas/*/index.md),
      // so its 3+ line <h1> is the worst case for this overlap.
      ['/maquinas/jk-n9-t-d', 'article a[href*="wa.me"]'],
    ] as const) {
      await page.goto(path)
      const floating = await box(page.getByRole('link', { name: WHATSAPP_CTA.floatingLabel }))
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
      ['/', '[data-hero] a[href*="wa.me"]'],
      ['/servicio-tecnico', '[data-page-hero] a[href*="wa.me"]'],
      ['/toldos', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas', '[data-page-hero] a[href*="wa.me"]'],
      ['/maquinas/jk-t1900gsk-dii', 'article a[href*="wa.me"]'],
      ['/maquinas/jk-n9-t-d', 'article a[href*="wa.me"]'],
    ] as const) {
      await page.goto(path)
      const floating = await box(page.getByRole('link', { name: WHATSAPP_CTA.floatingLabel }))
      const cta = await box(page.locator(selector))

      expect(overlaps(floating, cta), path).toBe(false)
    }
  })

  test('a WhatsApp click is counted as a visit to /contactar/<page>', async ({ page }) => {
    // The real chat never has to open for this: wa.me is blocked so the click stays
    // fast and offline-safe, and the new tab it still opens (target="_blank") is
    // closed right away.
    await page
      .context()
      .route('https://wa.me/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: '<title>WhatsApp</title>' }),
      )

    for (const [path, selector, expected] of [
      ['/', '[data-hero] a[data-whatsapp]', '/contactar/portada'],
      [
        '/maquinas/jk-t1900gsk-dii',
        'article a[data-whatsapp]',
        '/contactar/maquinas/jk-t1900gsk-dii',
      ],
    ] as const) {
      await page.goto(path)
      const [popup] = await Promise.all([
        page.context().waitForEvent('page'),
        page.locator(selector).click(),
      ])
      await popup.close()

      // Locally the Vercel Web Analytics script 404s, so `window.va` never gets
      // replaced by the real one and just keeps queuing every call onto `window.vaq`.
      await expect
        .poll(() => page.evaluate(() => (window as unknown as { vaq?: unknown[][] }).vaq ?? []))
        .toContainEqual(['pageview', { route: expected, path: expected }])
    }
  })
})
