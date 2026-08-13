# TECNITEXTIL — Divisor interno, centrado del layout asimétrico, auditoría de congruencia

Status: Approved (autonomous — see §0)
Date: 2026-08-12

## 0. Contexto de autoría

El usuario pidió estos cambios y volvió a delegar explícitamente las
decisiones no especificadas, avisando que se ausentaría de nuevo. Este spec
documenta las decisiones e interpretaciones tomadas, incluida una
ambigüedad real en el mensaje del usuario (ver §2).

## 1. Objetivo

Tres pedidos en un mismo mensaje:

1. Una línea mostaza que distinga los dos bloques dentro de "Qué hacemos"
   (tarjetas de servicio vs. proceso de 5 pasos), aunque sigan siendo la
   misma sección.
2. Centrar mejor "las dos secciones que acabas de cambiar de formato".
3. Revisar que todo el copy del sitio sea congruente entre sí.

## 2. Interpretación de "Services y Cómo funciona"

El usuario escribió: *"centra mejor las dos secciones que acabas de cambiar
de formato services y como funciona"*.

Las dos secciones cuyo formato se cambió en el trabajo anterior fueron
**`Services`** y **`MachineTypes`** ("Tipos de máquina") — `HowItWorks`
("Cómo funciona") no fue tocada. Es muy probable que "como funciona" sea un
error de tipeo por "Tipos de máquina" (mensaje escrito rápido, sin pausar a
revisar), ya que la frase dice explícitamente "las dos secciones que
**acabas de cambiar de formato**", lo cual es un hecho verificable — y ese
hecho apunta a `Services` + `MachineTypes`, no a `HowItWorks`.

**Decisión:** aplicar el centrado a `Services` y `MachineTypes`. Se revisó
`HowItWorks` por si igual necesitaba ajuste — usa el mismo patrón simple
centrado que ya tenía antes de hoy, sin layout asimétrico, y no presenta
ningún problema de alineación. No se toca. Si el usuario efectivamente se
refería a `HowItWorks` con otro sentido ("cómo funciona [se ve]", no el
nombre de la sección), lo corregimos cuando vuelva.

## 3. Divisor interno en `Services`

**Decisión:** `border-top` sutil en dorado
(`color-mix(in srgb, var(--color-gold) 20%, transparent)`, mismo mecanismo
ya usado en otros bordes del sitio) sobre `.processHeading`, con
`padding-top` para separar la línea del texto. Vive dentro de la misma
sección (mismo fondo `--color-black-soft`) — es un separador interno, no un
cambio de fondo como los que ya existen entre secciones.

## 4. Centrado del layout asimétrico

**Decisión:** cambiar `.layout { align-items: flex-start }` a
`align-items: center` en el breakpoint `≥768px`, en `Services.module.css` y
`MachineTypes.module.css`. Hoy el título queda pegado arriba mientras la
columna de ítems (más alta, con 2 filas) deja espacio vacío debajo del
título — centrarlo verticalmente contra la altura completa de la columna de
ítems da un balance visual más intencional, que es lo que "centra mejor"
describe mejor dado que ambas columnas ya están anchas correctamente
(30/70).

## 5. Auditoría de congruencia — hallazgos

Se leyó el copy completo de las 8 secciones + `index.html` (meta/título).
Dos incongruencias reales encontradas y corregidas; dos observaciones
menores documentadas sin cambiar (decisión de negocio, no defecto).

### 5.1 Corregido — `HowItWorks` paso 2 asume recogida a domicilio universal

`Cómo funciona` (paso 2, "Recogemos tu máquina") afirma sin condición que
el proceso siempre incluye recogida a domicilio. Esto entra en conflicto
con el resto del sitio, que hoy en día (después de los cambios de esta
sesión) también describe soporte a **empresas textiles** y **maquinaria
industrial** — cortadoras, mesas de vacío, equipos auxiliares
(`MachineTypes`, `Marcas`, la tarjeta "Soporte a empresas textiles" en
`Services`). Ese tipo de equipo típicamente no se "recoge" y se lleva a un
taller — se interviene en sitio. El flujo de 3 pasos, escrito
originalmente pensando solo en máquinas de coser domésticas/pequeñas, ya no
describe correctamente el proceso completo que el resto de la página
promete.

