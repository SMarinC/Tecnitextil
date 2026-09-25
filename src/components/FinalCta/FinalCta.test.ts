import { describe, expect, it } from 'vitest'
import { COMPANY } from '../../data/company'
import { buildMailtoUrl, buildWhatsAppUrl } from '../../data/contact'
import { FINAL_CTA } from '../../data/site'
import { renderToHtml, textContent } from '../../test/render'
import FinalCta from './FinalCta.astro'

describe('FinalCta', () => {
  it('closes with the WhatsApp link, the email button and the address text', async () => {
    const html = await renderToHtml(FinalCta)
    const text = textContent(html)

    expect(html).toContain(`href="${buildWhatsAppUrl()}"`)
    expect(text).toContain(FINAL_CTA.ctaLabel)

    expect(html).toContain(`href="${buildMailtoUrl()}"`)
    expect(text).toContain(FINAL_CTA.emailLabel)
    expect(html).toContain('data-contact="email"')

    expect(text).toContain(COMPANY.email)
  })
})
