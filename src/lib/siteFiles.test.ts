import { describe, expect, it } from 'vitest'
import { COMPANY } from '../data/company'
import { buildRobotsTxt, buildSecurityTxt, buildSitemapXml } from './siteFiles'

describe('buildRobotsTxt', () => {
  it('allows crawling and points to the sitemap on the site domain', () => {
    expect(buildRobotsTxt('https://example.com')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n',
    )
  })
})

describe('buildSitemapXml', () => {
  it('lists one absolute <loc> per page', () => {
    const xml = buildSitemapXml('https://example.com', ['/', '/privacidad'])
    expect(xml).toContain('<loc>https://example.com/</loc>')
    expect(xml).toContain('<loc>https://example.com/privacidad</loc>')
    expect(xml.match(/<url>/g)).toHaveLength(2)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
  })
})

describe('buildSecurityTxt', () => {
  const now = new Date('2026-09-25T12:00:00.000Z')
  const txt = buildSecurityTxt('https://example.com', now)

  it('lists the advisory and mailto contacts', () => {
    expect(txt).toContain(
      'Contact: https://github.com/SMarinC/Tecnitextil/security/advisories/new\n',
    )
    expect(txt).toContain(`Contact: mailto:${COMPANY.email}\n`)
  })

  it('points the canonical URL at the site domain', () => {
    expect(txt).toContain('Canonical: https://example.com/.well-known/security.txt\n')
  })

  it('declares the preferred languages', () => {
    expect(txt).toContain('Preferred-Languages: es, en\n')
  })

  it('expires exactly 365 days after the given date', () => {
    expect(txt).toContain('Expires: 2027-09-25T12:00:00.000Z\n')
  })

  it('ends with a newline', () => {
    expect(txt.endsWith('\n')).toBe(true)
  })
})
