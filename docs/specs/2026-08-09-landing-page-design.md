# TECNITEXTIL — Landing Page (Vite + React)

Status: Approved
Date: 2026-08-09

## 1. Objetivo

Landing page de una sola página cuyo único objetivo es convertir visitas en
conversaciones de WhatsApp. No hay backend ni formularios que envíen datos a
ningún servidor: todo botón de contacto abre WhatsApp (`wa.me`) con un mensaje
pre-cargado.

## 2. Contexto del negocio

- **Empresa**: TECNITEXTIL — 20+ años reparando máquinas de coser industriales
  y domésticas.
- **Servicios**: reparación de máquinas de coser · soporte a empresas del
  sector textil para mejorar tiempos de producción · recogida a domicilio.
- **Cobertura**: toda España (planes futuros de expansión a Europa — no se
  refleja en esta versión de la landing).
- **Horario**: sin horario fijo comprometido; el mensaje es "respuesta rápida
  por WhatsApp", sin prometer disponibilidad 24/7 ni un rango horario.
- **Teléfono / WhatsApp**: +34 685 01 80 86.
- **Marcas de máquinas**: no se listan marcas específicas por ahora (mensaje
  genérico "cualquier marca/modelo"); dejar fácil de añadir después.
- **Prueba social**: no hay testimonios reales todavía — no se fabrica
  contenido falso. La confianza se apoya en años de experiencia, cobertura
  nacional y claridad del proceso.
- **Logo**: `Logo.jpeg` en la raíz del proyecto — rótulo circular negro con
  ícono de máquina de coser e "TECNITEXTIL" en trazo dorado/mostaza. Define la
  paleta de marca.

## 3. Referencia de estructura (uso ligero)

Se consultó `https://confemac.es/reparacion-de-maquinaria-textil-industrial/`
como guía de flujo narrativo (problema → solución → confianza → acción) y del
patrón "cómo funciona" en pasos. No se replica su profundidad de contenido ni
sus colores/tipografía — esta landing es intencionalmente más corta y directa.

## 4. Alcance

Landing corta de una sola página. Sin FAQ, sin listado de averías frecuentes,
sin sectores atendidos como sección aparte, sin formulario de contacto propio,
sin blog ni páginas adicionales. Si más adelante se decide ampliar, se hace
como iteración separada sobre esta base.

## 5. Stack técnico

- **Vite + React** (JavaScript, no TypeScript).
- **CSS Modules** puro, mobile-first — sin Tailwind ni librerías de UI, para
  mantener el bundle ligero (prioridad: carga rápida en 4G/móvil).
- Sin dependencias de backend, formularios, analytics ni gestión de estado
  compleja — el sitio es enteramente estático.
- Se siguen las buenas prácticas de la skill `vercel-react-best-practices`
  (evitar renders/trabajo innecesario, componentes con una responsabilidad
  clara, imágenes/SVGs optimizados, código limpio y fácil de extender). El
  proyecto debe quedar en un estado fácilmente escalable: agregar secciones,
  cambiar copy, o sustituir iconos por fotos reales sin reescritura.

## 6. Arquitectura de componentes

```
src/
  main.jsx
  App.jsx
  constants/
    contact.js          # teléfono, número wa.me, mensaje pre-cargado, helper buildWhatsAppUrl()
  components/
    Header/
    Hero/
    Services/
    ValueProps/         # "Por qué elegirnos"
    HowItWorks/
    FinalCta/
    Footer/
    WhatsAppFloatingButton/
    icons/               # SVGs a medida (máquina de coser, camión, fábrica, reloj, WhatsApp)
  styles/
    tokens.css           # variables CSS: colores, tipografía, espaciados
```

Cada sección es un componente propio con su `.jsx` + `.module.css` junto al
archivo (co-locados), sin lógica compartida oculta entre ellos. Toda URL de
WhatsApp se construye a través de `constants/contact.js`, que es la única
fuente de verdad para el número y el mensaje — así un cambio futuro de texto
actualiza todos los CTAs a la vez sin tocar cada componente.

## 7. Sistema visual

