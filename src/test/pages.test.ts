import { describe, expect, it } from 'vitest'
import { COMPANY } from '../data/company'
import { buildWhatsAppUrl } from '../data/contact'
import {
  LEGAL_NOTICE,
  LEGAL_OWNER,
  PENDING,
  PRIVACY_POLICY,
  hasPendingLegalData,
} from '../data/legal'
import { HERO } from '../data/home'
import { HOME_PAGE, LEGAL_NOTICE_PAGE, PAGES, PRIVACY_POLICY_PAGE } from '../data/pages'
import { NAV_ITEMS, SECTIONS } from '../data/sections'
import { OG_IMAGE_PATH, SITE_URL, absoluteUrl } from '../data/seo'
import LegalNoticePage from '../pages/aviso-legal.astro'
import HomePage from '../pages/index.astro'
import PrivacyPolicyPage from '../pages/privacidad.astro'
import { GET as getSitemap } from '../pages/sitemap.xml.ts'
import { renderToHtml, textContent } from './render'

const html: Record<string, string> = {
  [HOME_PAGE.path]: await renderToHtml(HomePage),
  [LEGAL_NOTICE_PAGE.path]: await renderToHtml(LegalNoticePage),
  [PRIVACY_POLICY_PAGE.path]: await renderToHtml(PrivacyPolicyPage),
}

function head(page: string): string {
  return page.slice(0, page.indexOf('</head>'))
}

function body(page: string): string {
  return page.slice(page.indexOf('<body'))
}

// The owner identification block of a legal page.
function identificationBlock(page: string): string {
  return page.match(/<section[^>]*aria-labelledby="titular"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? ''
}

// The home page's hero section (id="quienes-somos").
function heroSection(): string {
  return (
    html[HOME_PAGE.path].match(
      new RegExp(`<section[^>]*id="${SECTIONS.about.id}"[\\s\\S]*?</section>`),
    )?.[0] ?? ''
  )
}

describe('every page', () => {
  it.each(PAGES)('$path has exactly one <h1>', ({ path }) => {
    expect(html[path].match(/<h1[\s>]/g)).toHaveLength(1)
  })

  it.each(PAGES)(
    '$path has its own title, description and absolute share URLs',
    ({ path, title, description }) => {
      const pageHead = head(html[path])
      expect(pageHead).toContain(`<title>${title}</title>`)
      expect(pageHead).toContain(`content="${description}"`)
      expect(pageHead).toMatch(
        new RegExp(`<link[^>]*rel="canonical"[^>]*href="${absoluteUrl(path)}"`),
      )
      expect(pageHead).toContain(`content="${absoluteUrl(path)}"`)
      expect(pageHead).toContain(`content="${absoluteUrl(OG_IMAGE_PATH)}"`)
    },
  )

  it.each(PAGES)('$path links to the legal notice and the privacy policy', ({ path }) => {
    expect(html[path]).toContain(`href="${LEGAL_NOTICE.path}"`)
    expect(html[path]).toContain(`href="${PRIVACY_POLICY.path}"`)
  })

  it.each(PAGES)('$path preloads Inter 400 and Oswald 600 from its <head>', ({ path }) => {
    const preloads = head(html[path]).match(/<link[^>]*rel="preload"[^>]*>/g) ?? []
    for (const font of ['inter-latin-400-normal', 'oswald-latin-600-normal']) {
      const link = preloads.find((tag) => tag.includes(font))
      expect(link, font).toBeDefined()
      expect(link).toContain('as="font"')
      expect(link).toContain('crossorigin')
    }
  })

  it.each(PAGES)('$path starts its body with a skip link to the content', ({ path }) => {
    const firstLink = body(html[path]).match(/<a[^>]*>/)?.[0]
    expect(firstLink, path).toBeDefined()
    expect(firstLink).toContain('href="#contenido"')
    expect(html[path]).toMatch(/id="contenido"/)
  })

  it.each(PAGES)('$path declares og:locale and og:site_name', ({ path }) => {
    const pageHead = head(html[path])
    expect(pageHead).toMatch(/<meta[^>]*property="og:locale"[^>]*content="es_ES"/)
    expect(pageHead).toMatch(
      new RegExp(`<meta[^>]*property="og:site_name"[^>]*content="${COMPANY.name}"`),
    )
  })
})

describe('search engines', () => {
  it('only the legal pages are kept out of search results', () => {
    const noindexPaths = PAGES.filter(({ path }) =>
      html[path].includes('name="robots" content="noindex"'),
    ).map(({ path }) => path)
    expect(noindexPaths).toEqual([LEGAL_NOTICE.path, PRIVACY_POLICY.path])
  })

  it('only the home page publishes structured data', () => {
    const withJsonLd = PAGES.filter(({ path }) => html[path].includes('application/ld+json')).map(
      ({ path }) => path,
    )
    expect(withJsonLd).toEqual([HOME_PAGE.path])
  })

  it('the sitemap lists the home page and leaves the legal pages out', async () => {
    const sitemap = await getSitemap().text()
    expect(sitemap).toContain(`<loc>${SITE_URL}/</loc>`)
    expect(sitemap).not.toContain(`${SITE_URL}${LEGAL_NOTICE.path}`)
    expect(sitemap).not.toContain(`${SITE_URL}${PRIVACY_POLICY.path}`)
  })
})

describe('home page', () => {
  it.each(NAV_ITEMS)('menu item "$label" points to a section of the page', ({ href }) => {
    expect(html[HOME_PAGE.path]).toContain(`id="${href.slice(1)}"`)
  })

  it('names the business in its only <h1>', () => {
    const hero = heroSection()
    const h1Text = textContent(hero.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '')
    expect(h1Text).toBe(HERO.title)
    expect(HERO.title).not.toBe(HERO.aboutHeading)
    const h2Text = textContent(hero.match(/<h2[^>]*>[\s\S]*?<\/h2>/)?.[0] ?? '')
    expect(h2Text).toBe(HERO.aboutHeading)
  })

  it('offers WhatsApp in the hero section', () => {
    expect(heroSection()).toContain(`href="${buildWhatsAppUrl()}"`)
  })
})

describe('legal pages', () => {
  it.each([LEGAL_NOTICE.path, PRIVACY_POLICY.path])(
    '%s warns visibly while owner data is pending, never inventing it',
    (path) => {
      expect(html[path].includes(PENDING)).toBe(hasPendingLegalData)
    },
  )

  it('the legal notice identifies the owner as LSSI-CE art. 10 requires', () => {
    const block = identificationBlock(html[LEGAL_NOTICE.path])
    expect(block).toContain(LEGAL_OWNER.legalName)
    expect(block).toContain(LEGAL_OWNER.taxId)
    expect(block).toContain(LEGAL_OWNER.address)
    expect(block).toContain(LEGAL_OWNER.email)
    expect(block).not.toContain('Datos registrales')
  })

  it('the privacy policy only identifies the controller and links to the legal notice', () => {
    const page = html[PRIVACY_POLICY.path]
    expect(page).not.toContain(LEGAL_OWNER.taxId)
    expect(page).not.toContain(LEGAL_OWNER.address)
    const block = identificationBlock(page)
    expect(block).toContain(LEGAL_OWNER.legalName)
    expect(block).toContain(LEGAL_OWNER.email)
    expect(block).toContain(`href="${LEGAL_NOTICE.path}"`)
  })

  it.each([LEGAL_NOTICE.path, PRIVACY_POLICY.path])(
    '%s links the owner email with mailto:',
    (path) => {
      expect(identificationBlock(html[path])).toContain(`href="mailto:${LEGAL_OWNER.email}"`)
    },
  )
})
