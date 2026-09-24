import { describe, expect, it } from 'vitest'
import { CATALOG_COPY } from '../../data/catalog'
import { renderToHtml, textContent } from '../../test/render'
import Breadcrumb from './Breadcrumb.astro'

const html = await renderToHtml(Breadcrumb, {
  items: [
    { label: 'Máquinas', href: '/maquinas' },
    { label: 'Pespunte', href: '/maquinas/pespunte' },
    { label: 'JACK JK-F6' },
  ],
})

describe('Breadcrumb', () => {
  it('is a labelled navigation that links every step but the current page', () => {
    expect(html).toContain(`aria-label="${CATALOG_COPY.breadcrumbLabel}"`)
    expect(html.match(/<a[\s>]/g)).toHaveLength(2)
    expect(html).toContain('href="/maquinas/pespunte"')
  })

  it('marks the current page as text, not as a link', () => {
    const current = html.match(/<li[^>]*aria-current="page"[^>]*>[\s\S]*?<\/li>/)?.[0] ?? ''
    expect(textContent(current)).toBe('JACK JK-F6')
    expect(current).not.toContain('<a')
  })
})
