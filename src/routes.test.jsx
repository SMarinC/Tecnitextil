import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { ROUTES, findRoute } from './routes.js'
import { PENDING, hasPendingLegalData } from './content/legal.js'

describe('findRoute', () => {
  it.each([
    ['/', '/'],
    ['/index.html', '/'],
    ['/privacidad', '/privacidad'],
    ['/privacidad/', '/privacidad'],
    ['/aviso-legal.html', '/aviso-legal'],
    ['/no-existe', '/'],
  ])('resolves %s to %s', (pathname, expected) => {
    expect(findRoute(pathname).path).toBe(expected)
  })
})

describe('routes', () => {
  it('every route has a unique path, output file and a head title and description', () => {
    expect(new Set(ROUTES.map(({ path }) => path)).size).toBe(ROUTES.length)
    expect(new Set(ROUTES.map(({ file }) => file)).size).toBe(ROUTES.length)
    for (const { head } of ROUTES) {
      expect(head.title).toBeTruthy()
      expect(head.description.length).toBeGreaterThan(50)
    }
  })

  it.each(ROUTES.map(({ path }) => path))('%s renders exactly one <h1>', (path) => {
    const html = renderToString(<App path={path} />)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
  })

  it('every page preloads the body font (Inter 400, Latin) in its HTML', () => {
    for (const { path } of ROUTES) {
      const html = renderToString(<App path={path} />)
      const link = html.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/)?.[0]
      expect(link, path).toBeDefined()
      expect(link).toMatch(/href="[^"]*inter-latin-400-normal[^"]*\.woff2"/)
      expect(link).toContain('crossorigin')
    }
  })

  it('every page links to the legal notice and privacy policy', () => {
    for (const { path } of ROUTES) {
      const html = renderToString(<App path={path} />)
      expect(html).toContain('href="/aviso-legal"')
      expect(html).toContain('href="/privacidad"')
    }
  })

  it('legal pages warn visibly while owner data is pending, never inventing it', () => {
    const html = renderToString(<App path="/aviso-legal" />)
    expect(html.includes(PENDING)).toBe(hasPendingLegalData)
  })
})
