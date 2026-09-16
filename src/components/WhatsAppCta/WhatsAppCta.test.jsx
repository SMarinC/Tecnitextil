import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import WhatsAppCta from './WhatsAppCta.jsx'
import { buildWhatsAppUrl } from '../../content/contact.js'

const expectedHref = buildWhatsAppUrl().replaceAll('&', '&amp;')

describe('WhatsAppCta', () => {
  it.each(['header', 'primary', 'floating'])(
    '%s variant opens the WhatsApp chat safely in a new tab',
    (variant) => {
      const markup = renderToStaticMarkup(<WhatsAppCta variant={variant} label="Escribir" />)
      expect(markup).toContain(`href="${expectedHref}"`)
      expect(markup).toContain('target="_blank"')
      expect(markup).toContain('rel="noopener noreferrer"')
    },
  )

  it.each(['header', 'primary'])('%s variant shows its label as visible text', (variant) => {
    const markup = renderToStaticMarkup(<WhatsAppCta variant={variant} label="Contáctanos" />)
    expect(markup).toMatch(/<\/svg>Contáctanos<\/a>$/)
    expect(markup).not.toContain('aria-label')
  })

  it('floating variant is icon-only and uses the label as its accessible name', () => {
    const markup = renderToStaticMarkup(
      <WhatsAppCta variant="floating" label="Escribir por WhatsApp" />,
    )
    expect(markup).toContain('aria-label="Escribir por WhatsApp"')
    expect(markup).toMatch(/<\/svg><\/a>$/)
  })
})
