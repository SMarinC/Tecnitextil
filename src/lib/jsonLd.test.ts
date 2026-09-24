import { describe, expect, it } from 'vitest'
import { absoluteUrl } from '../data/seo'
import { breadcrumbJsonLd, serializeJsonLd } from './jsonLd'

describe('serializeJsonLd', () => {
  it('escapes "<" so the data can never close its script tag', () => {
    const data = { name: '</script><script>alert(1)</script>' }
    const json = serializeJsonLd(data)
    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual(data)
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers the steps and links every one but the current page', () => {
    expect(
      breadcrumbJsonLd([{ label: 'Máquinas', href: '/maquinas' }, { label: 'Pespunte' }]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Máquinas', item: absoluteUrl('/maquinas') },
        { '@type': 'ListItem', position: 2, name: 'Pespunte' },
      ],
    })
  })
})