- **Paleta**: negro (`#0A0A0A`) y dorado/mostaza (~`#C9A24B`, extraído del
  logo) como colores de marca; blanco/crema (`#FAF8F4`) como fondo claro de
  las secciones fuera del hero; gris cálido para texto secundario. Variables
  centralizadas en `styles/tokens.css`.
- **Tipografía**: condensada/bold en mayúsculas para titulares (eco visual del
  logo, vía Google Fonts — ej. Oswald o Bebas Neue) + sans-serif legible para
  cuerpo de texto (ej. Inter).
- **Iconografía**: SVGs lineales a medida en trazo negro/dorado (máquina de
  coser, camión de recogida, fábrica/empresa textil, reloj de rapidez,
  WhatsApp) — sin fotos stock. Estructura preparada para sustituir iconos por
  fotos reales más adelante sin cambiar el layout.
- **Hero**: fondo negro, elemento gráfico de máquina de coser en línea dorada,
  titular fuerte, botón CTA dorado sólido.
- **Resto de secciones**: fondo claro con negro y dorado como acentos
  puntuales (botones, íconos, líneas divisorias).

## 8. Estructura de contenido (en orden)

1. **Header**: logo pequeño + botón "WhatsApp" (visible en desktop; en móvil
   puede simplificarse a solo el logo, ya que el botón flotante cubre el CTA).
2. **Hero**: titular tipo "+20 años reparando máquinas de coser, sin parar tu
   producción", subtítulo mencionando industriales/domésticas + cobertura
   nacional, botón grande "Escribir por WhatsApp".
3. **Servicios** (3 tarjetas): Reparación de máquinas de coser · Soporte a
   empresas del sector textil · Recogida a domicilio. Cada una con ícono,
   título y una línea descriptiva.
4. **Por qué elegirnos** (franja de value props/stats): +20 años de
   experiencia · Cobertura en toda España · Respuesta rápida por WhatsApp ·
   Recogida a domicilio incluida.
5. **Cómo funciona** (3 pasos): 1) Escríbenos por WhatsApp y cuéntanos la
   avería → 2) Coordinamos recogida o visita → 3) Reparamos y te devolvemos la
   máquina lista.
6. **CTA final**: bloque de cierre con titular corto + botón grande de
   WhatsApp, antes del footer.
7. **Footer**: minimalista — logo, teléfono (+34 685 01 80 86), "Servicio en
   toda España", copyright. Sin enlaces a redes sociales.
8. **Botón flotante de WhatsApp**: fijo (sticky/fixed) sobre todas las
   secciones, siempre visible, con `safe-area-inset` considerado para
   móviles con notch/gestos (iOS).

## 9. Mecánica de WhatsApp

- Mensaje único y genérico para todos los CTAs: **"Hola, quisiera más
  información sobre reparación de máquinas de coser."**
- Todos los botones (header, hero, cada tarjeta de servicio si aplica, CTA
  final, botón flotante) usan `buildWhatsAppUrl()` desde
  `constants/contact.js`, que arma `https://wa.me/34685018086?text=<mensaje
  URL-encoded>`.
- Enlaces con `target="_blank" rel="noopener noreferrer"` — en móvil abre la
  app de WhatsApp directamente vía el comportamiento nativo de `wa.me`.

## 10. Responsive y verificación

- Diseño mobile-first: se construye primero para ~375px de ancho y se amplía
  con breakpoints hacia tablet/desktop.
- Verificación manual (no hay tests automatizados — no aplica a un sitio
  estático sin lógica compleja): correr `npm run dev`, revisar en viewport
  móvil que los CTAs tengan área táctil ≥44px, que el botón flotante no tape
  el CTA final ni el footer, y que los enlaces `wa.me` abran correctamente con
  el mensaje pre-cargado. Se confirma explícitamente antes de dar el trabajo
  por completado (no se afirma que "funciona" sin haberlo comprobado).

## 11. Fuera de alcance (explícito)

- Formularios de contacto que envíen datos a un servidor.
- Testimonios/reseñas (no hay contenido real todavía).
- Listado de marcas de máquinas específicas (mensaje genérico por ahora).
- Sección de FAQ, averías frecuentes o sectores atendidos como bloques
  aparte.
- Enlaces a redes sociales.
- Internacionalización / multi-idioma.
- Analítica o tracking de terceros.
