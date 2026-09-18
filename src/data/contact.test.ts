import { describe, expect, it } from 'vitest'
import { COMPANY } from './company'
import { WHATSAPP_MESSAGE, buildWhatsAppUrl } from './contact'

describe('buildWhatsAppUrl', () => {
  it('opens a chat with the business number and the default message, URL-encoded', () => {
    expect(buildWhatsAppUrl()).toBe(
      `https://wa.me/${COMPANY.phone.international}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    )
  })

  it('accepts another message and encodes it', () => {
    expect(buildWhatsAppUrl('Otro mensaje, por favor')).toBe(
      `https://wa.me/${COMPANY.phone.international}?text=Otro%20mensaje%2C%20por%20favor`,
    )
  })
})
