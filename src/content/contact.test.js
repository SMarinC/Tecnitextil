import { describe, it, expect } from 'vitest'
import { buildWhatsAppUrl, PHONE_NUMBER, WHATSAPP_MESSAGE } from './contact.js'

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me URL with the phone number and the default message, URL-encoded', () => {
    const url = buildWhatsAppUrl()
    expect(url).toBe(
      `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    )
  })

  it('uses the exact copy approved for the landing page', () => {
    expect(WHATSAPP_MESSAGE).toBe(
      'Hola, quisiera más información sobre reparación de maquinaria textil.',
    )
  })

  it('uses the correct phone number in international wa.me format', () => {
    expect(PHONE_NUMBER).toBe('34685018086')
  })

  it('allows overriding the message and still encodes it correctly', () => {
    const url = buildWhatsAppUrl('Otro mensaje')
    expect(url).toBe(`https://wa.me/${PHONE_NUMBER}?text=Otro%20mensaje`)
  })

  it('produces the exact approved wa.me URL for the default message', () => {
    const url = buildWhatsAppUrl()
    expect(url).toBe(
      'https://wa.me/34685018086?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20reparaci%C3%B3n%20de%20maquinaria%20textil.',
    )
  })
})
