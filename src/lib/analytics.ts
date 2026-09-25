import { inject, pageview } from '@vercel/analytics'
import { contactPagePath, emailContactPagePath } from './contactTracking'

// Vercel Web Analytics on the free plan has no custom events, so a WhatsApp or email
// click is counted as a "virtual" pageview under /contactar or /contactar-correo instead
// (see contactTracking.ts). This replaces `@vercel/analytics/astro`'s `<Analytics />`
// component: that component reads `Astro.url.pathname` for its own pageview, and this
// site builds with `build.format: 'file'`, so that string keeps the file name
// (`/index.html`, `/maquinas.html`...) instead of the clean URL visitors actually see.
// `inject` without a fixed path reads `location.pathname` itself at navigation time,
// which is always the clean route, so the automatic pageviews it sends need no help
// here.
export function initAnalytics(): void {
  inject({ framework: 'astro' })

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return
    // Neither link is ever intercepted or delayed: on iOS a universal link to wa.me
    // only opens the WhatsApp app when the tap itself drives the navigation, and a
    // mailto: link opens the mail app the same way, so the pageview call below must be
    // fire-and-forget alongside the browser's own handling of the click, not a step
    // before it.
    const whatsapp = event.target.closest('a[data-whatsapp]')
    const email = event.target.closest('a[data-contact="email"]')
    if (!whatsapp && !email) return

    const path = whatsapp
      ? contactPagePath(window.location.pathname)
      : emailContactPagePath(window.location.pathname)
    pageview({ route: path, path })
  })
}
