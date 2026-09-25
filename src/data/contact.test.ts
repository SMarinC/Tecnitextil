import { describe, expect, it } from 'vitest'
import { COMPANY } from './company'
import { EMAIL_SUBJECT, WHATSAPP_MESSAGE, buildMailtoUrl, buildWhatsAppUrl } from './contact'
import { LEGAL_OWNER } from './legal'

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

describe('buildMailtoUrl', () => {
  it('opens the business mailbox with the default subject, URL-encoded', () => {
    expect(buildMailtoUrl()).toBe(
      `mailto:${COMPANY.email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`,
    )
  })

  it('accepts another subject and encodes it', () => {
    expect(buildMailtoUrl('Otro asunto, por favor')).toBe(
      `mailto:${COMPANY.email}?subject=Otro%20asunto%2C%20por%20favor`,
    )
  })
})

describe('LEGAL_OWNER.email', () => {
  it('is the same address as COMPANY.email', () => {
    expect(LEGAL_OWNER.email).toBe(COMPANY.email)
  })
})