**Fix:** el paso 2 pasa a cubrir ambos casos — recogida a domicilio para
equipo doméstico/portátil, visita técnica en sitio para equipo industrial.
Nuevo texto:

> **Recogemos tu equipo o visitamos tu taller**
> Recogemos tu máquina en la puerta de tu domicilio, o coordinamos una
> visita técnica si el equipo es industrial o no se puede trasladar.

`ValueProps`' "Recogida a domicilio incluida" no necesita cambiar — sigue
siendo cierto, solo que ahora no es la única modalidad, y el nuevo texto de
`HowItWorks` ya lo deja claro.

### 5.2 Corregido — CTA final más angosto que el alcance real del sitio

`FinalCta` dice "Todo para tu máquina de coser" — encabezado singular
enfocado solo en máquinas de coser, mientras el resto de la página (después
de hoy) promete cobertura de maquinaria industrial más amplia: corte,
equipos auxiliares, múltiples marcas (`MachineTypes`, `Marcas`). El CTA
final es lo último que el visitante lee antes de escribir por WhatsApp —
debe reflejar todo lo que se le acaba de mostrar, no solo una parte.

**Fix:** encabezado cambia a **"Todo para tu maquinaria textil"** — quita
la restricción a "de coser", mantiene el tono corto y directo, coincide con
el lenguaje ya usado en `Marcas` ("Reparamos maquinaria industrial...") y
`MachineTypes`. El subtítulo ("Reparación, mantenimiento y venta...") ya
era suficientemente genérico — no cambia.

### 5.3 Observado, sin cambiar — solapamiento "Asesoría técnica" / "Diagnóstico"

La tarjeta "Asesoría técnica" en `Services` ("Diagnóstico ante fallas
comunes y cómo prevenirlas...") y el primer paso del proceso de 5 pasos
("Diagnóstico" — "Evaluamos el estado general del equipo...") cubren una
idea muy similar. No es una contradicción — son dos formas de mencionar el
mismo servicio en dos niveles de detalle distintos (resumen en tarjeta,
detalle en el proceso) — pero es una redundancia de copy que vale la pena
que el usuario revise. No se reescribe sin su confirmación porque toca
contenido que él mismo redactó/aprobó explícitamente en la conversación.

### 5.4 Observado, sin cambiar — alcance de marca en `<title>`/meta de `index.html`

El `<title>` y las meta tags siguen enfocados en "Reparación de máquinas de
coser" exclusivamente, sin mencionar el alcance industrial más amplio que
ahora tiene la página (corte, equipos auxiliares, "maquinaria industrial").
Es una decisión de SEO/posicionamiento de marca, no un defecto de
implementación — se deja para que el usuario decida si quiere ampliar el
`<title>`/meta description cuando vuelva.

## 6. Estructura de componentes

```
src/components/Services/
  Services.module.css     # + border-top en .processHeading; align-items:
                           # center en @media (768px) .layout

src/components/MachineTypes/
  MachineTypes.module.css # align-items: center en @media (768px) .layout

src/components/HowItWorks/
  HowItWorks.jsx           # paso 2: nuevo title + description

src/components/FinalCta/
  FinalCta.jsx              # heading: "Todo para tu máquina de coser" →
                             # "Todo para tu maquinaria textil"
```

## 7. Verificación

- `npm run test` / `npm run build`.
- Manual: línea mostaza visible entre tarjetas y proceso en "Qué hacemos"
  (mismo fondo a ambos lados, solo el borde cambia); título centrado
  verticalmente contra la columna de ítems en `Services` y `MachineTypes`
  en `≥768px`; `HowItWorks` y `FinalCta` muestran el copy nuevo sin romper
  el layout existente.

## 8. Fuera de alcance

- No se toca `HowItWorks` visualmente (ver §2).
- No se reescribe la superposición "Asesoría técnica"/"Diagnóstico" (§5.3).
- No se amplía `<title>`/meta de `index.html` (§5.4).
- No se rediseña nada más allá de lo pedido.
