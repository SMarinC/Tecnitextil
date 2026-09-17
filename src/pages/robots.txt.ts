import { SITE_URL } from '../data/seo'
import { buildRobotsTxt } from '../lib/siteFiles'

export function GET(): Response {
  return new Response(buildRobotsTxt(SITE_URL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
