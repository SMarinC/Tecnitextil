# TECNITEXTIL — Layout asimétrico (Qué hacemos / Tipos de máquina) + sección Marcas

Status: Approved (autonomous — see §0)
Date: 2026-08-12

## 0. Contexto de autoría

El usuario pidió estos cambios y delegó explícitamente las decisiones de
diseño no especificadas ("tomes las mejores decisiones... ya cuando yo
llegue depuramos y organizamos"), avisando que no respondería por un rato.
Este spec documenta las decisiones tomadas y su razonamiento para que se
puedan revisar/ajustar después. No hubo ronda de preguntas — cada decisión
below reemplaza lo que habría sido una pregunta de brainstorming.

## 1. Objetivo

Dos cambios independientes:

1. Rediseñar el layout de las 3 tarjetas de `Services` ("Qué hacemos") y los
   3 ítems de `MachineTypes` ("Tipos de máquina") a un esquema asimétrico:
   título a la izquierda, contenido a la derecha en 2 arriba + 1 abajo.
2. Agregar una sección nueva "Marcas" con el copy que el usuario redactó,
   inspirada en la sección de marcas de confemac.es pero sin copiar texto
   textual (el usuario ya escribió su propia versión) y sin usar el archivo
   de imagen de logos que compartió (ver §4).

## 2. Layout asimétrico — alcance y decisiones

**Aplica a:** el grid de 3 tarjetas dentro de `Services` (`SERVICES`), y los
3 ítems de `MachineTypes` (`MACHINE_TYPES`).

**No aplica a:** el bloque de 5 pasos dentro de `Services`
(`PROCESS_STEPS`) — el usuario ya opinó explícitamente que ese se queda
como está (numerado, centrado). Tampoco aplica a `ValueProps`,
`HowItWorks`, `FinalCta` — no fueron mencionados.

**Decisión — proporción de columnas:** título a la izquierda en `flex: 0 0
30%`, contenido a la derecha en `flex: 1`, con gap `--space-xl`. 30% da
espacio legible al título sin opacar el contenido, consistente con layouts
"sidebar + contenido" típicos.

**Decisión — arreglo del lado derecho:** grid de 2 columnas; ítems 1 y 2 en
la fila superior, ítem 3 con `grid-column: 1 / -1` (ocupa el ancho completo)
en la fila inferior — literalmente "dos arriba, uno abajo" como se pidió,
en vez de dejar el ítem 3 solo en la primera columna con un hueco vacío al
lado (se ve como un error, no como una decisión de diseño).

**Decisión — responsive:** el layout de 2 columnas (título+contenido) y el
grid 2-arriba/1-abajo SOLO se activan en `≥768px` (mismo breakpoint que ya
usa el resto de grids del sitio). Por debajo de 768px, todo se apila en una
sola columna (título arriba, luego los 3 ítems en fila, uno debajo del
otro) — igual que el comportamiento actual, sin layout nuevo que mantener
en mobile. Esto es intencional: un layout de 2 columnas con proporción 30/70
no cabe con texto legible por debajo de tablet.

**Decisión — alineación del título:** centrado en mobile (consistente con
el resto del sitio), alineado a la izquierda en `≥768px` (natural para una
columna lateral).

**Decisión — intro de `MachineTypes`:** el párrafo introductorio actual
("Trabajamos con equipos de corte...") se mueve a la columna del título, ya
que ahí es donde tiene sentido como texto de apoyo al lado del H2, en vez de
quedar centrado sobre el grid como hoy.

## 3. Estructura de componentes (layout asimétrico)

```
src/components/Services/
  Services.jsx           # SERVICES envuelto en .layout > .titleCol (h2) +
                          # .itemsCol (.grid con las 3 cards) — PROCESS_STEPS
                          # sin cambios, sigue debajo de .layout
  Services.module.css    # + .layout, .titleCol, .itemsCol; .grid pasa a
                          # 2 columnas en vez de 3; nth-child(3) en .card
                          # para el span completo

src/components/MachineTypes/
  MachineTypes.jsx        # MACHINE_TYPES envuelto en .layout > .titleCol
                           # (h2 + intro) + .itemsCol (.list)
  MachineTypes.module.css # mismo patrón .layout/.titleCol/.itemsCol
```

## 4. Sección nueva "Marcas"

### 4.1 Sobre la imagen compartida

El usuario adjuntó `Marcas.jpeg` (957×423, sin trackear en git) como
posible referencia visual. **Decisión: no usarla.** Razones:

- Es un collage de logos reales de 10 fabricantes distintos (Alfa, Janome,
  Husqvarna Viking, Pfaff, Sigma, AstraLux, Elna, Juki, Refrey, Singer) —
  marcas registradas de terceros. Mostrar sus logotipos oficiales implica
  una relación de distribuidor/servicio autorizado que no está confirmada.
- La lista de marcas en la imagen NO coincide con la lista de 12 marcas que
  el usuario escribió en el chat (solo 4 se repiten: Alfa, Pfaff, Juki,
  Singer) — usar ambas fuentes a la vez sería inconsistente.
- Fondo blanco sólido — repetiría exactamente el problema de contraste
  ("quema los ojos") que se corrigió hace unos commits en `Services`/
  `HowItWorks`.

**En su lugar:** las 12 marcas se muestran como texto (pills/badges), sin
logos, evitando el riesgo de marca registrada y encajando con el tema
oscuro del sitio. Si el usuario tiene autorización de esas marcas o quiere
usar logos reales más adelante, es una decisión de negocio que le
corresponde a él — se deja documentado para retomar cuando vuelva.

### 4.2 Copy (del usuario, con un recorte editorial)

Encabezado (h2): **Reparamos maquinaria industrial de distintas marcas y
generaciones**

Párrafo 1 (recortado — el original enumeraba las 12 marcas en prosa,
redundante con la lista de pills que va justo debajo; se deja la idea sin
repetir los nombres):

> Trabajamos con maquinaria industrial habitual en talleres y entornos
> textiles: máquinas de costura de las marcas más utilizadas del sector,
> además de cortadoras, mesas de vacío, remachadoras y equipos auxiliares
> de diferentes fabricantes.

Párrafo 2 (sin cambios, tal cual lo escribió el usuario):

> Si tienes dudas sobre tu equipo, indícanos marca, modelo, tipo de
> material que trabaja y síntoma principal. Esto nos ayuda a orientar mejor
> la intervención técnica.

Lista de marcas (pills, orden tal cual lo dio el usuario): Juki, Brother,
Singer, Alfa, Pfaff, Durkopp Adler, Consew, Seiko, Typical, Siruba,
Rimoldi, Pegasus, Jack.

### 4.3 Posición en la página e id

Entre `MachineTypes` y `ValueProps`: `Hero → Services → MachineTypes →
Marcas → ValueProps → HowItWorks → FinalCta → Footer`.

`id="marcas"`. **Sin entrada en el nav** (ni desktop ni hamburguesa) — el
usuario no pidió un "direccionador" para esta sección como sí pidió
explícitamente para `MachineTypes`; agregar una 6ª entrada además
requeriría re-verificar el breakpoint de 960px recién ajustado, sin que
haya sido solicitado. La sección sigue siendo alcanzable por scroll normal.

### 4.4 Fondo — resuelve el problema de ritmo visual pendiente

Fondo: `var(--color-black-soft)`. Con `Marcas` insertada, la secuencia de
tonos queda perfectamente alternada de nuevo:

| Sección | Fondo |
|---|---|
| `Hero` | gradiente oscuro |
| `Services` | `--color-black-soft` |
| `MachineTypes` | `--color-black` |
| **`Marcas`** | **`--color-black-soft`** |
| `ValueProps` | `--color-black` |
| `HowItWorks` | `--color-black-soft` |
| `FinalCta` | `--color-black` |
| `Footer` | `--color-black-soft` |

Esto vuelve innecesario el `border-bottom` dorado que se agregó a
`MachineTypes` en el commit `2e52d63` como parche para el problema de
"dos secciones negras seguidas" — ese problema ya no existe porque ahora
`MachineTypes` (negro) linda con `Marcas` (negro suave) en vez de
`ValueProps` (negro). Se retira ese `border-bottom` en este cambio.

### 4.5 Estilos

- Mismo patrón `outer` + `.inner` (max-width, padding) que el resto de
  secciones.
- Heading y párrafos centrados (esta sección no lleva el layout asimétrico
  de §2 — es contenido de ancho completo, no una lista de ítems).
- Pills: `display: inline-flex`, `padding: 0.4rem 1rem`,
  `border-radius: var(--radius-full)` (mismo token que los botones),
  `border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent)`,
  `color: var(--color-gold)`, `font-size: 0.9rem`, sin fondo sólido (no
  compiten visualmente con el CTA de WhatsApp). Contenedor con
  `display: flex; flex-wrap: wrap; justify-content: center; gap:
  var(--space-sm)`.

## 5. Verificación

- `npm run test` / `npm run build`.
- Manual en navegador: `Services` y `MachineTypes` muestran título+contenido
  en 2 columnas con 2-arriba/1-abajo en `≥768px`, apilado simple en mobile;
  sección `Marcas` visible, sin entrada de nav, fondo alternando
  correctamente con las secciones vecinas; las 12 pills de marca se ven
  legibles y hacen wrap correctamente en mobile.

## 6. Fuera de alcance

- No se usa la imagen `Marcas.jpeg` (ver §4.1) — queda sin trackear en el
  repo, decisión pendiente de negocio para cuando vuelva el usuario.
- No se agrega entrada de nav para `Marcas`.
- No se toca `PROCESS_STEPS`, `ValueProps`, `HowItWorks`, `FinalCta`.
- No se valida la relación comercial con los fabricantes listados — es una
  afirmación fáctica ("trabajamos con equipos de estas marcas"), no una
  declaración de distribuidor autorizado.
