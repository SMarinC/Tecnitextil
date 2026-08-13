# Pendientes de revisión de diseño — 2026-08-13

Documento consolidado para revisar cuando vuelvas. Junta dos cosas: (1) la crítica completa de diseño que se hizo hoy con la skill `impeccable` (revisión de estructura/organización/storytelling), y (2) los ítems que ya habían quedado marcados como "decisión tuya, no la tomo yo" en las specs de ayer/hoy, sin resolver todavía.

**Nada de esto se implementó.** Es solo el registro de hallazgos para que decidas qué atacar y en qué orden.

> Nota: este archivo vive en `public/`, que Vite sirve tal cual al desplegar — si no quieres que quede accesible por URL en producción, muévelo fuera de `public/` o bórralo antes de publicar el sitio.

---

## 1. Crítica de diseño (impeccable `critique`, dual-agent)

**Snapshot completo guardado en:** `.impeccable/critique/2026-08-13T05-50-34Z__src-app-jsx.md`

### Puntaje: 20/32 (62.5%) — Aceptable

| # | Heurística | Score | Problema clave |
|---|-----------|-------|-----------|
| 1 | Visibilidad del estado del sistema | 3 | Nav activo bien construido; sin feedback al abrir WhatsApp |
| 2 | Correspondencia con el mundo real | 3 | Jerga correcta, mezcla B2B/individual sin distinguir |
| 3 | Control y libertad del usuario | 3 | Sin trampas |
| 4 | Consistencia y estándares | 2 | 4 tratamientos visuales distintos para el mismo CTA de WhatsApp |
| 5 | Prevención de errores | 3 | Enlaces externos correctos |
| 6 | Reconocer en vez de recordar | 2 | Nav omite Hero y Marcas (2 de 8 secciones) |
| 7 | Flexibilidad y eficiencia | n/a | No aplica (landing de marketing) |
| 8 | Diseño estético y minimalista | 2 | Misma tarjeta ícono+título+descripción repetida 4 veces; cero fotografía |
| 9 | Recuperación de errores | 2 | Sin respaldo si wa.me falla; teléfono enterrado sin estilo de botón |
| 10 | Ayuda y documentación | n/a | No aplica |

### Veredicto de especificidad: bajo-moderado

Plantilla genérica de "negocio de reparación local" con copy del rubro textil encima. Mismo patrón de tarjeta repetido 4 veces (Services cards, MachineTypes items, HowItWorks steps, proceso de 5 pasos), íconos genéricos, cero fotografía, marcas como texto plano. El archivo podría reskinearse para una cerrajería o servicio de calderas cambiando 3 arrays de datos y nada estructural. Lo único genuinamente específico es el copy (vocabulario técnico real, marcas bien escritas).

### Lo que funciona

1. `IntersectionObserver` de sección activa en `Header.jsx` — ingeniería cuidada, poco común en landings de este tamaño.
2. Accesibilidad sólida — cero fallas de contraste (mínimo 8.25:1), alt text correcto, tap targets todos ≥44px.
3. Copy con investigación real del rubro.

### Problemas prioritarios

**[P0] Dos narrativas de "proceso" compitiendo.**
El proceso técnico de 5 pasos en Services (Diagnóstico → Ajuste → Revisión → Limpieza → Prueba final) y el recorrido de 3 pasos de HowItWorks (Escríbenos → Recogemos → Reparamos) usan el mismo lenguaje visual (círculo dorado + número) para dos conceptos distintos, separados por 4 secciones. Además, la tarjeta "Asesoría técnica" de Services y el primer paso del proceso ("Diagnóstico") dicen casi lo mismo a pocas líneas de distancia — ver también §2 abajo, este mismo problema ya se había detectado ayer y quedó sin resolver.
*Decisión pendiente:* ¿eliminar el proceso técnico de 5 pasos, colapsarlo en un detalle secundario/expandible, o dejarlo?

**[P1] Página como plantilla reskineable, no identidad autoral.**
Sin fotografía real, sin logos de marca reales, un solo vocabulario de íconos reciclado. Fix sin depender de fotos nuevas: diferenciar visualmente las 4 secciones que hoy comparten la misma tarjeta, resolver que las pills de marca y los círculos de proceso usan la misma forma (`border-radius: full`) para dos significados distintos. Fix completo: fotografía real del taller/técnico/máquinas en Hero y FinalCta, logos reales de marca (con derecho de uso) en vez de texto plano.
*Decisión pendiente:* ¿hasta dónde llegar sin fotos, o esperamos a que consigas material real?

