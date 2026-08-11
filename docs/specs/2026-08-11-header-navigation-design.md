# TECNITEXTIL — Menú de navegación en el Header

Status: Approved
Date: 2026-08-11

## 1. Objetivo

Agregar un menú de navegación funcional al `Header` existente para que el
usuario pueda saltar, con scroll suave, a las secciones de la landing
(single-page). No se crean rutas ni páginas nuevas — todo sigue siendo
navegación por anclas dentro de la misma página.

## 2. Alcance

- Nav horizontal en desktop, entre el logo y el botón de WhatsApp.
- Colapso a menú hamburguesa en mobile, con panel desplegable a todo el ancho
  debajo del header (empuja el contenido, sin overlay). El botón de WhatsApp
  permanece siempre visible fuera del menú colapsado.
- Scroll suave con offset para que el header sticky no tape el título de la
  sección destino.
- Indicador de sección activa mientras el usuario hace scroll.
- No se modifica contenido, copy ni orden de las secciones existentes.

## 3. Mapeo de secciones a IDs

| Componente   | Título visible      | id                  | Link en el nav |
|--------------|----------------------|---------------------|-----------------|
| `Hero`       | Quiénes somos        | `quienes-somos`     | No (es el tope de la página) |
| `Services`   | Qué hacemos           | `que-hacemos`        | Sí |
| `ValueProps` | Por qué elegirnos     | `por-que-elegirnos`  | Sí |
| `HowItWorks` | Cómo funciona         | `como-funciona`      | Sí |
| `FinalCta`   | (CTA final / contacto)| `contacto`           | Sí, "Contáctanos" |

IDs sin acentos (URL-safe), consistente con los anchors ya definidos por el
usuario en los requisitos.

## 4. Arquitectura de componentes

Todo vive dentro de `Header.jsx` / `Header.module.css` — no se crea un
componente `Nav` aparte, porque el menú no se reutiliza en ningún otro lugar
(evita abstracción prematura, mismo criterio que el resto del proyecto donde
cada carpeta de componente tiene una responsabilidad clara).

```
src/components/Header/
  Header.jsx          # agrega <nav>, botón hamburguesa, panel mobile,
                       # lista NAV_ITEMS, estado de menú abierto/cerrado,
                       # IntersectionObserver para sección activa
  Header.module.css   # estilos de nav, estados hover/activo, breakpoint,
                       # panel mobile
src/components/icons/
  Icons.jsx           # + MenuIcon, CloseIcon (mismo estilo SVG que los
                       # íconos existentes: viewBox 24x24, stroke currentColor)
src/styles/
  tokens.css           # + --header-offset (fuente única de verdad para el
                       # scroll-margin-top de todas las secciones)
```

`NAV_ITEMS` como arreglo de datos (`{ label, href }`), siguiendo el mismo
patrón que `SERVICES`, `VALUE_PROPS` y `STEPS` en sus respectivos componentes.

## 5. Mecánica de scroll y offset

- Cada sección (`Hero`, `Services`, `ValueProps`, `HowItWorks`, `FinalCta`)
  recibe `scroll-margin-top: var(--header-offset)` en la clase de su
  `<section>` raíz, en su propio `.module.css`.
- El click en un link del nav hace `preventDefault()` y
  `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` — la
  lógica vive en el manejador de click (evento de interacción), no en un
  `useEffect`, siguiendo la práctica de mantener la lógica de interacción en
  el event handler.
- El mismo manejador cierra el panel mobile si estaba abierto.

## 6. Indicador de sección activa

- Un único `IntersectionObserver` (no listener de `scroll`) observa las 4
  secciones con link en el nav.
- `rootMargin` compensa el alto del header para que la sección se marque
  activa apenas su título queda visible debajo del header, no cuando ya está
  a mitad de pantalla.
- El observer se crea una sola vez (`useEffect` con deps vacías) y se
  desconecta (`disconnect()`) en el cleanup — sin registrar/desregistrar
  listeners en cada render.
- El estado de "sección activa" es un solo string (el id activo), actualizado
  con `setState` funcional para evitar closures obsoletos.

## 7. Estilos

- **Desktop (≥768px)** — mismo breakpoint que `Services`/`ValueProps`/
  `HowItWorks`, para que el nav (4 textos) tenga espacio suficiente. Nav
  visible en línea; hamburguesa oculta.
  - Links en mayúsculas, `letter-spacing`, `font-family: var(--font-heading)`
    para que combinen con los títulos de sección.
  - Color base `var(--color-text-on-dark)`; hover y estado activo en
    `var(--color-gold)` con un subrayado inferior sutil (`border-bottom` o
    `box-shadow` de 2px) en el link activo.
- **Mobile (<768px)** — nav horizontal oculto; aparece el botón hamburguesa
  junto al botón de WhatsApp (que sigue mostrándose, no se oculta dentro del
  menú). Al togglear, un panel a todo el ancho se despliega debajo del header
  con los 4 links en columna, mismo estilo de color/hover que desktop.
- Toggle de mostrar/ocultar con renderizado condicional simple (ternario), sin
  librerías de animación externas — consistente con el resto del proyecto
  (sin dependencias de UI).

## 8. Accesibilidad

- Botón hamburguesa: `aria-expanded` según estado, `aria-controls` apuntando
  al panel, `aria-label` descriptivo (ej. "Abrir menú de navegación").
- Links de nav con área táctil ≥44px en mobile (mismo criterio ya aplicado a
  los CTAs existentes).
- El link activo se marca visualmente pero no depende únicamente del color
  (se refuerza con el subrayado) para no depender solo de contraste de color.

## 9. Verificación

- Manual (no hay tests automatizados en el proyecto — no aplica a un sitio
  estático): `npm run dev`, revisar en desktop que cada link scrollea a la
  sección correcta sin que el header tape el título, que el link activo
  cambia al hacer scroll manual, y en mobile que el hamburguesa abre/cierra el
  panel, que el WhatsApp sigue visible, y que tocar un link cierra el panel y
  scrollea correctamente.

## 10. Fuera de alcance (explícito)

- No se crean rutas nuevas ni se usa un router — sigue siendo single-page.
- No se modifica el contenido, copy ni orden de las secciones existentes.
- No se agregan librerías externas de UI/animación para el menú.
