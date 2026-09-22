import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { LEGAL_NOTICE } from '../src/data/legal'
import { PAGES, TITLES } from './support'

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

  test('an unknown URL answers 404 with the branded page', async ({ page, request }) => {
    const response = await request.get('/no-existe')
    expect(response.status()).toBe(404)
    expect(await response.text()).toContain('Esta página no existe')

    await page.goto('/no-existe')
    const { violations } = await new AxeBuilder({ page }).analyze()
    const blocking = violations.filter(
      ({ impact }) => impact === 'serious' || impact === 'critical',
    )
    expect(blocking).toEqual([])
  })
})
