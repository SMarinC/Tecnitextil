import { describe, expect, it } from 'vitest'
import { buildMailtoUrl } from '../../data/contact'
import { renderToHtml, textContent } from '../../test/render'
import EmailCta from './EmailCta.astro'

describe('EmailCta', () => {
  it('opens the default mailto with the business address and subject', async () => {
    const html = await renderToHtml(EmailCta, { label: 'Escríbenos' })
    expect(html).toContain(`href="${buildMailtoUrl()}"`)
  })

  it('shows its label as visible text', async () => {
    const html = await renderToHtml(EmailCta, { label: 'Escríbenos un correo' })
    expect(textContent(html)).toBe('Escríbenos un correo')
  })

  it('is marked for email click tracking', async () => {
    const html = await renderToHtml(EmailCta, { label: 'Escríbenos' })
    expect(html).toContain('data-contact="email"')
  })

  it('never opens in a new tab: mailto opens the mail app in place', async () => {
    const html = await renderToHtml(EmailCta, { label: 'Escríbenos' })
    expect(html).not.toContain('target=')
  })

  it('can open the mail app with a specific subject', async () => {
    const html = await renderToHtml(EmailCta, {
      label: 'Consultar',
      subject: 'Presupuesto JK-N9-D',
    })
    expect(html).toContain(`href="${buildMailtoUrl('Presupuesto JK-N9-D')}"`)
  })
})
