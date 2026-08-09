export const PHONE_NUMBER = '34685018086'

export const WHATSAPP_MESSAGE =
  'Hola, quisiera más información sobre reparación de máquinas de coser.'

export function buildWhatsAppUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
}
