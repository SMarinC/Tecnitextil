import { describe, it, expect } from 'vitest'
import { HOME_SEO, SITE_URL, absoluteUrl, localBusinessJsonLd } from './seo.js'
import { COMPANY } from './company.js'

describe('seo content', () => {
  it('SITE_URL is an https origin without trailing slash', () => {
    expect(SITE_URL).toMatch(/^https:\/\/[^/]+$/)
    expect(absoluteUrl('/privacidad')).toBe(`${SITE_URL}/privacidad`)
  })

  it('home title fits in a search result (≤ 60 characters)', () => {
    expect(HOME_SEO.title.length).toBeLessThanOrEqual(60)
  })

  it('structured data describes the business with the real phone and site URL', () => {
    const data = localBusinessJsonLd()
    expect(data['@type']).toBe('LocalBusiness')
    expect(data.name).toBe(COMPANY.name)
    expect(data.telephone).toBe(`+${COMPANY.phone.international}`)
    expect(data.url).toBe(`${SITE_URL}/`)
  })

  it('home description fits in a search result and mentions the awning machines', () => {
    expect(HOME_SEO.description.length).toBeLessThanOrEqual(160)
    expect(HOME_SEO.description).toContain('toldos automatizadas')
  })

  it('structured data does not publish the owner address', () => {
    expect(localBusinessJsonLd()).not.toHaveProperty('address')
  })
})
