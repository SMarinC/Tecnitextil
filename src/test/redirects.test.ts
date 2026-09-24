import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The 13 original machine pages moved under their category on 2026-09-24; vercel.json
// redirects their old URLs permanently. Every old URL must land on a real machine page.
interface Redirect {
  source: string
  destination: string
  permanent?: boolean
}
const { redirects = [] } = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  redirects?: Redirect[]
}
const machineRules = redirects.filter((redirect) => /^\/maquinas\/:modelo\(/.test(redirect.source))
const [rule] = machineRules
const slugs = rule?.source.match(/^\/maquinas\/:modelo\(([^)]+)\)$/)?.[1]?.split('|') ?? []

describe('redirects of the original machine pages', () => {
  it('is one permanent rule for the 13 original machines', () => {
    expect(machineRules).toHaveLength(1)
    expect(rule?.permanent).toBe(true)
    expect(slugs).toHaveLength(13)
  })

  it.each(slugs)('/maquinas/%s lands on an existing machine page', (slug) => {
    const destination = rule?.destination.replace(':modelo', slug) ?? ''
    expect(existsSync(`src/content${destination}/index.md`)).toBe(true)
  })
})
