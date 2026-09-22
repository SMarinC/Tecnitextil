import { describe, expect, it } from 'vitest'
import { COMPANY } from '../data/company'
import { buildWhatsAppUrl } from '../data/contact'
import {
  LEGAL_NOTICE,
  LEGAL_OWNER,
  PENDING,
  PRIVACY_POLICY,
  SALES_CONDITIONS,
  hasPendingLegalData,
} from '../data/legal'
import { AWNING_MACHINES } from '../data/awnings'
import { HERO, SECTION_CARDS } from '../data/home'
import { NAV_ITEMS, SECTIONS } from '../data/navigation'
import {
  AWNINGS_PAGE,
  CATALOG_PAGE,
  HOME_PAGE,
  LEGAL_NOTICE_PAGE,
  NOT_FOUND_PAGE,
  PAGES,
  PRIVACY_POLICY_PAGE,
  SALES_CONDITIONS_PAGE,
  TECHNICAL_SERVICE_PAGE,
} from '../data/pages'
import { NOT_FOUND } from '../data/site'
import { TECHNICAL_SERVICE_HERO } from '../data/technicalService'
import { OG_IMAGE_PATH, SITE_URL, absoluteUrl } from '../data/seo'
import AwningsPage from '../pages/toldos.astro'
import LegalNoticePage from '../pages/aviso-legal.astro'
import HomePage from '../pages/index.astro'
import NotFoundPage from '../pages/404.astro'
import PrivacyPolicyPage from '../pages/privacidad.astro'
import SalesConditionsPage from '../pages/condiciones-de-venta.astro'
import TechnicalServicePage from '../pages/servicio-tecnico.astro'
import { GET as getSitemap } from '../pages/sitemap.xml.ts'
import { renderToHtml, textContent } from './render'

const html: Record<string, string> = {
  [HOME_PAGE.path]: await renderToHtml(HomePage),
  [TECHNICAL_SERVICE_PAGE.path]: await renderToHtml(TechnicalServicePage),
  [AWNINGS_PAGE.path]: await renderToHtml(AwningsPage),
  [SALES_CONDITIONS_PAGE.path]: await renderToHtml(SalesConditionsPage),
  [LEGAL_NOTICE_PAGE.path]: await renderToHtml(LegalNoticePage),
  [PRIVACY_POLICY_PAGE.path]: await renderToHtml(PrivacyPolicyPage),
}
const notFoundHtml = await renderToHtml(NotFoundPage)

const PUBLIC_PAGES = PAGES.filter(({ noindex }) => !noindex)
const MENU_TARGETS = [...PUBLIC_PAGES.map(({ path }) => path), CATALOG_PAGE.path]

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

// The page's <header>...</header> block, so a later link can't stand in for the logo.
function headerBlock(page: string): string {
  return page.match(/<header[\s\S]*?<\/header>/)?.[0] ?? ''
}

