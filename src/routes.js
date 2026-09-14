import HomePage from './pages/HomePage.jsx'
import LegalPage from './components/LegalPage/LegalPage.jsx'
import { COMPANY } from './content/company.js'
import { LEGAL_NOTICE, PRIVACY_POLICY } from './content/legal.js'

// Every page of the site. scripts/prerender.js writes one static HTML file per
// route; the browser picks the same route from the URL when hydrating.
export const ROUTES = [
  {
    path: '/',
    file: 'index.html',
    Page: HomePage,
    props: {},
    head: {
      title: COMPANY.name,
      description:
        'TECNITEXTIL — Reparación de maquinaria textil e industrial: máquinas de coser, corte, confección y equipos auxiliares en toda España. +20 años de experiencia. Recogida a domicilio.',
    },
  },
  ...[LEGAL_NOTICE, PRIVACY_POLICY].map((page) => ({
    path: page.path,
    file: `${page.path.slice(1)}.html`,
    Page: LegalPage,
    props: { page },
    head: { title: `${page.title} | ${COMPANY.name}`, description: page.description },
  })),
]

// Accepts "/privacidad", "/privacidad/" or "/privacidad.html". Unknown paths
// fall back to the home page.
export function findRoute(pathname) {
  const normalized =
    pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/(.)\/+$/, '$1') || '/'
  return ROUTES.find((route) => route.path === normalized) ?? ROUTES[0]
}
