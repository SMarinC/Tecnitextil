import { SITE_URL } from '../../data/seo'
import { buildSecurityTxt } from '../../lib/siteFiles'

export function GET(): Response {
  return new Response(buildSecurityTxt(SITE_URL, new Date()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
