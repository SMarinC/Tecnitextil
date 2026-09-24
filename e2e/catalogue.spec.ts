import { expect, test } from '@playwright/test'
import { CATALOG_COPY, modelCountLabel } from '../src/data/catalog'
import { CATALOG_PAGE } from '../src/data/pages'
import { WHATSAPP_CTA } from '../src/data/site'
import {
  CATALOGUE,
  MACHINE_WITHOUT_PHOTOS,
  SAMPLE_MACHINE,
  TITLES,
  box,
  navLabel,
  openMenu,
} from './support'

test.describe('catalogue', () => {
  test('the menu leads to the hub, which lists every category with its model count', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/')
    const menu = await openMenu(page, isMobile)
    await menu.getByRole('link', { name: navLabel(CATALOG_PAGE.path) }).click()

    await expect(page).toHaveURL(/\/maquinas$/)
    await expect(page.getByRole('heading', { level: 1, name: TITLES.catalogue })).toBeVisible()
    await expect(page.locator('main h3 a[href^="/maquinas/"]')).toHaveCount(CATALOGUE.length)
    for (const { family, path, models } of CATALOGUE) {
      // Unprefixed: Playwright's `:has()` filter nests the inner selector inside the
      // outer one, and "main" is an ancestor of "li" here, not a descendant of it.
      const link = page.locator(`h3 a[href="${path}"]`)
      await expect(link).toHaveText(family.label)
      await expect(page.locator('main li').filter({ has: link })).toContainText(
        modelCountLabel(models.length),
      )
    }
  })

  for (const { family, path, models } of CATALOGUE) {
    test(`${family.label}: its page groups every machine by type, in JACK's order`, async ({
      page,
    }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1, name: family.title })).toBeVisible()
      await expect(
        page.getByRole('navigation', { name: CATALOG_COPY.breadcrumbLabel }).getByRole('link'),
      ).toHaveAttribute('href', CATALOG_PAGE.path)
      await expect(page.locator(`main h3 a[href^="${path}/"]`)).toHaveCount(models.length)

      const sections = await page
        .locator('main section[id]')
        .evaluateAll((elements) => elements.map((element) => element.id))
      const typeIds = family.types.map(({ id }) => id)
      const shown = sections.filter((id) => typeIds.includes(id))
      expect(shown).toEqual(typeIds.filter((id) => shown.includes(id)))
      expect(shown.length).toBeGreaterThan(0)
      await expect(
        page.locator(shown.map((id) => `#${id} a[href*="wa.me"]`).join(', ')),
      ).toHaveCount(0)
    })
  }

  test('a machine page offers one WhatsApp enquiry naming the model, also on the floating button', async ({
    page,
  }) => {
    await page.goto('/maquinas/ojales-botones-presillas')
    await page.locator(`main a[href="${SAMPLE_MACHINE}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${SAMPLE_MACHINE}$`))

    const enquiry = page.locator('article a[href*="wa.me"]')
    await expect(enquiry).toHaveCount(1)
    const href = await enquiry.getAttribute('href')
    expect(decodeURIComponent(href ?? '')).toContain('JACK JK-T1900GSK-DII')
    await expect(page.getByRole('link', { name: WHATSAPP_CTA.floatingLabel })).toHaveAttribute(
      'href',
      href ?? '',
    )
    await expect(
      page.locator(`nav[aria-label="Navegación principal"] a[href="${CATALOG_PAGE.path}"]`),
    ).toHaveAttribute('aria-current', 'page')
  })

  test("the breadcrumb leads from a machine back to its type on its category's page", async ({
    page,
  }) => {
    await page.goto(SAMPLE_MACHINE)
    await page
      .getByRole('navigation', { name: CATALOG_COPY.breadcrumbLabel })
      .getByRole('link', { name: 'Presillas y botones' })
      .click()
    await expect(page).toHaveURL(/\/maquinas\/ojales-botones-presillas#presillas-y-botones$/)
    await expect(page.locator('#presillas-y-botones h2')).toBeInViewport()
  })

  test('the machine page shows its WhatsApp enquiry without scrolling', async ({ page }) => {
    await page.goto(SAMPLE_MACHINE)
    await expect(page.locator('article a[href*="wa.me"]')).toBeInViewport({ ratio: 1 })
  })

  test('catalogue pages never show a price', async ({ page }) => {
    const paths = [
      CATALOG_PAGE.path,
      ...CATALOGUE.map(({ path }) => path),
      SAMPLE_MACHINE,
      ...(MACHINE_WITHOUT_PHOTOS ? [MACHINE_WITHOUT_PHOTOS] : []),
    ]
    for (const path of paths) {
      await page.goto(path)
      expect(await page.locator('main').innerText(), path).not.toMatch(/€|\bEUR\b|\bIVA\b/)
    }
  })

  test('the machine gallery loads its main photo', async ({ page }) => {
    await page.goto(SAMPLE_MACHINE)
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

  test('the compact card grid gives two columns at 360px, but one at 320px', async ({
    page,
  }, testInfo) => {
    // Both breakpoints are forced viewports, and CSS grid track sizing is engine-independent
    // for this layout (checked manually in Chromium and WebKit during review), so running
    // this in every project would only repeat the same assertion.
    test.skip(testInfo.project.name !== 'mobile', 'Viewport-driven: other projects repeat it')

    await page.goto('/maquinas/remalladora-overlock')
    // Scoped to machine cards (each has an <h3> link): "main li" alone would also match
    // the breadcrumb's list items.
    const machineCards = page.locator('main li').filter({ has: page.locator('h3 a') })
    const firstCard = machineCards.nth(0)
    const secondCard = machineCards.nth(1)

    await page.setViewportSize({ width: 360, height: 800 })
    expect((await box(firstCard)).y).toBe((await box(secondCard)).y)

    await page.setViewportSize({ width: 320, height: 800 })
    expect((await box(firstCard)).y).not.toBe((await box(secondCard)).y)
  })

  test('the jump menu stays a single scrolling row on phones instead of stacking', async ({
    page,
  }, testInfo) => {
    // Forced viewport, like the reflow test above: this checks CSS flex-wrap/overflow
    // behaviour, which is engine-independent for this layout (checked manually in
    // Chromium and WebKit during review), so running it in every project would only
    // repeat the same assertion.
    test.skip(testInfo.project.name !== 'mobile', 'Viewport-driven: other projects repeat it')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/maquinas/remalladora-overlock')

    const nav = page.getByRole('navigation', { name: CATALOG_COPY.jumpNavLabel })
    const links = nav.getByRole('link')
    const firstLink = links.first()
    const lastLink = links.last()
    const firstTop = (await box(firstLink)).y

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)

    await lastLink.scrollIntoViewIfNeeded()
    await expect(lastLink).toBeInViewport()
    // A single row: scrolling the last pill into view must not have moved it to a
    // different line than the first one.
    expect(Math.abs((await box(lastLink)).y - firstTop)).toBeLessThanOrEqual(1)
  })

  test('a machine without photos says so on its page and on its card', async ({ page }) => {
    test.skip(!MACHINE_WITHOUT_PHOTOS, 'Every machine in the catalogue has photos')
    const machinePath = MACHINE_WITHOUT_PHOTOS ?? ''
    await page.goto(machinePath)
    await expect(page.locator('article').getByText(CATALOG_COPY.noPhoto)).toBeVisible()
    await expect(page.locator('article img')).toHaveCount(0)

    await page.goto(machinePath.slice(0, machinePath.lastIndexOf('/')))
    const card = page.locator('main li').filter({ has: page.locator(`a[href="${machinePath}"]`) })
    await expect(card.getByText(CATALOG_COPY.noPhoto)).toBeVisible()
  })
})
