# TECNITEXTIL

Web en producción de TECNITEXTIL, empresa de reparación y mantenimiento de máquinas de coser industriales en España. Un sitio estático rápido, accesible y con pruebas completas, cuyo único objetivo es que cada visita termine en una conversación de WhatsApp o en una llamada.

**[Ver la web](https://tecnitextil.vercel.app)** · [Read in English](README.md)

[![checks](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml/badge.svg)](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml)

![Página de inicio de TECNITEXTIL en escritorio](.github/assets/screenshot-desktop.jpg)

## Puntos destacados

- **HTML estático prerenderizado.** Se construyen a la vez la versión de cliente y la de servidor, y `scripts/prerender.js` escribe el HTML final de cada página antes de que React lo hidrate. Los buscadores y las vistas previas de enlaces reciben la página completa sin ejecutar JavaScript.
- **Contenido separado del código.** Todos los textos y datos del negocio están en `src/content/`, así que cambiar un texto nunca obliga a tocar componentes. Las pruebas garantizan que cada enlace del menú apunta a una sección que existe.
- **Accesibilidad probada en el navegador.** Playwright ejecuta axe en todas las páginas y falla si encuentra problemas graves o críticos. También comprueba que las páginas se adaptan con el texto al 200 % en una pantalla de 320px, que el menú respeta la preferencia de movimiento reducido y que el foco del teclado sigue a la sección a la que saltas.
- **Rendimiento por defecto.** Fuentes propias con solo el subconjunto latino y precarga, imágenes WebP con dimensiones explícitas, analítica cargada en un fragmento diferido y cabeceras de caché para los archivos del build con hash.
- **Cabeceras de seguridad estrictas.** Una Content-Security-Policy que solo permite recursos del propio dominio, además de `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- **SEO desde una única fuente.** Las URLs canónicas, las etiquetas Open Graph, los datos estructurados `LocalBusiness`, `robots.txt` y `sitemap.xml` se generan a partir de una sola URL del sitio.

## Capturas

<p>
  <img src=".github/assets/screenshot-toldos.jpg" alt="Sección especializada en máquinas de coser toldos automatizadas en escritorio" width="68%">
  <img src=".github/assets/screenshot-mobile.jpg" alt="Página de inicio en un móvil" width="28%">
</p>

## Tecnologías

React 19 · Vite 8 · CSS Modules · Vitest 5 y Testing Library · Playwright y axe · Lighthouse CI · ESLint · Prettier · husky y lint-staged · GitHub Actions · Dependabot · Vercel

## Controles de calidad

Cada pull request y cada push a `main` ejecuta tres trabajos de CI:

| Trabajo                         | Qué comprueba                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Lint, pruebas unitarias y build | Formato con Prettier, ESLint, 129 pruebas unitarias y de componentes, y el build de producción completo con prerender   |
| Pruebas en navegador            | 16 escenarios de Playwright en móvil (Pixel 7) y escritorio, con auditorías de accesibilidad de axe                     |
| Presupuestos de Lighthouse      | Falla si la accesibilidad baja de 95, el SEO de 90 o el CLS supera 0,1; avisa sobre rendimiento, buenas prácticas y LCP |

Un hook de pre-commit formatea y revisa los archivos preparados, y Dependabot propone actualizaciones de npm cada semana y de GitHub Actions cada mes.

## Empezar

Requiere Node.js 24 (fijado en `.nvmrc`; con nvm, ejecuta `nvm use`).

```sh
npm ci
npm run dev          # http://localhost:5173
```

## Scripts

| Comando            | Qué hace                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo con recarga en caliente                                                                      |
| `npm run build`    | Build de producción en `dist/`: cliente, render en servidor, prerender de cada página, `robots.txt` y `sitemap.xml` |
| `npm run preview`  | Sirve `dist/` con las mismas cabeceras de seguridad que producción                                                  |
| `npm test`         | Pruebas unitarias y de componentes (Vitest y Testing Library)                                                       |
| `npm run test:e2e` | Pruebas en navegador (Playwright y axe) sobre el build. La primera vez: `npx playwright install chromium`           |
| `npm run lint`     | ESLint                                                                                                              |
| `npm run format`   | Formatea el código con Prettier (`format:check` solo comprueba)                                                     |
| `npm run images`   | Regenera `public/logo.webp` desde `public/logo.png` (ejecútalo al cambiar el logo y commitea el resultado)          |

## Cómo está organizado

```
src/
  content/          # todos los textos y datos del negocio (editar aquí)
    company.js      #   nombre, teléfono, cobertura
    home.js         #   textos de cada sección de la página de inicio
    sections.js     #   ids de sección y menú
    legal.js        #   aviso legal, privacidad y datos del titular
    seo.js          #   URL del sitio, títulos, datos estructurados
  components/       # un componente por sección (.jsx + .module.css)
  pages/            # páginas completas (inicio)
  hooks/            # lógica reutilizable de React (sección activa, media queries)
  lib/              # funciones puras y probadas (etiquetas del head, sitemap, scroll)
  styles/           # tokens de diseño y estilos globales
  routes.js         # lista de páginas del sitio
  entry-server.jsx  # render en servidor usado por el prerender
scripts/
  prerender.js      # genera el HTML final de cada página
e2e/                # pruebas en navegador, una por caso de uso (UC-xx)
```

### Cambios habituales

- **Textos, teléfono o marcas:** edita `src/content/`.
- **Una página nueva:** añádela a `src/routes.js`. El prerender, el sitemap y las pruebas de rutas la incluyen automáticamente.
- **Un dominio propio:** define la variable de entorno pública `VITE_SITE_URL` en Vercel (o en un `.env.local`). Por defecto vale `https://tecnitextil.vercel.app`.

## Despliegue

Vercel construye con `npm run build` y publica `dist/` con URLs limpias, cabeceras de seguridad y caché de archivos (ver `vercel.json`). Node.js se fija en `24.x` mediante `engines`.

Como la Content-Security-Policy solo permite recursos del propio dominio, la barra de vistas previas de Vercel (que se carga desde `vercel.live`) está desactivada a propósito con la variable de entorno `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` en el proyecto de Vercel.
