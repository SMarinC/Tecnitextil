import { COMPANY } from './company.js'

export const PHONE_NUMBER = COMPANY.phone.international

export const PHONE_DISPLAY = COMPANY.phone.display
export const PHONE_TEL = `tel:+${PHONE_NUMBER}`

export const WHATSAPP_MESSAGE =
  'Hola, quisiera más información sobre reparación de maquinaria textil.'

export function buildWhatsAppUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
}
