import { COMPANY } from './company'
import { LEGAL_NOTICE, PRIVACY_POLICY, type LegalPageContent } from './legal'
import { HOME_SEO } from './seo'

// Every page of the site: its <head> and whether search engines may index it.
export interface PageMeta {
  path: string
  title: string
  description: string
  noindex: boolean
}

export const HOME_PAGE: PageMeta = {
  path: '/',
  title: HOME_SEO.title,
  description: HOME_SEO.description,
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

export const LEGAL_NOTICE_PAGE = legalPageMeta(LEGAL_NOTICE)
export const PRIVACY_POLICY_PAGE = legalPageMeta(PRIVACY_POLICY)

export const PAGES: PageMeta[] = [
  HOME_PAGE,
  TECHNICAL_SERVICE_PAGE,
  AWNINGS_PAGE,
  LEGAL_NOTICE_PAGE,
  PRIVACY_POLICY_PAGE,
]

export function indexablePaths(): string[] {
  return PAGES.filter(({ noindex }) => !noindex).map(({ path }) => path)
}
