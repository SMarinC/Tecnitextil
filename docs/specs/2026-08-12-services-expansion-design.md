# TECNITEXTIL — Proceso de mantenimiento y Tipos de máquina

Status: Approved
Date: 2026-08-12

## 1. Objetivo

Ampliar el detalle de "Qué hacemos" con el proceso de reparación/mantenimiento,
y agregar una sección nueva "Tipos de máquina" que liste las categorías de
equipo que se atienden. Contenido inspirado en la estructura de
`https://confemac.es/reparacion-de-maquinaria-textil-industrial/` (competidor),
pero parafraseado — ninguna oración se copia textual del sitio de referencia.

## 2. Alcance

- Dentro de `Services` ("Qué hacemos"), debajo de las 3 tarjetas existentes:
  un bloque nuevo (h3 + intro + 5 pasos en círculos numerados) explicando el
  proceso de reparación/mantenimiento. No es una sección nueva ni tiene anchor
  propio — sigue siendo parte de `#que-hacemos`.
- Sección nueva `MachineTypes` ("Tipos de máquina"), independiente, con su
  propio anchor y su propio ítem en el nav (desktop + mobile). Se ubica en la
  página inmediatamente después de `Services` y antes de `ValueProps`.
- Nav actualizado: pasa de 4 a 5 ítems.
- **Fix de breakpoint del nav** (ver §6) — necesario para que el 5º ítem no
  rompa el layout del header.

## 3. Contenido final (aprobado)

### 3.1 Bloque "proceso" dentro de `Services`

Encabezado (h3): **¿Cómo es el proceso de reparación y mantenimiento?**

Intro: "Un servicio adaptado a las necesidades de cada cliente, en el que
revisamos y prevenimos averías en maquinaria de producción, corte, tapicería
y confección."

5 pasos (círculos numerados, mismo componente visual que `HowItWorks`):

| # | Título | Descripción |
|---|--------|-------------|
| 1 | Diagnóstico | Evaluamos el estado general del equipo y detectamos qué está afectando su funcionamiento. |
| 2 | Ajuste de máquinas | Ajustamos la maquinaria de costura, corte y equipos auxiliares del taller. |
| 3 | Revisión mecánica | Revisamos los componentes mecánicos que se desgastan con el uso intensivo. |
| 4 | Limpieza y sistemas auxiliares | Revisamos y limpiamos los sistemas auxiliares y las zonas que suelen acumular suciedad y provocar fallos. |
| 5 | Prueba final | Comprobamos el resultado con el material de trabajo, verificando fuerza y precisión. |

(Los pasos 4 y 5 de la fuente original — "Limpieza técnica" y "Vacío y
sistemas auxiliares" — se fusionaron en uno solo, ambos eran en el fondo
revisión de sistemas de soporte.)

### 3.2 Sección nueva "Tipos de máquina"

Encabezado (h2): **Tipos de máquina**

Intro: "Trabajamos con equipos de corte, confección, tapicería y acabados —
cada uno con un ajuste distinto según el material y el ritmo de trabajo."

Lista de 3 (sin tarjeta, ícono + título + descripción directo sobre el fondo):

| Ícono | Título | Descripción |
|---|--------|-------------|
| `SewingMachineIcon` (reutilizado) | Costura industrial | Máquinas planas, de triple arrastre, remalladoras, recubridoras y otros equipos de confección que necesitan estar siempre a punto. |
| `ScissorsIcon` (nuevo) | Corte textil | Distintos tipos de cortadoras para materias primas. |
| `GearIcon` (nuevo) | Equipos auxiliares | Cortadoras automáticas, mesas de aspiración, entre otros complementos de tu proceso. |

## 4. Mapeo de secciones a IDs (actualizado)

| Componente     | Título visible    | id                 | Link en el nav |
|----------------|--------------------|--------------------|-----------------|
| `Hero`         | Quiénes somos      | `quienes-somos`    | No |
| `Services`     | Qué hacemos        | `que-hacemos`       | Sí |
| `MachineTypes` | Tipos de máquina   | `tipos-de-maquina`  | Sí (nuevo) |
| `ValueProps`   | Por qué elegirnos  | `por-que-elegirnos` | Sí |
| `HowItWorks`   | Cómo funciona      | `como-funciona`     | Sí |
| `FinalCta`     | (CTA final)        | `contacto`          | Sí, "Contáctanos" |

`NAV_ITEMS` en `Header.jsx` gana un elemento en la 2ª posición:
`{ label: 'Tipos de máquina', href: '#tipos-de-maquina' }`. El resto de la
lógica de nav (IntersectionObserver, scroll, cierre de menú mobile) ya es
genérica sobre `NAV_ITEMS` — no requiere cambios.

## 5. Arquitectura de componentes

