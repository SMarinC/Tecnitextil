import { preload } from 'react-dom'
import interLatin400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url'
import { findRoute } from './routes.js'

function App({ path = '/' }) {
  // Body text, including the home page's largest paint, uses Inter 400: start
  // downloading it together with the HTML instead of after the CSS is parsed.
  preload(interLatin400, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  const { Page, props } = findRoute(path)
  return <Page {...props} />
}

export default App