describe('every page', () => {
  it.each(PAGES)('$path has exactly one <h1>', ({ path }) => {
    expect(html[path].match(/<h1[\s>]/g)).toHaveLength(1)
  })

  it.each(PAGES)('$path renders the main navigation', ({ path }) => {
    expect(html[path]).toMatch(/<nav[^>]*aria-label="Navegación principal"/)
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

  // `<vercel-analytics>` is `@vercel/analytics/astro`'s own component: it reports
  // `Astro.url.pathname`, which under `build.format: 'file'` keeps the file name
  // (`/index.html`...). src/lib/analytics.ts replaces it with a script that reads
  // `location.pathname` instead, so this element should never come back.
  it.each(PAGES)('$path does not load the Astro Analytics component', ({ path }) => {
    expect(html[path]).not.toContain('<vercel-analytics')
  })
})

describe('search engines', () => {
  it('only the legal pages are kept out of search results', () => {
    const noindexPaths = PAGES.filter(({ path }) =>
      html[path].includes('name="robots" content="noindex"'),
    ).map(({ path }) => path)
    expect(noindexPaths).toEqual([SALES_CONDITIONS.path, LEGAL_NOTICE.path, PRIVACY_POLICY.path])
  })

  it('only the home page publishes structured data', () => {
    const withJsonLd = PAGES.filter(({ path }) => html[path].includes('application/ld+json')).map(
      ({ path }) => path,
    )
    expect(withJsonLd).toEqual([HOME_PAGE.path])
  })

  it('the sitemap lists the public pages and leaves the legal pages out', async () => {
    const sitemap = await (await getSitemap()).text()
    for (const { path } of [HOME_PAGE, TECHNICAL_SERVICE_PAGE, AWNINGS_PAGE]) {
      expect(sitemap).toContain(`<loc>${absoluteUrl(path)}</loc>`)
    }
    expect(sitemap).toContain(`<loc>${absoluteUrl(CATALOG_PAGE.path)}</loc>`)
    expect(sitemap).not.toContain(`${SITE_URL}${LEGAL_NOTICE.path}`)
    expect(sitemap).not.toContain(`${SITE_URL}${PRIVACY_POLICY.path}`)
  })
})

describe('site menu', () => {
  it.each(NAV_ITEMS)('"$label" leads to a public page or to the contact block', ({ href }) => {
    if (href.startsWith('#')) {
      for (const { path } of PUBLIC_PAGES) {
        expect(html[path], path).toContain(`id="${href.slice(1)}"`)
      }
    } else {
      expect(MENU_TARGETS).toContain(href)
    }
  })

  it.each(PUBLIC_PAGES)('$path marks only its own menu links as the current page', ({ path }) => {
    const current = html[path].match(/<a[^>]*aria-current="page"[^>]*>/g) ?? []
    // Desktop and mobile menus each carry the link; the home page has none.
    const expected = NAV_ITEMS.some(({ href }) => href === path) ? 2 : 0
    expect(current).toHaveLength(expected)
    for (const link of current) expect(link).toContain(`href="${path}"`)
  })

  it.each(PUBLIC_PAGES)('$path links the logo to the home page', ({ path }) => {
    expect(headerBlock(html[path])).toMatch(/<a href="\/"[^>]*>\s*<img/)
  })
})

describe('home page', () => {
  it('links to every inner page from its section cards', () => {
    for (const { href } of SECTION_CARDS.items) {
      expect(MENU_TARGETS).toContain(href)
      expect(html[HOME_PAGE.path]).toContain(`href="${href}"`)
    }
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

  it.each([LEGAL_NOTICE.path, PRIVACY_POLICY.path])(
    '%s ends with the closing contact block, so the menu\'s "Contacto" link works',
    (path) => {
      expect(html[path]).toContain(`id="${SECTIONS.contact.id}"`)
    },
  )
})

describe('inner pages', () => {
  const pageHero = (page: string) =>
    page.match(/<section[^>]*data-page-hero[\s\S]*?<\/section>/)?.[0] ?? ''

  it.each([
    [TECHNICAL_SERVICE_PAGE.path, TECHNICAL_SERVICE_HERO.title],
    [AWNINGS_PAGE.path, AWNING_MACHINES.heading],
  ])('%s opens with its <h1> and WhatsApp in the page hero', (path, title) => {
    const hero = pageHero(html[path])
    expect(textContent(hero.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '')).toBe(title)
    expect(hero).toContain(`href="${buildWhatsAppUrl()}"`)
  })
})

describe('public pages', () => {
  it.each(PUBLIC_PAGES)('$path ends its content with the contact block', ({ path }) => {
    const page = html[path]
    const main = page.slice(0, page.indexOf('</main>'))
    const sections = main.match(/<section[^>]*>/g) ?? []
    expect(sections.length, path).toBeGreaterThan(0)
    expect(sections[sections.length - 1], path).toContain(`id="${SECTIONS.contact.id}"`)
  })
})

// NOT_FOUND_PAGE stays out of PAGES (it is not a real route to render for every generic
// check above), so it gets its own render and its own assertions here.
describe('404 page', () => {
  it('has exactly one <h1>, with the not-found title', () => {
    const matches = notFoundHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/g)
    expect(matches).toHaveLength(1)
    expect(textContent(matches?.[0] ?? '')).toBe(NOT_FOUND.title)
  })

  it('is kept out of search results', () => {
    expect(NOT_FOUND_PAGE.noindex).toBe(true)
    expect(head(notFoundHtml)).toContain('name="robots" content="noindex"')
  })

  it('links to the three sections', () => {
    // Scoped to <main>, after the header: the header nav links to the same paths, so
    // checking the whole page would pass even without SectionCards.
    const main = notFoundHtml.slice(
      notFoundHtml.indexOf('</header>'),
      notFoundHtml.indexOf('</main>'),
    )
    for (const { href } of SECTION_CARDS.items) {
      expect(main).toContain(`href="${href}"`)
    }
  })

  it('ends its content with the contact block', () => {
    const main = notFoundHtml.slice(0, notFoundHtml.indexOf('</main>'))
    const sections = main.match(/<section[^>]*>/g) ?? []
    expect(sections.length).toBeGreaterThan(0)
    expect(sections[sections.length - 1]).toContain(`id="${SECTIONS.contact.id}"`)
  })
})
