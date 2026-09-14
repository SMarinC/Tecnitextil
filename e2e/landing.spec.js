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

test('the floating WhatsApp button never covers the closing call to action', async ({
  page,
}) => {
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
    /^https:\/\//,
  )
})

test('UC-08: the page has no serious or critical accessibility violations', async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).analyze()
  const blocking = violations
    .filter(({ impact }) => impact === 'serious' || impact === 'critical')
    .map(({ id, impact, nodes }) => `${impact}: ${id} (${nodes.length} nodes)`)

  expect(blocking).toEqual([])
})
