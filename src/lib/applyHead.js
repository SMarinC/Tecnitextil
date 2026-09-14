// Replaces the page-specific <head> values of the built index.html template
// (title, description and their Open Graph copies) for a prerendered route.

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function replaceMetaContent(html, attribute, name, content) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${name}"\\s+content=")[^"]*(")`)
  if (!pattern.test(html)) throw new Error(`Template is missing <meta ${attribute}="${name}">`)
  return html.replace(pattern, (_match, start, end) => `${start}${escapeHtml(content)}${end}`)
}

export function applyHead(html, { title, description }) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error('Template is missing <title>')
  let result = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
  result = replaceMetaContent(result, 'name', 'description', description)
  result = replaceMetaContent(result, 'property', 'og:title', title)
  result = replaceMetaContent(result, 'property', 'og:description', description)
  return result
}
