import { describe, it, expect } from 'vitest'
import { applyHead } from './applyHead.js'

const TEMPLATE = `<head>
    <meta
      name="description"
      content="old description"
    />
    <meta property="og:title" content="OLD" />
    <meta
      property="og:description"
      content="old description"
    />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:image" content="/og-image.png" />
    <title>OLD</title>
  </head>`

const HEAD = {
  title: 'Aviso legal | X',
  description: 'Nueva',
  url: 'https://example.com/aviso-legal',
  image: 'https://example.com/og-image.png',
}

describe('applyHead', () => {
  it('replaces title, description and their Open Graph copies', () => {
    const html = applyHead(TEMPLATE, HEAD)
    expect(html).toContain('<title>Aviso legal | X</title>')
    expect(html).toContain('content="Nueva"')
    expect(html).toContain('<meta property="og:title" content="Aviso legal | X" />')
    expect(html).not.toContain('old description')
    expect(html).not.toContain('OLD')
  })

  it('uses absolute URLs for the share image, canonical and og:url', () => {
    const html = applyHead(TEMPLATE, HEAD)
    expect(html).toContain(
      '<meta property="og:image" content="https://example.com/og-image.png" />',
    )
    expect(html).toContain(
      '<meta name="twitter:image" content="https://example.com/og-image.png" />',
    )
    expect(html).toContain('<link rel="canonical" href="https://example.com/aviso-legal" />')
    expect(html).toContain('<meta property="og:url" content="https://example.com/aviso-legal" />')
    expect(html.indexOf('rel="canonical"')).toBeLessThan(html.indexOf('</head>'))
  })

  it('adds JSON-LD only when given, escaped so it cannot close the script tag', () => {
    expect(applyHead(TEMPLATE, HEAD)).not.toContain('application/ld+json')

    const html = applyHead(TEMPLATE, { ...HEAD, jsonLd: { name: '</script><b>' } })
    const json = html.match(/<script type="application\/ld\+json">(.*)<\/script>/)[1]
    expect(json).not.toContain('</script>')
    expect(JSON.parse(json)).toEqual({ name: '</script><b>' })
  })

  it('escapes HTML special characters and keeps "$" literal', () => {
    const html = applyHead(TEMPLATE, { ...HEAD, title: 'A & <B>', description: 'Precio "$1"' })
    expect(html).toContain('<title>A &amp; &lt;B&gt;</title>')
    expect(html).toContain('content="Precio &quot;$1&quot;"')
  })

  it('fails loudly if the template lost a tag it must replace', () => {
    expect(() => applyHead('<head><title>x</title></head>', HEAD)).toThrow(/description/)
  })
})
