// robots.txt, sitemap.xml and security.txt built from the site URL and the page list,
// so neither the domain nor the pages are maintained by hand.
import { COMPANY } from '../data/company'

export function buildRobotsTxt(siteUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
}

export function buildSitemapXml(siteUrl: string, paths: readonly string[]): string {
  const urls = paths.map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

// RFC 9116 security.txt. `Expires` is set to one year from the build date, not a fixed
// date, so every deploy (Dependabot keeps them frequent) renews it automatically instead
// of it going stale and being ignored by clients that check the field.
export function buildSecurityTxt(siteUrl: string, now: Date): string {
  const oneYearMs = 365 * 24 * 60 * 60 * 1000
  const expires = new Date(now.getTime() + oneYearMs)
  return (
    `Contact: https://github.com/SMarinC/Tecnitextil/security/advisories/new\n` +
    `Contact: mailto:${COMPANY.email}\n` +
    `Expires: ${expires.toISOString()}\n` +
    `Preferred-Languages: es, en\n` +
    `Canonical: ${siteUrl}/.well-known/security.txt\n`
  )
}
