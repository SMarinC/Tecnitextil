// Arrow buttons for a scroll-snap strip. The strip already scrolls by swipe, trackpad and
// keyboard (it is focusable) with no script; this only reveals the arrows, moves the strip
// one page at a time and disables an arrow at either end. Never autoplays.
function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector)
  if (!element) throw new Error(`Carousel is missing ${selector}`)
  return element
}

export function initCarousel(root: HTMLElement): void {
  const track = requireElement<HTMLElement>(root, '[data-carousel-track]')
  const previous = requireElement<HTMLButtonElement>(root, '[data-carousel-previous]')
  const next = requireElement<HTMLButtonElement>(root, '[data-carousel-next]')
  const controls = requireElement<HTMLElement>(root, '[data-carousel-controls]')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function update(): void {
    // 1px of slack: fractional scroll positions never quite reach the end.
    const atStart = track.scrollLeft <= 1
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
    previous.disabled = atStart
    next.disabled = atEnd
    // Nothing to page through when every card fits.
    controls.hidden = atStart && atEnd
  }

  function page(direction: -1 | 1): void {
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    })
  }

  previous.addEventListener('click', () => page(-1))
  next.addEventListener('click', () => page(1))
  track.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  update()
}
