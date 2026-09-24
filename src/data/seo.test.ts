import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { COMPANY } from './company'
import { HOME_PAGE } from './pages'
import { SITE_URL, THEME_COLOR, absoluteUrl, localBusinessJsonLd } from './seo'

describe('seo content', () => {
  it('SITE_URL is an https origin without trailing slash', () => {
    expect(SITE_URL).toMatch(/^https:\/\/[^/]+$/)
    expect(absoluteUrl('/privacidad')).toBe(`${SITE_URL}/privacidad`)
  })

  it('home title fits in a search result (≤ 60 characters) and is the local title', () => {
    expect(HOME_PAGE.title).toBe(`${COMPANY.name} | Reparación y venta de maquinaria textil`)
    expect(HOME_PAGE.title.length).toBeLessThanOrEqual(60)
  })

  it('structured data describes the business with the real phone and site URL', () => {
    const data = localBusinessJsonLd()
    expect(data['@type']).toBe('LocalBusiness')
    expect(data.name).toBe(COMPANY.name)
    expect(data.telephone).toBe(`+${COMPANY.phone.international}`)
    expect(data.url).toBe(`${SITE_URL}/`)
  })

  it('home description fits in a search result and mentions the awning machines', () => {
    expect(HOME_PAGE.description.length).toBeLessThanOrEqual(160)
    expect(HOME_PAGE.description).toContain('toldos automatizadas')
  })

  it('structured data publishes only the city, region and country, never the street or postal code', () => {
    const { address } = localBusinessJsonLd()
    expect(address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: COMPANY.locality,
      addressRegion: COMPANY.region,
      addressCountry: 'ES',
    })
    expect(address).not.toHaveProperty('streetAddress')
    expect(address).not.toHaveProperty('postalCode')
  })

  it('THEME_COLOR matches --color-black in tokens.css, the only other place it is written', () => {
    const tokens = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8')
    expect(tokens).toContain(`--color-black: ${THEME_COLOR};`)
  })

  it('the old Vercel address redirects to the site URL, so they can never drift apart', () => {
    type Redirect = {
      has?: { type: string; value: string }[]
      permanent: boolean
      destination: string
    }
    const vercelConfig = JSON.parse(
      readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'),
    ) as { redirects: Redirect[] }
    const redirect = vercelConfig.redirects.find((r) =>
      r.has?.some(
        (condition) => condition.type === 'host' && condition.value === 'tecnitextil.vercel.app',
      ),
    )
    expect(redirect).toBeDefined()
    expect(redirect?.permanent).toBe(true)
    expect(redirect?.destination).toBe(`${SITE_URL}/:path*`)
  })
})
