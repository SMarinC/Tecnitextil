import { COMPANY } from './company'
import { LEGAL_NOTICE, PRIVACY_POLICY, SALES_CONDITIONS, type LegalPageContent } from './legal'

// Every page of the site: its <head> and whether search engines may index it.
export interface PageMeta {
  path: string
  title: string
  description: string
  noindex: boolean
}

export const HOME_PAGE: PageMeta = {
  path: '/',
  title: `${COMPANY.name} | Reparación y venta de maquinaria textil`,
  description:
    'TECNITEXTIL: reparación de máquinas de coser industriales y de toldos automatizadas, corte y confección en toda España. +20 años. Recogida a domicilio.',
  noindex: false,
}

export const TECHNICAL_SERVICE_PAGE: PageMeta = {
  path: '/servicio-tecnico',
  title: `Servicio técnico de maquinaria textil | ${COMPANY.name}`,
  description:
    'Reparación y mantenimiento de máquinas de coser industriales y domésticas, equipos de corte y auxiliares de cualquier marca. Recogida a domicilio en toda España.',
  noindex: false,
}

export const AWNINGS_PAGE: PageMeta = {
  path: '/toldos',
  title: `Máquinas de coser toldos automatizadas | ${COMPANY.name}`,
  description:
    'Instalación, reparación y mantenimiento de máquinas de coser toldos con bandeja móvil, cabezal móvil y mesa de rodillos, en la parte mecánica y electrónica.',
  noindex: false,
}

// Built from the machine collection, which Vitest cannot load, so it stays out of PAGES
// (every PAGES entry is rendered by src/test/pages.test.ts). The sitemap adds it.
export const CATALOG_PAGE: PageMeta = {
  path: '/maquinas',
  title: `Venta de máquinas de coser industriales JACK | ${COMPANY.name}`,
  description:
    'Máquinas de coser industriales JACK de ojales, botones y presillas, con tablero y bancada. Consulta precio y disponibilidad por WhatsApp.',
  noindex: false,
}

// Reachable from the footer but kept out of search results: they carry the owner's
// NIF and address.
function legalPageMeta(content: LegalPageContent): PageMeta {
  return {
    path: content.path,
    title: `${content.title} | ${COMPANY.name}`,
    description: content.description,
    noindex: true,
  }
}

export const SALES_CONDITIONS_PAGE = legalPageMeta(SALES_CONDITIONS)
export const LEGAL_NOTICE_PAGE = legalPageMeta(LEGAL_NOTICE)
export const PRIVACY_POLICY_PAGE = legalPageMeta(PRIVACY_POLICY)

// Served by src/pages/404.astro for any unknown path. It stays out of PAGES because it
// is not a routable page: it never appears in the menu and never in the sitemap.
export const NOT_FOUND_PAGE: PageMeta = {
  path: '/404',
  title: `Página no encontrada | ${COMPANY.name}`,
  description: 'La página que buscas no existe o ha cambiado de sitio.',
  noindex: true,
}

export const PAGES: PageMeta[] = [
  HOME_PAGE,
  TECHNICAL_SERVICE_PAGE,
  AWNINGS_PAGE,
  SALES_CONDITIONS_PAGE,
  LEGAL_NOTICE_PAGE,
  PRIVACY_POLICY_PAGE,
]

export function indexablePaths(): string[] {
  return PAGES.filter(({ noindex }) => !noindex).map(({ path }) => path)
}
