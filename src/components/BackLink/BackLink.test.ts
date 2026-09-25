import { describe, expect, it } from 'vitest'
import { renderToHtml, textContent } from '../../test/render'
import BackLink from './BackLink.astro'

const html = await renderToHtml(BackLink, { href: '/maquinas', label: 'Todas las máquinas' })

describe('BackLink', () => {
  it('renders one link to the given href with the label as its text', () => {
    expect(html.match(/<a[\s>]/g)).toHaveLength(1)
    expect(html).toContain('href="/maquinas"')
    expect(textContent(html)).toContain('Todas las máquinas')
  })

  it('hides the arrow from assistive technology', () => {
    expect(html).toMatch(/<span aria-hidden="true"[^>]*>←<\/span>/)
  })
})
