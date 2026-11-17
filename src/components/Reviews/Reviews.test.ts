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

  it('quotes each review with its author', () => {
    const quotes = (html.match(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/g) ?? []).map(textContent)
    const authors = (html.match(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/g) ?? []).map(textContent)
    expect(quotes).toEqual(REVIEWS.items.map(({ text }) => text))
    expect(authors).toEqual(REVIEWS.items.map(({ author }) => author))
  })

  it('names reviewers by first name and initial only', () => {
    for (const { author } of REVIEWS.items) expect(author).toMatch(/^\p{Lu}\p{Ll}+ \p{Lu}\.$/u)
  })

  it('links to all the reviews on Google in a new tab, safely', () => {
    const link = html.match(/<a[^>]*>[\s\S]*?<\/a>/g) ?? []
    expect(link).toHaveLength(1)
    expect(link[0]).toContain(`href="${REVIEWS.href}"`)
    expect(link[0]).toContain('target="_blank"')
    expect(link[0]).toContain('rel="noopener noreferrer"')
    expect(textContent(link[0] ?? '')).toBe(REVIEWS.linkLabel)
  })

  it('keeps the stars out of the accessibility tree', () => {
    expect(html).toMatch(/aria-hidden="true"[^>]*>\s*<svg/)
  })
})
