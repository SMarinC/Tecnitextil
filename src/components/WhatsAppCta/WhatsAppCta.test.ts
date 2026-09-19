import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from '../../data/contact'
import { renderToHtml, textContent } from '../../test/render'
import WhatsAppCta from './WhatsAppCta.astro'

const VARIANTS = ['header', 'primary', 'floating'] as const

describe('WhatsAppCta', () => {
  it.each(VARIANTS)('%s variant opens the WhatsApp chat safely in a new tab', async (variant) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- plain tsc (unlike Astro's language server) can't resolve `.astro` imports, so they type-check as `error`
    const html = await renderToHtml(WhatsAppCta, { variant, label: 'Escribir' })
    expect(html).toContain(`href="${buildWhatsAppUrl()}"`)
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it.each(['header', 'primary'] as const)(
    '%s variant shows its label as visible text',
    async (variant) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- plain tsc (unlike Astro's language server) can't resolve `.astro` imports, so they type-check as `error`
      const html = await renderToHtml(WhatsAppCta, { variant, label: 'Contáctanos' })
      expect(textContent(html)).toBe('Contáctanos')
      expect(html).not.toContain('aria-label')
    },
  )

  it('floating variant is icon-only and uses the label as its accessible name', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- plain tsc (unlike Astro's language server) can't resolve `.astro` imports, so they type-check as `error`
    const html = await renderToHtml(WhatsAppCta, {
      variant: 'floating',
      label: 'Escribir por WhatsApp',
    })
    expect(html).toContain('aria-label="Escribir por WhatsApp"')
    expect(textContent(html)).toBe('')
  })
})
