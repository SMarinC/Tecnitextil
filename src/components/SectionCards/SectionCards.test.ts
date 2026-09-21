import { describe, expect, it } from 'vitest'
import { SECTION_CARDS } from '../../data/home'
import { renderToHtml, textContent } from '../../test/render'
import SectionCards from './SectionCards.astro'

const html = await renderToHtml(SectionCards)

describe('SectionCards', () => {
  it('introduces the cards with an <h2>', () => {
    expect(textContent(html.match(/<h2[^>]*>[\s\S]*?<\/h2>/)?.[0] ?? '')).toBe(
      SECTION_CARDS.heading,
    )
  })

  it('gives each card one link, named by its <h3> title', () => {
    const links = html.match(/<a[^>]*>[\s\S]*?<\/a>/g) ?? []
    expect(links).toHaveLength(SECTION_CARDS.items.length)
    SECTION_CARDS.items.forEach(({ title, href }, index) => {
      expect(links[index]).toContain(`href="${href}"`)
      expect(textContent(links[index] ?? '')).toBe(title)
    })
    const titles = (html.match(/<h3[^>]*>[\s\S]*?<\/h3>/g) ?? []).map(textContent)
    expect(titles).toEqual(SECTION_CARDS.items.map(({ title }) => title))
  })

  it('keeps "Ver más" out of the accessibility tree', () => {
    expect(html).toMatch(new RegExp(`aria-hidden="true"[^>]*>${SECTION_CARDS.moreLabel}<`))
  })

  it('keeps list semantics on the styled list', () => {
    expect(html).toMatch(/<ul[^>]*role="list"/)
  })
})
