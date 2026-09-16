// Lógica pura de "qué sección está activa" en el menú, separada del DOM
// para poder probarla sin navegador.

// On tall viewports the observer's trigger band can't reach the last section
// (its content plus the footer don't add up to enough scrollable height), so
// "scrolled to the bottom of the page" is treated as an explicit override.
export function isAtPageBottom(win = window, doc = document) {
  return win.innerHeight + win.scrollY >= doc.documentElement.scrollHeight - 2
}

// When multiple sections intersect the trigger band at once (common near the
// bottom of a short page), prefer the last one in reading order — the section
// the user has most recently scrolled into.
export function pickActiveHref(orderedHrefs, visibleHrefs, atPageBottom) {
  if (atPageBottom) return orderedHrefs.at(-1) ?? null
  return [...orderedHrefs].reverse().find((href) => visibleHrefs.has(href)) ?? null
}
