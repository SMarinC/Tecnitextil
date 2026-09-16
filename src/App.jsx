import { preload } from 'react-dom'
import interLatin400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url'
import oswaldLatin600 from '@fontsource/oswald/files/oswald-latin-600-normal.woff2?url'
import { findRoute } from './routes.js'

function App({ path = '/' }) {
  // Body text, including the home page's largest paint, uses Inter 400: start
  // downloading it together with the HTML instead of after the CSS is parsed.
  preload(interLatin400, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  // The header nav and CTA use Oswald 600: preload it too, so the desktop
  // header renders in its final font on first paint instead of a wider
  // fallback font that can make the CTA wrap for a moment.
  preload(oswaldLatin600, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  const { Page, props } = findRoute(path)
  return <Page {...props} />
}

export default App
