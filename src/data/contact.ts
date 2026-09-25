import { COMPANY } from './company'

const PHONE_NUMBER = COMPANY.phone.international
export const PHONE_DISPLAY = COMPANY.phone.display
export const PHONE_TEL = `tel:+${PHONE_NUMBER}`

export const WHATSAPP_MESSAGE =
  'Hola, quisiera más información sobre reparación de maquinaria textil.'

export function buildWhatsAppUrl(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
}

export const EMAIL_SUBJECT = `Consulta desde la web de ${COMPANY.name}`

export function buildMailtoUrl(subject: string = EMAIL_SUBJECT): string {
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`
}
