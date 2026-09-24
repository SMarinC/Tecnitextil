import { describe, expect, it } from 'vitest'
import { CATALOG_COPY, familyById } from '../../data/catalog'
import { groupByType, machinePath } from '../../lib/catalog'
import { sampleMachine } from '../../test/machines'
import { renderToHtml, textContent } from '../../test/render'
import MachineGroups from './MachineGroups.astro'

const machines = [
  sampleMachine(),
  sampleMachine({
    id: 'ojales-botones-presillas/jk-n9-d',
    modelo: 'JK-N9-D',
    tipo: 'ojales',
    nombre: 'Ojaladora',
  }),
]
const html = await renderToHtml(MachineGroups, {
  groups: groupByType(familyById('ojales-botones-presillas'), machines),
})

describe('MachineGroups', () => {
  it('jumps to each type from a labelled navigation', () => {
    const nav = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? ''
    expect(nav).toContain(`aria-label="${CATALOG_COPY.jumpNavLabel}"`)
    expect(nav).toContain('href="#ojales"')
    expect(nav).toContain('href="#presillas-y-botones"')
  })

  it('gives each type a section with an id and an <h2>', () => {
    expect(html).toMatch(/<section[^>]*id="ojales"[\s\S]*?<h2[^>]*>\s*Ojales\s*<\/h2>/)
  })

  it('shows each machine as one link to its page, with no price and no WhatsApp', () => {
    const cards = html.match(/<li[^>]*>[\s\S]*?<\/li>/g) ?? []
    expect(cards).toHaveLength(2)
    for (const card of cards) {
      expect(card.match(/<a[\s>]/g)).toHaveLength(1)
      expect(card).not.toContain('wa.me')
      expect(textContent(card)).toContain(CATALOG_COPY.priceOnRequest)
      expect(textContent(card)).not.toMatch(/€|\bIVA\b/)
    }
    expect(html).toContain(`href="${machinePath({ id: 'ojales-botones-presillas/jk-n9-d' })}"`)
  })

  it('shows a machine without photos with the no-photo frame, not a broken image', async () => {
    const family = familyById('ojales-botones-presillas')
    const html = await renderToHtml(MachineGroups, {
      groups: groupByType(family, [sampleMachine({ fotos: [] })]),
    })
    expect(textContent(html)).toContain(CATALOG_COPY.noPhoto)
    expect(html).not.toContain('<img')
  })
})