```
src/components/Services/
  Services.jsx           # + bloque de proceso (h3, intro, <ol> de 5 pasos)
  Services.module.css    # + estilos del bloque de proceso (mismo patrón
                          #   .step/.number/.stepTitle/.stepDescription que
                          #   HowItWorks.module.css, reimplementado aquí —
                          #   no se extrae a componente compartido, mismo
                          #   criterio de "una responsabilidad por carpeta"
                          #   ya usado en el resto del proyecto)

src/components/MachineTypes/     # NUEVO
  MachineTypes.jsx        # sección independiente, id="tipos-de-maquina",
                           # MACHINE_TYPES como arreglo de datos (mismo
                           # patrón que SERVICES/VALUE_PROPS/STEPS)
  MachineTypes.module.css # fondo var(--color-black) full-bleed (mismo
                           # patrón outer+inner que ValueProps/Services),
                           # lista de 3 sin tarjeta (ícono + título + texto)

src/components/icons/
  Icons.jsx                # + ScissorsIcon, GearIcon (mismo estilo SVG:
                            # viewBox 24x24, stroke currentColor, strokeWidth
                            # 1.5, aria-hidden)
  Icons.test.jsx            # + registro de los 2 íconos nuevos

src/components/Header/
  Header.jsx                # + ítem en NAV_ITEMS; breakpoint de
                             # DESKTOP_BREAKPOINT_QUERY sube a 960px (§6)
  Header.module.css         # @media (min-width: 768px) → 960px (§6)

src/App.jsx                 # <MachineTypes /> insertado entre <Services />
                             # y <ValueProps />
```

Color de fondo de `MachineTypes`: `var(--color-black)` (igual que
`ValueProps`), no `var(--color-black-soft)`. `Services` ya usa
`--color-black-soft`; si `MachineTypes` usara el mismo tono, quedarían dos
secciones seguidas idénticas justo donde termina el bloque de 5 pasos y
empieza esta sección — el negro puro marca un quiebre visual claro ahí.

## 6. Riesgo técnico verificado: desborde del header con 5 ítems

Medido en el navegador (inyectando un 5º link de prueba con el texto real
"Tipos de máquina" en `http://localhost:5173`, viewport 768-1000px):

| Ancho viewport | Ancho de contenido necesario | Resultado sin fix |
|---|---|---|
| 768px | 899px | Desborde de 131px — el botón de WhatsApp queda **fuera de la pantalla, invisible** |
| 800px | 899px | Desborde de 99px — mismo problema |
| 850px | 899px | Desborde de 49px — botón parcialmente cortado |
| 900px | 900px | Ajusta justo, sin margen |

**Fix:** subir el breakpoint que alterna entre nav de escritorio y menú
hamburguesa de `768px` a `960px` (margen sobre los ~900px medidos), en dos
lugares que deben mantenerse sincronizados:

- `Header.module.css`: `@media (min-width: 768px)` → `@media (min-width: 960px)`
  (afecta a `.nav`, `.menuToggle`, `.mobileNav`).
- `Header.jsx`: `DESKTOP_BREAKPOINT_QUERY = '(min-width: 768px)'` →
  `'(min-width: 960px)'`.

Efecto colateral aceptado: viewports de 768-959px (tablets en horizontal,
laptops pequeños) verán el menú hamburguesa en vez del nav horizontal — ya
verificado que el hamburguesa no tiene límite de ítems. `Services`,
`ValueProps`, `HowItWorks`, etc. usan `@media (min-width: 768px)` para sus
propios grids de columnas — esos NO cambian, solo el breakpoint del nav.

## 7. Estilos del bloque "proceso" (dentro de Services)

- Reutiliza el mismo patrón visual de `HowItWorks`: círculo con número en
  `var(--color-gold)` de fondo y `var(--color-black)` de texto, título en
  `var(--color-white)`, descripción en `var(--color-text-on-dark-secondary)`.
- Grid de 1 columna en mobile, 3 columnas en `≥768px` (con el 5º paso
  ocupando una celda extra en una fila más corta) — mismo breakpoint que ya
  usa `Services` para su propio grid de 3 tarjetas.

## 8. Estilos de "Tipos de máquina"

- Sección full-bleed (`background: var(--color-black)`), contenido interno
  limitado por `--max-width` (mismo patrón `outer` + `.inner` que `Services`
  y `ValueProps`).
- Lista de 3, sin caja/tarjeta: ícono dorado arriba, título en
  `var(--color-white)`, descripción en `var(--color-text-on-dark-secondary)`.
  1 columna en mobile, 3 en `≥768px`.

## 9. Verificación

- `npm run test` (icon tests actualizados con los 2 íconos nuevos) y
  `npm run build`.
- Manual en `npm run dev`: nav de 5 ítems visible completo sin desbordar en
  1120px, 960px (límite del fix) y que el hamburguesa aparece correctamente
  en 768-959px con el WhatsApp CTA siempre visible; scroll a
  `#tipos-de-maquina` no queda tapado por el header; resaltado de sección
  activa funciona para el nuevo ítem igual que para los demás.

## 10. Fuera de alcance (explícito)

- No se toca la sección `HowItWorks` ("Cómo funciona") ni su propio bloque de
  3 pasos — se mantiene tal cual, aunque comparta el mismo componente visual
  de círculos numerados.
- No se copia texto textual del sitio de referencia — todo el contenido de
  §3 es parafraseado.
- No se agregan más bloques del competidor (antes/después, marcas
  compatibles, testimonios, FAQ, formulario) — fuera del alcance de este
  cambio.
