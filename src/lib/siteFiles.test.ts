import { describe, expect, it } from 'vitest'
import { buildRobotsTxt, buildSitemapXml } from './siteFiles'

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