**[P1] Nav incompleto.**
`NAV_ITEMS` en `Header.jsx` solo expone 5 de 8 secciones — Hero y Marcas no tienen entrada, solo alcanzables por scroll.
*Fix sugerido:* agregar entrada de nav para Marcas (ya tiene `id="marcas"`), o fusionar su contenido en Tipos de máquina.

**[P2] Cuatro tratamientos visuales distintos para la misma acción de WhatsApp.**
Pill con ícono+texto (header), círculo solo-ícono (flotante), pill solo-texto (FinalCta), texto plano sin estilo de botón (footer).
*Fix sugerido:* un solo lenguaje visual en los 4 puntos.

**[P3] 13 marcas y 5 pasos de proceso superan el límite de ≤4 ítems por grupo sin agrupar.**
*Fix sugerido:* se resuelve solo si se atacan P0 (proceso a 3 pasos) y se agrupan las marcas por categoría.

### Red flags por persona

**Jordan (primerizo confundido):** primera acción visible es una pill pequeña en el header, fácil de perder. Sin señal de precio/tiempo en toda la página. El bloque que responde "cómo funciona" es el segundo bloque de pasos numerados que encuentra. El párrafo de Marcas ("indícanos marca, modelo, material, síntoma") es útil pero inerte — no conectado al mensaje pre-cargado de WhatsApp.

**Casey (móvil, distraído):** página móvil de ~6.000px de alto sin variación visual. El botón flotante de WhatsApp puede superponerse con el botón "Contáctanos" de FinalCta en pantallas cortas. Logo de 100×100px consume ~25% del ancho del header en 390px. Ninguna pregunta típica ("cuánto cuesta", "cuánto demora") tiene respuesta en el menú.

### Observaciones menores

- Link de teléfono en footer sin ninguna señal visual de que es clickeable.
- Gradiente del Hero impide contraste automático certero (revisión manual pendiente, no falla confirmada).
- Mensaje de WhatsApp idéntico sin importar qué CTA lo dispara.
- Tap target del `.navLink` de escritorio no confirmado ≥44px (único interactivo sin `min-height` explícito).

### Preguntas para pensar

- Si borraras el proceso técnico de 5 pasos, ¿un cliente real perdería información que necesita?
- ¿Qué dato, leído justo antes del CTA, más aumentaría la probabilidad de que te escriban — y hoy está enterrado en "Por qué elegirnos"?
- Si una foto real del taller reemplazara una sección de tarjetas genéricas, ¿la página seguiría pudiendo pertenecer a cualquier otro rubro de reparación?

---

## 2. Ítems ya flagged en specs anteriores, sin resolver (de ayer/hoy)

Estos ya se habían identificado en auditorías previas de esta misma sesión y quedaron explícitamente marcados como "decisión de negocio, no la tomo yo":

**Superposición "Asesoría técnica" / "Diagnóstico"** (`docs/specs/2026-08-12-layout-polish-and-congruence-audit-design.md` §5.3) — misma observación que el P0 de la crítica de arriba, detectada dos veces en dos pasadas distintas. Es el hallazgo con más consenso de todo el documento.

**`<title>`/meta de `index.html` siguen enfocados solo en "máquinas de coser"** (mismo spec, §5.4) — no reflejan el alcance industrial más amplio que ya tiene el resto del sitio (corte, equipos auxiliares, maquinaria industrial).

**Copy del Hero sigue enfocado solo en "máquinas de coser"** (encontrado en la revisión final de ese mismo plan, no incluido en el spec original) — "TECNITEXTIL es una empresa que lleva más de 20 años trabajando con máquinas de coser." Es defendible como historia de origen, pero es la misma clase de estrechez de alcance que ya se corrigió en otras 4 secciones del sitio.

**`Marcas.jpeg` y `whatsapp logo.jpg`** — siguen sin trackear en la raíz del proyecto. `Marcas.jpeg` ya fue evaluada y descartada (marcas registradas de terceros, no coincide con tu lista de 13 marcas, fondo blanco). Pendiente: ¿las usamos para algo, las movemos, o las borramos?

---

## Nota

El hallazgo P0 de la crítica y la superposición "Asesoría técnica"/"Diagnóstico" de la sección 2 son, en la práctica, el mismo problema detectado por dos pasadas de revisión independientes en momentos distintos — probablemente el punto de mayor consenso de todo este documento.
