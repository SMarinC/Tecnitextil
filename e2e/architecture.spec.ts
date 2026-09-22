import { expect, test } from '@playwright/test'
import { LEGAL_NOTICE, LEGAL_OWNER, PRIVACY_POLICY } from '../src/data/legal'
import { PAGES, downloadScripts, isVercelOnly } from './support'

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
