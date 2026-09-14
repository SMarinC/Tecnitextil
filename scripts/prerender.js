// Pre-renders every route to static HTML after the client build (dist/) and
// the server build (dist-ssr/). Crawlers and link previews get the full page
// content without running JavaScript; the browser then hydrates it.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = path.resolve('dist')
const SSR_DIST = path.resolve('dist-ssr')

const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
const { ROUTES, renderPage } = await import(
  pathToFileURL(path.join(SSR_DIST, 'entry-server.js')).href
)

for (const route of ROUTES) {
  const file = path.join(DIST, route.file)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, renderPage(template, route))
  console.log(`prerendered ${route.path} -> dist/${route.file}`)
}

await rm(SSR_DIST, { recursive: true, force: true })
