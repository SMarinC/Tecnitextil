// Fills the page-specific <head> of the built index.html template for a
// prerendered route: title, description, Open Graph/Twitter copies, canonical
// URL and optional JSON-LD structured data.

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

// JSON inside <script> must not be able to close the tag.
function serializeJsonLd(data) {
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}

export function applyHead(html, { title, description, url, image, jsonLd }) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) throw new Error('Template is missing <title>')
  if (!html.includes('</head>')) throw new Error('Template is missing </head>')

  let result = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(title)}</title>`)
  result = replaceMetaContent(result, 'name', 'description', description)
  result = replaceMetaContent(result, 'property', 'og:title', title)
  result = replaceMetaContent(result, 'property', 'og:description', description)
  result = replaceMetaContent(result, 'property', 'og:image', image)
  result = replaceMetaContent(result, 'name', 'twitter:image', image)

  const extraTags = [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    jsonLd ? `<script type="application/ld+json">${serializeJsonLd(jsonLd)}</script>` : null,
  ]
    .filter(Boolean)
    .map((tag) => `    ${tag}\n`)
    .join('')

  return result.replace(/[ \t]*<\/head>/, () => `${extraTags}  </head>`)
}
