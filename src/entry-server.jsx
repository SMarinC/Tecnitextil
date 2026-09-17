// Server entry used only at build time by scripts/prerender.js.
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { ROUTES } from './routes.js'
import { OG_IMAGE_PATH, SITE_URL, absoluteUrl } from './content/seo.js'
import { applyHead } from './lib/applyHead.js'
import { buildRobotsTxt, buildSitemapXml } from './lib/siteFiles.js'

export { ROUTES }

export function renderPage(template, route) {
  const appHtml = renderToString(<App path={route.path} />)
  const withHead = applyHead(template, {
    ...route.head,
    url: absoluteUrl(route.path),
    image: absoluteUrl(OG_IMAGE_PATH),
  })
  if (!withHead.includes('<div id="root"></div>')) {
    throw new Error('Template is missing an empty <div id="root"></div>')
  }
  return withHead.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
}

export function renderSiteFiles() {
  return {
    'robots.txt': buildRobotsTxt(SITE_URL),
    'sitemap.xml': buildSitemapXml(
      SITE_URL,
      ROUTES.filter(({ head }) => !head.noindex).map(({ path }) => path),
    ),
  }
}
