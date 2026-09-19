# TECNITEXTIL

Web en producción de TECNITEXTIL, empresa de reparación y mantenimiento de máquinas de coser industriales en España. Un sitio estático rápido y accesible, cuyo único objetivo es que cada visita termine en una conversación de WhatsApp o en una llamada.

**[Ver la web](https://tecnitextil.vercel.app)** · [Read in English](README.md)

[![checks](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml/badge.svg)](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml)

![Página de inicio de TECNITEXTIL en escritorio](.github/assets/screenshot-desktop.jpg)

## Puntos destacados

- **HTML estático y JavaScript solo donde hace falta.** Astro genera cada página en el build. El único script del navegador es el del menú del header, y las pruebas en navegador fallan si una página descarga más de 15 kB de JavaScript.
- **Navegación nativa.** Los enlaces del menú son anclas normales: cada sección se puede compartir por URL, el botón "atrás" funciona y el desplazamiento suave es CSS que respeta la preferencia de movimiento reducido.
- **Contenido separado del código.** Todos los textos y datos del negocio están en módulos tipados en `src/data/`, así que cambiar un texto nunca obliga a tocar componentes.
- **Accesibilidad probada en el navegador.** Playwright ejecuta axe en todas las páginas y falla si encuentra problemas graves o críticos. También comprueba que las páginas se adaptan con el texto al 200 % en una pantalla de 320px y que el menú móvil funciona con sus nombres accesibles.
- **Rendimiento por defecto.** Fuentes propias con solo el subconjunto latino y precarga desde el `<head>`, imágenes redimensionadas y convertidas a WebP en el build, y caché de larga duración para los archivos con hash.
- **Cabeceras de seguridad estrictas.** Una Content-Security-Policy que solo permite recursos del propio dominio, verificada en las pruebas en navegador, además de `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy`.
- **SEO desde una única fuente.** Las URLs canónicas, las etiquetas Open Graph, los datos estructurados `LocalBusiness`, `robots.txt` y `sitemap.xml` salen de una sola URL del sitio y una sola lista de páginas.

## Capturas

<p>
  <img src=".github/assets/screenshot-toldos.jpg" alt="Sección especializada en máquinas de coser toldos automatizadas en escritorio" width="68%">
  <img src=".github/assets/screenshot-mobile.jpg" alt="Página de inicio en un móvil" width="28%">
</p>

## Tecnologías

Astro 7 · TypeScript · CSS Modules · Vitest 5 · Playwright y axe · Lighthouse CI · ESLint · Prettier · husky y lint-staged · GitHub Actions · Dependabot · Vercel

## Controles de calidad

Cada pull request y cada push a `main` ejecuta tres trabajos de CI:

| Trabajo                         | Qué comprueba                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Lint, pruebas unitarias y build | Formato con Prettier, ESLint, pruebas de datos, lógica, componentes y páginas, y el build con comprobación de tipos     |
| Pruebas en navegador            | Playwright en móvil (Pixel 7) y escritorio: auditorías de axe, navegación, presupuesto de JavaScript y CSP              |
| Presupuestos de Lighthouse      | Falla si la accesibilidad baja de 95, el SEO de 90 o el CLS supera 0,1; avisa sobre rendimiento, buenas prácticas y LCP |

La rama main está protegida: todo cambio entra mediante un pull request, y solo si los tres trabajos pasan.

Un hook de pre-commit formatea y revisa los archivos preparados, y Dependabot propone actualizaciones de npm cada semana y de GitHub Actions cada mes.

## Empezar

Requiere Node.js 24 (fijado en `.nvmrc`; con nvm, ejecuta `nvm use`).

```sh
npm ci
npm run dev          # http://localhost:4321
```

## Scripts

| Comando            | Qué hace                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo con recarga en caliente                                                            |
| `npm run build`    | Comprueba los tipos (`astro check`) y genera el sitio estático en `dist/`                                 |
| `npm run preview`  | Sirve `dist/` con las mismas cabeceras de seguridad que producción                                        |
| `npm test`         | Pruebas unitarias, de componentes y de páginas (Vitest)                                                   |
| `npm run test:e2e` | Pruebas en navegador (Playwright y axe) sobre el build. La primera vez: `npx playwright install chromium` |
| `npm run lint`     | ESLint                                                                                                    |
| `npm run format`   | Formatea el código con Prettier (`format:check` solo comprueba)                                           |

## Cómo está organizado

```
src/
  data/             # todos los textos y datos del negocio (editar aquí)
    company.ts      #   nombre, teléfono, cobertura
    contact.ts      #   teléfono y enlace de WhatsApp
    home.ts         #   textos de cada sección de la página de inicio
    sections.ts     #   ids de sección y menú
    legal.ts        #   aviso legal, privacidad y datos del titular
    seo.ts          #   URL del sitio, datos estructurados
    pages.ts        #   cada página: título, descripción, indexación
  pages/            # un archivo por URL, más robots.txt y sitemap.xml
  layouts/          # <head> y plantilla de las páginas legales
  components/       # un componente por sección (.astro + .module.css)
  lib/              # funciones puras y probadas, y el script del menú
  assets/           # imágenes optimizadas en el build
  styles/           # tokens de diseño y estilos globales
  test/             # pruebas de páginas y helper de render
e2e/                # pruebas en navegador, una por caso de uso (UC-xx)
```

### Cambios habituales

- **Textos, teléfono o marcas:** edita `src/data/`.
- **Una página nueva:** añade un archivo en `src/pages/` y su entrada en `src/data/pages.ts`. El sitemap la incluye salvo que esté marcada como `noindex`.
- **Un dominio propio:** define la variable de entorno `SITE_URL` en Vercel (o en un `.env.local`). Por defecto vale `https://tecnitextil.vercel.app`.

## Despliegue

Vercel construye con `npm run build` y publica `dist/` con URLs limpias, cabeceras de seguridad y caché de archivos (ver `vercel.json`). Node.js se fija en `24.x` mediante `engines`.

Como la Content-Security-Policy solo permite recursos del propio dominio, la barra de vistas previas de Vercel (que se carga desde `vercel.live`) está desactivada a propósito con la variable de entorno `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` en el proyecto de Vercel.
