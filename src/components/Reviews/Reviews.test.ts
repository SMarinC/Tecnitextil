import { describe, expect, it } from 'vitest'
import { REVIEWS } from '../../data/home'
import { renderToHtml, textContent } from '../../test/render'
import Reviews from './Reviews.astro'

const html = await renderToHtml(Reviews)

describe('Reviews', () => {
  it('introduces the reviews with an <h2> and says the rating in words', () => {
    expect(textContent(html.match(/<h2[^>]*>[\s\S]*?<\/h2>/)?.[0] ?? '')).toBe(REVIEWS.heading)
    expect(textContent(html)).toContain(REVIEWS.summary)
  })

  it('quotes each review word for word, with its author and source', () => {
    const quotes = (html.match(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/g) ?? []).map(textContent)
    const captions = (html.match(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/g) ?? []).map(textContent)
    expect(quotes).toEqual(REVIEWS.items.map(({ text }) => text))
    expect(captions).toHaveLength(REVIEWS.items.length)
    REVIEWS.items.forEach(({ author }, index) => {
      expect(captions[index]).toContain(author)
      expect(captions[index]).toContain(REVIEWS.source)
    })
  })

  it('names reviewers by first name and initial only', () => {
    for (const { author } of REVIEWS.items) expect(author).toMatch(/^\p{Lu}\p{Ll}+ \p{Lu}\.$/u)
  })

  it('makes the strip a named, keyboard-scrollable list', () => {
    expect(html).toMatch(
      new RegExp(
        `<ul[^>]*id="opiniones-lista"[^>]*role="list"[^>]*tabindex="0"[^>]*aria-label="${REVIEWS.carouselLabel}"`,
      ),
    )
  })

  it('renders the arrows hidden until the script reveals them, each naming the strip it moves', () => {
    expect(html).toMatch(/data-carousel-controls[^>]*hidden/)
    for (const label of [REVIEWS.previousLabel, REVIEWS.nextLabel]) {
      expect(html).toMatch(
        new RegExp(`<button[^>]*aria-label="${label}"[^>]*aria-controls="opiniones-lista"`),
      )
    }
  })

  it('links to all the reviews on Google in a new tab, safely', () => {
    const links = html.match(/<a[^>]*>[\s\S]*?<\/a>/g) ?? []
    expect(links).toHaveLength(1)
    expect(links[0]).toContain(`href="${REVIEWS.href}"`)
    expect(links[0]).toContain('target="_blank"')
    expect(links[0]).toContain('rel="noopener noreferrer"')
    expect(textContent(links[0] ?? '')).toBe(REVIEWS.linkLabel)
  })

  it('keeps the stars and initials out of the accessibility tree', () => {
    const decorative = html.match(/<span[^>]*aria-hidden="true"/g) ?? []
    // The summary stars, then each card's initial and stars.
    expect(decorative).toHaveLength(1 + REVIEWS.items.length * 2)
  })
})
