import { isAtPageBottom, pickActiveHref } from './activeSection'
import { DESKTOP_MEDIA_QUERY } from './breakpoints'

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector)
  if (!element) throw new Error(`Header menu is missing ${selector}`)
  return element
}

// Opens and closes the mobile panel and marks the menu link of the section being read.
// Navigation itself is plain anchors: the browser updates the #hash, scrolls (smoothly
// unless reduced motion is preferred, see global.css) and moves the keyboard starting
// point into the section.
export function initHeaderMenu(header: HTMLElement): void {
  const toggle = requireElement<HTMLButtonElement>(header, '[data-menu-toggle]')
  const panel = requireElement<HTMLElement>(header, '[data-mobile-nav]')
  const openIcon = requireElement<HTMLElement>(header, '[data-menu-icon="open"]')
  const closeIcon = requireElement<HTMLElement>(header, '[data-menu-icon="close"]')
  const links = [...header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')]

  function setMenuOpen(open: boolean): void {
    panel.hidden = !open
    openIcon.hidden = open
    closeIcon.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    const label = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen
    if (label) toggle.setAttribute('aria-label', label)
  }

  toggle.addEventListener('click', () => setMenuOpen(panel.hidden === true))
  panel.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setMenuOpen(false)
  })
  // Kept in a variable: some engines only weakly reference an inline MediaQueryList,
  // so its change listener could otherwise be garbage-collected.
  const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false)
  })

  const hrefs = [...new Set(links.map((link) => link.hash))]
  const sections = hrefs
    .map((href) => document.querySelector(href))
    .filter((section) => section !== null)
  const visibleHrefs = new Set<string>()
  // undefined (never a real href) so the first call always runs.
  let lastActiveHref: string | null | undefined

  function markActiveLink(): void {
    const activeHref = pickActiveHref(hrefs, visibleHrefs, isAtPageBottom())
    if (activeHref === lastActiveHref) return
    lastActiveHref = activeHref
    for (const link of links) {
      if (link.hash === activeHref) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    }
  }

  // The trigger band starts where the sticky header ends (--header-offset, the value
  // `html` also uses for scroll-padding-top) and ends at 30% of the viewport height.
  // Falls back to the token's own value (see tokens.css) if the custom property ever
  // resolves empty, so the IntersectionObserver constructor below never throws.
  const headerOffset =
    getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim() || '128px'
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const href = `#${entry.target.id}`
        if (entry.isIntersecting) visibleHrefs.add(href)
        else visibleHrefs.delete(href)
      }
      markActiveLink()
    },
    { rootMargin: `-${headerOffset} 0px -70% 0px`, threshold: 0 },
  )
  sections.forEach((section) => observer.observe(section))

  // The band never reaches the last section on tall viewports, so re-check the
  // bottom-of-page override while scrolling and resizing.
  window.addEventListener('scroll', markActiveLink, { passive: true })
  window.addEventListener('resize', markActiveLink)
}
