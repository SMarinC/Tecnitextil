import { expect, test } from '@playwright/test'
import { DESKTOP_BREAKPOINT_PX } from '../src/lib/breakpoints'
import { CONTACT_SECTION_ID, MENU_TOGGLE_LABELS } from '../src/data/navigation'
import { AWNINGS_PAGE, TECHNICAL_SERVICE_PAGE } from '../src/data/pages'
import { TITLES, box, navLabel, openMenu } from './support'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
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
    const openButton = page.getByRole('button', { name: MENU_TOGGLE_LABELS.open })

    await openButton.click()
    const closeButton = page.getByRole('button', { name: MENU_TOGGLE_LABELS.close })
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
    await expect(page.getByRole('button', { name: MENU_TOGGLE_LABELS.open })).toBeVisible()
  })

  test('the menu leads to each section page and marks it as the current page', async ({
    page,
    isMobile,
  }) => {
    for (const [name, path, title] of [
      [navLabel(TECHNICAL_SERVICE_PAGE.path), TECHNICAL_SERVICE_PAGE.path, TITLES.technicalService],
      [navLabel(AWNINGS_PAGE.path), AWNINGS_PAGE.path, TITLES.awnings],
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
    await menu.getByRole('link', { name: navLabel(`#${CONTACT_SECTION_ID}`) }).click()

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
    await menu.getByRole('link', { name: navLabel(AWNINGS_PAGE.path) }).click()
    await expect(page).toHaveURL(/\/toldos$/)

    await page.goBack()
    await expect(page.getByRole('heading', { level: 1, name: TITLES.home })).toBeVisible()
  })

  test('the logo takes the reader back to the home page', async ({ page }) => {
    await page.goto('/toldos')
    await page.locator('header a[href="/"]').click()
    await expect(page.getByRole('heading', { level: 1, name: TITLES.home })).toBeVisible()
  })

  test('the legal pages carry the main menu', async ({ page, isMobile }) => {
    // Reduced motion turns the jump into an instant scroll, so the viewport check
    // below sees the final resting position rather than a mid-scroll frame.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const path of ['/aviso-legal', '/privacidad']) {
      await page.goto(path)
      const menu = await openMenu(page, isMobile)
      await expect(menu).toBeVisible()
      await expect(menu.getByRole('link', { name: navLabel(AWNINGS_PAGE.path) })).toHaveAttribute(
        'href',
        AWNINGS_PAGE.path,
      )

      if (path === '/aviso-legal') {
        await menu.getByRole('link', { name: navLabel(`#${CONTACT_SECTION_ID}`) }).click()
        await expect(page.locator('#contacto')).toBeInViewport()
      }
    }
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
