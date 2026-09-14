// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import Header from './Header.jsx'
import { useActiveSection } from '../../hooks/useActiveSection.js'

// jsdom implements neither matchMedia nor IntersectionObserver nor
// scrollIntoView, so each test controls them explicitly.
function mockMatchMedia() {
  const listeners = new Set()
  const mediaQueryList = {
    matches: false,
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryList))
  return {
    setMatches(matches) {
      mediaQueryList.matches = matches
      listeners.forEach((listener) => listener({ matches }))
    },
  }
}

function mockIntersectionObserver() {
  const observer = { callback: null }
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback) {
        observer.callback = callback
      }
      observe() {}
      disconnect() {}
    },
  )
  return observer
}

function addSection(id) {
  const section = document.createElement('section')
  section.id = id
  document.body.append(section)
  return section
}

let media
let intersection

beforeEach(() => {
  media = mockMatchMedia()
  intersection = mockIntersectionObserver()
  vi.stubGlobal('requestAnimationFrame', (callback) => {
    callback()
    return 0
  })
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('Header mobile menu', () => {
  it('opens and closes with the toggle button', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const toggle = screen.getByRole('button', { name: 'Abrir menú de navegación' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar menú de navegación' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await user.click(screen.getByRole('button', { name: 'Cerrar menú de navegación' }))
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument()
  })

  it('closes when the viewport grows to the desktop breakpoint', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }))

    act(() => media.setMatches(true))

    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument()
  })

  it('closes, scrolls to the section and moves focus into it when a link is chosen', async () => {
    const user = userEvent.setup()
    const section = addSection('que-hacemos')
    render(<Header />)
    await user.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }))

    const mobileNav = screen.getByRole('navigation', { name: 'Navegación móvil' })
    await user.click(mobileNav.querySelector('a[href="#que-hacemos"]'))

    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).not.toBeInTheDocument()
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(section).toHaveFocus()
    expect(section).toHaveAttribute('tabindex', '-1')
  })
})

describe('Header links', () => {
  it('the WhatsApp link opens wa.me safely in a new tab', () => {
    render(<Header />)
    const link = screen.getByRole('link', { name: 'WhatsApp' })
    expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('useActiveSection', () => {
  const HREFS = ['#uno', '#dos']
  const options = { rootMargin: '-128px 0px -70% 0px' }

  it('starts with no active section', () => {
    const { result } = renderHook(() => useActiveSection(HREFS, options))
    expect(result.current).toBeNull()
  })

  it('reports the section that enters the trigger band', () => {
    addSection('uno')
    const dos = addSection('dos')
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 10_000,
    })
    const { result } = renderHook(() => useActiveSection(HREFS, options))

    act(() => intersection.callback([{ target: dos, isIntersecting: true }]))
    expect(result.current).toBe('#dos')

    act(() => intersection.callback([{ target: dos, isIntersecting: false }]))
    expect(result.current).toBeNull()
  })
})
