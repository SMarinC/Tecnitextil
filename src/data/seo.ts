// Data for search engines and link previews.
import { COMPANY } from './company'
import { HOME_PAGE } from './pages'

// Public site origin without a trailing slash. It comes from `site` in
// astro.config.mjs, whose default the SITE_URL environment variable can override.
// The single source for canonical URLs, Open Graph, structured data, robots.txt and
// sitemap.xml.
export const SITE_URL = import.meta.env.SITE.replace(/\/+$/, '')

export const OG_IMAGE_PATH = '/og-image.png'

// Must match --color-black in src/styles/tokens.css: <meta name="theme-color"> cannot
// read CSS custom properties, so this is the one other place that colour is written.
export const THEME_COLOR = '#0a0a0a'

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`
}

// schema.org LocalBusiness. Only the city is public, never the street or postal code:
// the owner prefers not to show the home address on Google, and the full address is
// published in the legal notice.
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.name,
    description: HOME_PAGE.description,
    url: absoluteUrl('/'),
    image: absoluteUrl(OG_IMAGE_PATH),
    logo: absoluteUrl('/logo.png'),
    telephone: `+${COMPANY.phone.international}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: COMPANY.locality,
      addressRegion: COMPANY.region,
      addressCountry: 'ES',
    },
    areaServed: { '@type': 'Country', name: 'España' },
  }
}
