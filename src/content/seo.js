// Datos para buscadores y vistas previas al compartir enlaces.
import { COMPANY } from './company.js'

// Dominio público del sitio, sin barra final. Se define una sola vez con la
// variable VITE_SITE_URL (ver .env.example) y de aquí salen canonical,
// Open Graph, datos estructurados, robots.txt y sitemap.xml.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://tecnitextil.vercel.app').replace(
  /\/+$/,
  '',
)

export const OG_IMAGE_PATH = '/og-image.png'

export const HOME_SEO = {
  title: `Reparación de máquinas de coser industriales | ${COMPANY.name}`,
  description:
    'TECNITEXTIL: reparación de máquinas de coser industriales y de toldos automatizadas, corte y confección en toda España. +20 años. Recogida a domicilio.',
}

export function absoluteUrl(path) {
  return `${SITE_URL}${path}`
}

// schema.org LocalBusiness. Añadir "address" cuando el negocio confirme su
// domicilio (ver LEGAL_OWNER en legal.js): mejora la elegibilidad en Google.
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
