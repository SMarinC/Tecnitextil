import { DESKTOP_MEDIA_QUERY } from './breakpoints'

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector)
  if (!element) throw new Error(`Header menu is missing ${selector}`)
  return element
}

// Opens and closes the mobile menu panel. Navigation itself is plain links: pages load
// normally and "Contacto" is an anchor, so the browser scrolls (smoothly unless reduced
// motion is preferred, see global.css) and moves the keyboard starting point there.
export function initHeaderMenu(header: HTMLElement): void {
  const toggle = requireElement<HTMLButtonElement>(header, '[data-menu-toggle]')
  const panel = requireElement<HTMLElement>(header, '[data-mobile-nav]')
  const openIcon = requireElement<HTMLElement>(header, '[data-menu-icon="open"]')
  const closeIcon = requireElement<HTMLElement>(header, '[data-menu-icon="close"]')

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
}
