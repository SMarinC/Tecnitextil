// Copy shared by every public page: the header/floating WhatsApp labels, the closing
// contact block, the footer and the 404 page's copy.
import { COMPANY } from './company'

export const WHATSAPP_CTA = {
  headerLabel: 'WhatsApp',
  primaryLabel: 'Escríbenos por WhatsApp',
  floatingLabel: 'Escribir por WhatsApp',
}

export const FINAL_CTA = {
  heading: 'Todo para tu maquinaria textil',
  subheading: 'Reparación, mantenimiento y venta. Escríbenos y con gusto te ayudamos.',
  ctaLabel: 'Contáctanos',
}

export const FOOTER = {
  coverage: `Servicio en ${COMPANY.coverage}`,
}

// Copy of the branded 404 page (src/pages/404.astro).
export const NOT_FOUND = {
  eyebrow: 'Error 404',
  title: 'Esta página no existe',
  intro: 'Puede que el enlace esté roto o que la página haya cambiado de sitio.',
  ctaLabel: WHATSAPP_CTA.primaryLabel,
}
