// Pure "which section is active" logic for the header menu, kept apart from the DOM
// so it can be tested without a browser.

interface ScrollPosition {
  innerHeight: number
  scrollY: number
}

interface ScrollableDocument {
  documentElement: { scrollHeight: number }
}

// On tall viewports the observer's trigger band can't reach the last section, so
// "scrolled to the bottom of the page" is treated as an explicit override.
export function isAtPageBottom(
  win: ScrollPosition = window,
  doc: ScrollableDocument = document,
): boolean {
  return win.innerHeight + win.scrollY >= doc.documentElement.scrollHeight - 2
}

// When several sections intersect the trigger band at once, prefer the last one in
// reading order: the section the reader has most recently scrolled into.
export function pickActiveHref(
  orderedHrefs: readonly string[],
  visibleHrefs: ReadonlySet<string>,
  atPageBottom: boolean,
): string | null {
  if (atPageBottom) return orderedHrefs.at(-1) ?? null
  return [...orderedHrefs].reverse().find((href) => visibleHrefs.has(href)) ?? null
}
