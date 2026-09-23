# TECNITEXTIL

Web en producción de una empresa española de reparación, mantenimiento y venta de máquinas de coser industriales. Su único objetivo es que cada visita termine en una conversación de WhatsApp o en una llamada.

**[Ver la web](https://tecnitextil.vercel.app)** · [Read in English](README.md)

[![checks](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml/badge.svg)](https://github.com/SMarinC/Tecnitextil/actions/workflows/checks.yml)

![Página de inicio de TECNITEXTIL en escritorio](.github/assets/screenshot-desktop.jpg)

## Puntos destacados

- **HTML estático, JavaScript solo donde hace falta.** Astro genera cada página en el build; los únicos scripts del navegador son el del menú del header y el de Web Analytics, unos 3 kB por página. Una prueba en navegador falla si una página descarga más de 15 kB de JavaScript propio.
- **Páginas, no un scroll interminable.** Inicio, servicio técnico, toldos y el catálogo son páginas independientes enlazadas desde un menú que marca la página actual en el HTML (`aria-current="page"`), comprobado en las pruebas en navegador.
- **Un catálogo de máquinas tipado.** Las máquinas viven en una colección de contenido validada por un esquema Zod en el build. Cada página de máquina tiene exactamente una consulta de WhatsApp que nombra el modelo, y ninguna página muestra un precio, una decisión de negocio comprobada por una prueba que busca `€`, `EUR` e `IVA`.
- **Conversión medida en el plan gratuito.** Los clics en WhatsApp se cuentan como visitas virtuales a `/contactar/...` en Vercel Web Analytics, que no tiene eventos personalizados en el plan gratuito. Los enlaces siguen siendo anclas directas a `wa.me` para que el propio toque abra la app de WhatsApp en iOS.
- **Accesibilidad probada en tres navegadores.** Playwright ejecuta axe en todas las páginas en Pixel 7 (Chromium), iPhone 15 (WebKit) y escritorio Chrome, y falla si encuentra problemas graves o críticos.
- **Tokens de diseño.** Colores compartidos y una escala dorada de "líneas" (`--line-subtle` a `--line-control`) cuyo paso más fuerte mantiene un contraste medido de al menos 3:1 para los bordes interactivos, además de estilos de hero y tarjetas compartidos entre páginas.
- **Cabeceras de seguridad estrictas.** Una Content-Security-Policy que solo permite el propio dominio, más las cabeceras de refuerzo habituales, fijadas una sola vez en `vercel.json`; una prueba en navegador comprueba cada cabecera, con su valor exacto, en todas las páginas, y otra falla si alguna página registra una violación de CSP.
- **SEO desde una única fuente.** URLs canónicas, etiquetas Open Graph, datos estructurados `LocalBusiness` y `BreadcrumbList`, `sitemap.xml`, noindex en las páginas legales y una página 404 de marca salen de una sola URL del sitio y una sola lista de páginas.

## Capturas

<p>
  <img src=".github/assets/screenshot-catalogue.jpg" alt="Página del catálogo de máquinas en escritorio, agrupado por tipo" width="48%">
  <img src=".github/assets/screenshot-machine.jpg" alt="Página de una máquina en escritorio, con su consulta de WhatsApp y las migas de pan" width="48%">
</p>
<p>
  <img src=".github/assets/screenshot-mobile.jpg" alt="Página de una máquina en un móvil" width="28%">
</p>

## Tecnologías

Astro 7 · TypeScript · CSS Modules · Vitest 5 · Playwright y axe · Lighthouse CI · ESLint · Prettier · husky y lint-staged · GitHub Actions · Dependabot · Vercel

## Controles de calidad

Cada pull request y cada push a `main` ejecuta tres trabajos de CI:

| Trabajo                         | Qué comprueba                                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint, pruebas unitarias y build | Formato con Prettier, ESLint, 161 pruebas unitarias/de componentes/de páginas (Vitest), y el build con comprobación de tipos                  |
| Pruebas en navegador            | Playwright + axe en Pixel 7 (Chromium), iPhone 15 (WebKit) y escritorio Chrome: accesibilidad, navegación, presupuesto de JavaScript y CSP    |
| Presupuestos de Lighthouse      | Falla si la accesibilidad baja de 0,95, o el rendimiento, las buenas prácticas o el SEO bajan de 0,9, o el CLS supera 0,1; avisa sobre el LCP |

La rama `main` está protegida: todo cambio entra mediante un pull request, y solo se fusiona cuando los tres trabajos están en verde. CodeQL analiza cada push en busca de vulnerabilidades (marcó el helper de eliminación de etiquetas que usan las propias pruebas de este repositorio), el secret scanning de GitHub vigila que no se suban credenciales, y Dependabot propone actualizaciones de npm cada semana y de GitHub Actions cada mes.

## En cifras

A fecha de 2026-09-23, medido en CI:

- 20 páginas generadas; 161 pruebas unitarias/de componentes/de páginas (Vitest) y 114 pruebas en navegador en 3 proyectos (109 se ejecutan, 5 se omiten con motivo)
- Lighthouse: rendimiento 0,97–1,00, accesibilidad 1,00, SEO 1,00 en toda página indexable, buenas prácticas 0,96 en todas partes (el propio script de Vercel Analytics devuelve 404 fuera de Vercel y registra un error en consola)
- LCP de 1,6–2,6 s en CI, peso de página de 165–390 KB incluyendo fuentes e imágenes
- Unos 3 kB de JavaScript propio del sitio por página, muy por debajo del presupuesto de 15 kB que exige el CI
- 17 URLs en el sitemap (inicio, servicio técnico, toldos, catálogo y 13 máquinas); las páginas legales y la 404 son noindex
- Los clics en WhatsApp se registran como visitas virtuales a `/contactar/...`, verificado en producción

## Decisiones de arquitectura

- **Astro estático en vez de Next.js** — el contenido es texto de marketing fijo más un catálogo pequeño, así que basta un generador en build time que no envía JS de cliente por defecto — contrapartida: sin renderizado en servidor si la web algún día necesita personalización por visitante.
- **Una colección de contenido para el catálogo** — cada máquina es un archivo Markdown tipado, validado contra un esquema Zod en el build, así que una entrada incorrecta rompe el build en vez de publicarse — contrapartida: añadir una máquina requiere un pull request, no un formulario de CMS.
- **Sin JSON-LD de `Product` sin precio** — Google trata como inválido un listado `Product` sin precio, y los precios nunca se publican por decisión de negocio — contrapartida: las páginas de máquina solo llevan datos estructurados `BreadcrumbList`, sin resultados enriquecidos de producto.
- **CSP `'self'` y nada en línea** — una política que solo permite el propio dominio bloquea las etiquetas `<script>`/`<style>` inyectadas de las que depende la mayoría de XSS — contrapartida: cualquier recurso, incluido Vercel Analytics, debe alojarse en el propio dominio, y el `assetsInlineLimit` de Astro se fuerza a 0.
- **Clics como visitas virtuales, no eventos personalizados ni una página puente** — el plan gratuito de analítica no tiene eventos personalizados, y una página puente retrasaría el toque lo suficiente para romper el enlace universal de iOS a `wa.me` — contrapartida: la actividad de contacto aparece como visitas bajo `/contactar/...`, no como eventos dedicados.
- **Analítica mediante `inject()`** — `build.format: 'file'` hace que `Astro.url.pathname` conserve el nombre del archivo generado (`/index.html`), que es justo lo que lee el componente de `@vercel/analytics/astro`; `inject()` lee en su lugar `location.pathname` en tiempo de ejecución, siempre la URL limpia — contrapartida: una llamada manual en vez de un componente listo para usar.
- **Las páginas legales son noindex** — el aviso legal y la política de privacidad llevan el NIF y el domicilio del titular, exigidos por la ley española pero que no conviene exponer en los resultados de búsqueda — contrapartida: esas dos páginas no reciben tráfico orgánico alguno.
- **La API de Container aislada en `src/test/render.ts`** — `experimental_AstroContainer` de Astro sigue siendo experimental y es la única forma de renderizar componentes `.astro` en Vitest; mantener cada llamada detrás de un único helper limita lo que se rompe si la API cambia — contrapartida: una indirección extra para lo que, si no, sería una sola función.
- **Precarga de fuentes mantenida pese a la doble descarga en WebKit** — precargar mejora de forma medible el LCP, y Android, la mayor parte del tráfico, descarga cada fuente una sola vez; la petición separada CORS/no-cors de WebKit descarga la misma fuente dos veces — contrapartida: quienes visitan desde iPhone pagan una descarga de fuente duplicada.

## Empezar

Requiere Node.js 24 (fijado en `.nvmrc`; con nvm, ejecuta `nvm use`).

```sh
npm ci
npm run dev          # http://localhost:4321
```

## Scripts

| Comando            | Qué hace                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo con recarga en caliente                                                                   |
| `npm run build`    | Comprueba los tipos (`astro check`) y genera el sitio estático en `dist/`                                        |
| `npm run preview`  | Sirve `dist/` con las mismas cabeceras de seguridad que producción                                               |
| `npm test`         | Pruebas unitarias, de componentes y de páginas (Vitest)                                                          |
| `npm run test:e2e` | Pruebas en navegador (Playwright y axe) sobre el build. La primera vez: `npx playwright install chromium webkit` |
| `npm run lint`     | ESLint                                                                                                           |
| `npm run format`   | Formatea el código con Prettier (`format:check` solo comprueba)                                                  |

## Cómo está organizado

```
src/
  data/             # todos los textos y datos del negocio (editar aquí)
    company.ts           #   nombre, teléfono, cobertura
    contact.ts           #   teléfono y enlace de WhatsApp
    site.ts              #   textos de WhatsApp, CTA de cierre y footer, comunes a toda página
    home.ts              #   textos de la página de inicio: hero, tarjetas y valores
    technicalService.ts  #   textos de la página de servicio técnico
    awnings.ts            #   textos de la página de toldos
    catalog.ts            #   textos y etiquetas del catálogo
    types.ts              #   formas de contenido compartidas entre los módulos de datos
    navigation.ts         #   menú y el id de anclaje del bloque de contacto
    legal.ts              #   aviso legal, privacidad y datos del titular
    seo.ts                #   URL del sitio, datos estructurados
    pages.ts              #   cada página: título, descripción, indexación
  content/          # máquinas en venta: una carpeta por modelo (index.md + fotos)
  pages/            # un archivo por URL, más robots.txt y sitemap.xml
  layouts/          # <head>, marco de las páginas públicas y plantilla de las legales
  components/       # un componente por sección (.astro + .module.css)
  lib/              # funciones puras y probadas, y el script del menú
  assets/           # imágenes optimizadas en el build
  styles/           # tokens de diseño y estilos globales
  test/             # pruebas de páginas y helper de render
e2e/                # pruebas en navegador, un archivo por área (accessibility,
                    # architecture, catalogue, contact, navigation, SEO) más support.ts
```

### Cambios habituales

- **Textos, teléfono o marcas:** edita `src/data/`.
- **Una página nueva:** añade un archivo en `src/pages/` y su entrada en `src/data/pages.ts`. El sitemap la incluye salvo que esté marcada como `noindex`. Una página pública además usa `SiteLayout`, recibe una entrada en `src/data/navigation.ts` si pertenece al menú, y se añade a `PAGES` en `e2e/support.ts`.
- **Un dominio propio:** define la variable de entorno `SITE_URL` en Vercel (o en un `.env.local`). Por defecto vale `https://tecnitextil.vercel.app`.
- **Una máquina en venta:** añade una carpeta `src/content/maquinas/<modelo-en-minúsculas>/` con `index.md` y hasta 4 fotos; el esquema de `src/content.config.ts` la valida en el build. Nunca se publican precios.

## Despliegue

Vercel construye con `npm run build` y publica `dist/` con URLs limpias, cabeceras de seguridad y caché de archivos (ver `vercel.json`). Node.js se fija en `24.x` mediante `engines`. Cualquier ruta no reconocida cae en `dist/404.html`, que Vercel sirve como la página 404 de marca con estado 404.

Como la Content-Security-Policy solo permite recursos del propio dominio, la barra de vistas previas de Vercel (que se carga desde `vercel.live`) está desactivada a propósito con la variable de entorno `VERCEL_PREVIEW_FEEDBACK_ENABLED=0` en el proyecto de Vercel.

## Licencia

Todos los derechos reservados. Publicado como pieza de portafolio con el consentimiento del cliente; el código, el contenido y la marca no pueden reutilizarse sin permiso.
