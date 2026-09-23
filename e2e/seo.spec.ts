import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { AWNING_MACHINES } from '../src/data/awnings'
import { machineTypeLabel } from '../src/data/catalog'
import { LEGAL_NOTICE, PRIVACY_POLICY } from '../src/data/legal'
import { NOT_FOUND } from '../src/data/site'
import { SERVICES } from '../src/data/technicalService'
import { PAGES, TITLES } from './support'

// The rights section, a recognizable piece of the privacy policy that only shows up
// in the rendered HTML: PRIVACY_POLICY.sections[4] is "Tus derechos".
const PRIVACY_RIGHTS_HEADING = PRIVACY_POLICY.sections[4].heading

test.beforeEach(async ({ page }) => {
  await page.goto('/')
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
      '/servicio-tecnico': SERVICES.heading,
      '/toldos': AWNING_MACHINES.components.heading,
      '/maquinas': machineTypeLabel('presillas-y-botones'),
      '/maquinas/jk-t1900gsk-dii': 'JK-T1900GSK-DII',
      '/aviso-legal': LEGAL_NOTICE.identification.heading,
      '/privacidad': PRIVACY_RIGHTS_HEADING,
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

  test('an unknown URL answers 404 with the branded page', async ({ page, request }) => {
    const response = await request.get('/no-existe')
    expect(response.status()).toBe(404)
    expect(await response.text()).toContain(NOT_FOUND.title)

    await page.goto('/no-existe')
    const { violations } = await new AxeBuilder({ page }).analyze()
    const blocking = violations.filter(
      ({ impact }) => impact === 'serious' || impact === 'critical',
    )
    expect(blocking).toEqual([])
  })
})
