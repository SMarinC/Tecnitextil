import { indexablePaths } from '../data/pages'
import { SITE_URL } from '../data/seo'
import { buildSitemapXml } from '../lib/siteFiles'

export function GET(): Response {
  return new Response(buildSitemapXml(SITE_URL, indexablePaths()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
