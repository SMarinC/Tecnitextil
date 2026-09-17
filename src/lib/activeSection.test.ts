import { describe, expect, it } from 'vitest'
import { isAtPageBottom, pickActiveHref } from './activeSection'

const HREFS = ['#a', '#b', '#c']

describe('pickActiveHref', () => {
  it('returns null when no section is visible', () => {
    expect(pickActiveHref(HREFS, new Set(), false)).toBeNull()
  })

  it('returns the only visible section', () => {
    expect(pickActiveHref(HREFS, new Set(['#b']), false)).toBe('#b')
  })

  it('prefers the last visible section in reading order', () => {
    expect(pickActiveHref(HREFS, new Set(['#c', '#a']), false)).toBe('#c')
  })

  it('activates the last section when scrolled to the bottom, even if not visible', () => {
    expect(pickActiveHref(HREFS, new Set(['#a']), true)).toBe('#c')
  })
})

describe('isAtPageBottom', () => {
  const doc = (scrollHeight: number) => ({ documentElement: { scrollHeight } })

  it('is true when the viewport reaches the end of the document', () => {
    expect(isAtPageBottom({ innerHeight: 800, scrollY: 1200 }, doc(2000))).toBe(true)
  })

  it('tolerates a 2px rounding gap', () => {
    expect(isAtPageBottom({ innerHeight: 800, scrollY: 1198 }, doc(2000))).toBe(true)
  })

  it('is false while there is still content below', () => {
    expect(isAtPageBottom({ innerHeight: 800, scrollY: 1000 }, doc(2000))).toBe(false)
  })
})
