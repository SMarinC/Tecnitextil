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
    <title>OLD</title>
  </head>`

describe('applyHead', () => {
  it('replaces title, description and their Open Graph copies', () => {
    const html = applyHead(TEMPLATE, { title: 'Aviso legal | X', description: 'Nueva' })
    expect(html).toContain('<title>Aviso legal | X</title>')
    expect(html).toContain('content="Nueva"')
    expect(html).toContain('<meta property="og:title" content="Aviso legal | X" />')
    expect(html).not.toContain('old description')
    expect(html).not.toContain('OLD')
  })

  it('escapes HTML special characters and keeps "$" literal', () => {
    const html = applyHead(TEMPLATE, { title: 'A & <B>', description: 'Precio "$1"' })
    expect(html).toContain('<title>A &amp; &lt;B&gt;</title>')
    expect(html).toContain('content="Precio &quot;$1&quot;"')
  })

  it('fails loudly if the template lost a tag it must replace', () => {
    expect(() => applyHead('<title>x</title>', { title: 't', description: 'd' })).toThrow(
      /description/,
    )
  })
})
