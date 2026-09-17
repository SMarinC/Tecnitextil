// Data for search engines and link previews.
import { COMPANY } from './company'

// Public site origin without a trailing slash. It comes from `site` in
// astro.config.mjs (SITE_URL environment variable), the single source for canonical
// URLs, Open Graph, structured data, robots.txt and sitemap.xml.
export const SITE_URL = import.meta.env.SITE.replace(/\/+$/, '')

export const OG_IMAGE_PATH = '/og-image.png'

export const HOME_SEO = {
  title: COMPANY.name,
  description:
    'TECNITEXTIL: reparación de máquinas de coser industriales y de toldos automatizadas, corte y confección en toda España. +20 años. Recogida a domicilio.',
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}

// schema.org LocalBusiness. No "address" on purpose: the owner prefers not to show
// the home address on Google; it is published in the legal notice.
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.name,
    description: HOME_SEO.description,
    url: absoluteUrl('/'),
    image: absoluteUrl(OG_IMAGE_PATH),
    logo: absoluteUrl('/logo.png'),
    telephone: `+${COMPANY.phone.international}`,
    areaServed: { '@type': 'Country', name: 'España' },
  }
}
