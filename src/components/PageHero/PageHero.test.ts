import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from '../../data/contact'
import { renderToHtml, textContent } from '../../test/render'
import PageHero from './PageHero.astro'

const props = {
  eyebrow: 'Antetítulo de prueba',
  title: 'Título de prueba',
  intro: 'Introducción de prueba.',
  ctaLabel: 'Escríbenos por WhatsApp',
}
const html = await renderToHtml(PageHero, props)

describe('PageHero', () => {
  it('holds the page title as its only heading, an <h1>', () => {
    const headings = html.match(/<h[1-6][\s>][\s\S]*?<\/h[1-6]>/g) ?? []
    expect(headings).toHaveLength(1)
    expect(headings[0]).toMatch(/^<h1[\s>]/)
    expect(textContent(headings[0] ?? '')).toBe(props.title)
  })

  it('shows the eyebrow and the intro', () => {
    expect(textContent(html)).toContain(props.eyebrow)
    expect(textContent(html)).toContain(props.intro)
  })

  it('offers WhatsApp with its visible label', () => {
    expect(html).toContain(`href="${buildWhatsAppUrl()}"`)
    expect(textContent(html)).toContain(props.ctaLabel)
  })

  it('is marked for the browser tests', () => {
    expect(html).toMatch(/<section[^>]*data-page-hero/)
  })

  it('puts a breadcrumb, when given, before the eyebrow', async () => {
    const withTrail = await renderToHtml(PageHero, props, { breadcrumb: '<nav>ruta</nav>' })
    expect(withTrail.indexOf('<nav>ruta</nav>')).toBeGreaterThan(-1)
    expect(withTrail.indexOf('<nav>ruta</nav>')).toBeLessThan(withTrail.indexOf(props.eyebrow))
  })
})
