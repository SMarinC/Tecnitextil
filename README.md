# TECNITEXTIL · Web

Web de TECNITEXTIL, empresa de reparación, mantenimiento y venta de maquinaria textil e industrial en España. Su objetivo es que cada visita termine en una conversación de WhatsApp o una llamada.

Sitio estático hecho con **Vite + React**, prerenderizado en el build y desplegado en **Vercel**.

## Requisitos

- Node.js 24 (versión fijada en `.nvmrc`; con nvm: `nvm use`).

## Empezar

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
| `npm test`         | Pruebas unitarias y de componentes (Vitest + Testing Library)                                                       |
| `npm run test:e2e` | Pruebas en navegador (Playwright + axe) sobre el build. La primera vez: `npx playwright install chromium`           |
| `npm run lint`     | ESLint                                                                                                              |
| `npm run format`   | Formatea el código con Prettier (`format:check` solo comprueba)                                                     |
| `npm run images`   | Regenera `public/logo.webp` desde `public/logo.png` (ejecutar al cambiar el logo y commitear el resultado)          |

## Cómo está organizado

```
src/
  content/        # TODOS los textos y datos del negocio (editar aquí)
    company.js    #   nombre, teléfono, cobertura
    home.js       #   textos de cada sección de la página de inicio
    sections.js   #   ids de sección y menú
    legal.js      #   aviso legal, privacidad y datos del titular
    seo.js        #   dominio, títulos, datos estructurados
  components/     # un componente por sección (.jsx + .module.css)
  pages/          # páginas completas (inicio)
  hooks/          # lógica reutilizable de React (sección activa, media queries)
  lib/            # funciones puras y probadas (head, sitemap, scroll)
  styles/         # tokens de diseño y estilos globales
  routes.js       # lista de páginas del sitio
  entry-server.jsx  # render en servidor usado por el prerender
scripts/
  prerender.js    # genera el HTML final de cada página
e2e/              # pruebas en navegador por caso de uso (UC-xx)
```

### Cambios habituales

- **Textos, teléfono o marcas:** `src/content/`. Las pruebas comprueban que el menú siga apuntando a secciones existentes.
- **Nueva página:** añadirla a `src/routes.js`; el prerender, el sitemap y las pruebas de rutas la incluyen automáticamente.
- **Dominio definitivo:** variable `VITE_SITE_URL` (ver `.env.example`) en local y en Vercel.

## Calidad

- **CI (GitHub Actions):** lint, pruebas unitarias y build; pruebas en navegador con axe; presupuestos de Lighthouse (accesibilidad y SEO ≥ 90, CLS < 0,1).
- **Hooks de git:** al hacer commit se formatean y revisan los archivos modificados.
- **Dependabot:** propone actualizaciones de dependencias cada semana.

## Despliegue

Vercel construye con `npm run build` y publica `dist/` (ver `vercel.json`: URLs limpias, cabeceras de seguridad y caché de assets). Node.js se fija en `24.x` mediante `engines`.

La Content-Security-Policy solo permite recursos del propio dominio, así que el toolbar de Vercel (comentarios en previews, que se carga desde `vercel.live`) está desactivado a propósito con la variable de entorno `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` en el proyecto de Vercel.

## Pendiente antes de publicar

- Revisar los textos legales (`src/content/legal.js`) con una asesoría. Los datos del titular ya están completos; si alguno se vacía, las páginas legales vuelven a mostrar un aviso de borrador.
- Definir el dominio definitivo (`VITE_SITE_URL`) y registrarlo en Google Search Console.
