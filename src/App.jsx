import { findRoute } from './routes.js'

function App({ path = '/' }) {
  const { Page, props } = findRoute(path)
  return <Page {...props} />
}

export default App
