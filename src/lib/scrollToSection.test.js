// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToSection } from './scrollToSection.js'

function setup({ reduceMotion }) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query) => ({ matches: reduceMotion && query === '(prefers-reduced-motion: reduce)' })),
  )
  const section = document.createElement('section')
  section.id = 'destino'
  section.scrollIntoView = vi.fn()
  document.body.append(section)
  return section
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('scrollToSection', () => {
  it('scrolls smoothly and moves focus into the section', () => {
    const section = setup({ reduceMotion: false })
    scrollToSection('#destino')

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(document.activeElement).toBe(section)
    expect(section.getAttribute('tabindex')).toBe('-1')
  })

  it('jumps without animation when the user prefers reduced motion', () => {
    const section = setup({ reduceMotion: true })
    scrollToSection('#destino')

    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })

  it('removes the temporary tabindex once focus leaves the section', () => {
    const section = setup({ reduceMotion: false })
    scrollToSection('#destino')
    section.blur()

    expect(section.hasAttribute('tabindex')).toBe(false)
  })

  it('does nothing when the section does not exist', () => {
    setup({ reduceMotion: false })
    expect(() => scrollToSection('#no-existe')).not.toThrow()
  })
})
