import { describe, expect, it } from 'vitest'
import { CATALOG_COPY, familyById, modelCountLabel } from '../../data/catalog'
import { familyCards, familyPath } from '../../lib/catalog'
import { SAMPLE_FAMILY, sampleMachine, sampleSewingMachine } from '../../test/machines'
import { renderToHtml, textContent } from '../../test/render'
import MachineFamilies from './MachineFamilies.astro'

const families = [familyById('ojales-botones-presillas'), SAMPLE_FAMILY]
const machines = [sampleMachine(), sampleSewingMachine('JK-F6'), sampleSewingMachine('JK-F6-HL-7')]
const html = await renderToHtml(MachineFamilies, { cards: familyCards(machines, families) })

describe('MachineFamilies', () => {
  it('lists the categories under one <h2>', () => {
    expect(textContent(html.match(/<h2[^>]*>[\s\S]*?<\/h2>/)?.[0] ?? '')).toBe(
      CATALOG_COPY.familiesHeading,
    )
  })

  it('gives each category one link, its model count and its summary, with no WhatsApp', () => {
    const cards = html.match(/<li[^>]*>[\s\S]*?<\/li>/g) ?? []
    expect(cards).toHaveLength(2)
    const sewing = cards[1] ?? ''
    expect(sewing.match(/<a[\s>]/g)).toHaveLength(1)
    expect(sewing).toContain(`href="${familyPath(SAMPLE_FAMILY)}"`)
    expect(textContent(sewing)).toContain(modelCountLabel(2))
    expect(textContent(sewing)).toContain(SAMPLE_FAMILY.summary)
    expect(html).not.toContain('wa.me')
  })

  it('treats the cover photo as decoration: the title names the link', () => {
    // Astro serializes an empty string attribute as its bare name, with no `=""`.
    expect(html.match(/<img[^>]* alt(?:="")?[\s>]/g)).toHaveLength(2)
  })
})
