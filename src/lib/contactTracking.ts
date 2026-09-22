// A WhatsApp click never navigates this site away, so it cannot be counted as a real
// pageview. Instead it is reported as a *virtual* visit to a "/contactar/..." path,
// mirrored from the page the visitor was on: Vercel → Analytics → Pages, filtered by
// /contactar, then shows clicks per page and per machine.
//
// Accepts both the clean route (`window.location.pathname`, e.g. `/toldos/`) and the
// built file name (`Astro.url.pathname` under `build.format: 'file'`, e.g.
// `/index.html`, `/maquinas/jk-n9-d.html`) so callers never have to know which one
// they were handed.
export function contactPagePath(pathname: string): string {
  let path = pathname.replace(/\.html$/, '')
  if (path.length > 1) path = path.replace(/\/$/, '')

  if (path === '/' || path === '/index') return '/contactar/portada'
  return `/contactar${path}`
}
