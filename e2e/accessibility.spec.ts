import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PAGES } from './support'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('accessibility', () => {
  test('no page has serious or critical accessibility violations', async ({ page }) => {
    // axe runs over every page in this one test, close to the default 30 s on a busy runner.
    test.slow()
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

  test('a keyboard user can skip straight to the main content', async ({ page, browserName }) => {
    test.skip(
      browserName === 'webkit',
      'Safari moves focus to links with Tab only when the user enables a system setting.',
    )
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
