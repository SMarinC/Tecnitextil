import { expect, test } from '@playwright/test'
import { TITLES, openMenu } from './support'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
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
