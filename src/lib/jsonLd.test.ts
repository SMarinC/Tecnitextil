import { describe, expect, it } from 'vitest'
import { serializeJsonLd } from './jsonLd'

describe('serializeJsonLd', () => {
  it('escapes "<" so the data can never close its script tag', () => {
    const data = { name: '</script><script>alert(1)</script>' }
    const json = serializeJsonLd(data)
    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual(data)
  })
})
