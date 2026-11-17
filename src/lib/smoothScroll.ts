// Smooth scrolling for jumps within a page (the menu's "Contacto", the catalogue's jump
// menu), turned on only once the page has loaded. A page reached through a link with an
// anchor (the breadcrumb's "Máquinas › Pespunte › Con cortahílos") then jumps straight to
// it: WebKit could stop a smooth scroll to the anchor halfway while the page was still
// loading (measured 2026-11-17). global.css still skips it when reduced motion is asked for.
export const SMOOTH_SCROLL_ATTRIBUTE = 'data-smooth-scroll'

export function enableSmoothScrollAfterLoad(): void {
  const enable = () =>
    requestAnimationFrame(() => document.documentElement.setAttribute(SMOOTH_SCROLL_ATTRIBUTE, ''))
  if (document.readyState === 'complete') enable()
  else window.addEventListener('load', enable, { once: true })
}
