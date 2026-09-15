// Scrolls to an in-page section and moves focus into it.
//
// The scroll animates unless the user asked the OS to reduce motion, in which
// case it jumps directly (WCAG 2.3.3).
//
// Callers intercept the anchor click with preventDefault(), which suppresses
// the browser's native fragment navigation that normally moves focus to the
// target. Restore that behavior explicitly so keyboard/screen-reader users
// land in the section they just navigated to, not stranded in the header.
// tabindex="-1" makes the section script-focusable without adding it to the
// normal Tab order; preventScroll avoids a second, competing scroll jump.
export function scrollToSection(href) {
  const target = document.querySelector(href)
  if (!target) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
}
