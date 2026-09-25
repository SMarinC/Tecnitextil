// A WhatsApp or email click never navigates this site away, so neither can be counted
// as a real pageview. Instead each is reported as a *virtual* visit to a "/contactar/..."
// or "/contactar-correo/..." path, mirrored from the page the visitor was on: Vercel →
// Analytics → Pages, filtered by either prefix, then shows clicks per page and per
// machine.
//
// Both accept the clean route (`window.location.pathname`, e.g. `/toldos/`) and the
// built file name (`Astro.url.pathname` under `build.format: 'file'`, e.g.
// `/index.html`, `/maquinas/ojales-botones-presillas/jk-n9-d.html`) so callers never
// have to know which one they were handed.
function cleanPagePath(pathname: string): string {
  let path = pathname.replace(/\.html$/, '')
  if (path.length > 1) path = path.replace(/\/$/, '')
  return path
}

export function contactPagePath(pathname: string): string {
  const path = cleanPagePath(pathname)
  if (path === '/' || path === '/index') return '/contactar/portada'
  return `/contactar${path}`
}

export function emailContactPagePath(pathname: string): string {
  const path = cleanPagePath(pathname)
  if (path === '/' || path === '/index') return '/contactar-correo/portada'
  return `/contactar-correo${path}`
}
