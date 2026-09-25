// Catalogue categories, labels and copy. The machines themselves live in
// src/content/maquinas/<category>/<model>/. Prices are never published: the price is
// given on enquiry by WhatsApp. Plain text only (no images, no import.meta.env): the
// browser tests import this module.

export interface MachineType {
  id: string
  label: string
}

export interface MachineFamily {
  // URL segment under /maquinas and folder under src/content/maquinas.
  id: string
  // Hub card title and breadcrumb step.
  label: string
  // Its page's <h1>; its SEO title and WhatsApp message are built from it.
  title: string
  // Hub card sentence; its page intro and meta description are built from it.
  summary: string
  // Model folder whose first photo stands for the category on the hub.
  cover: string
  // What every machine of the category comes with, shown on each machine page. Only set
  // when it holds for the whole category.
  includes?: string
  // JACK's own sub-classification, in the order of its menu.
  types: readonly MachineType[]
}

// A new category is one entry here plus its machine folders: its page, hub card,
// breadcrumbs, sitemap entries and build checks all follow from them.
export const MACHINE_FAMILIES: readonly MachineFamily[] = [
  {
    id: 'ojales-botones-presillas',
    label: 'Ojales, botones y presillas',
    title: 'Máquinas de ojales, botones y presillas',
    summary:
      'Máquinas electrónicas JACK de ojales, de coser botones y de presillas, con tablero y bancada.',
    cover: 'jk-t1900gsk-dii',
    includes: 'Incluye tablero y bancada',
    types: [
      { id: 'ojales', label: 'Ojales' },
      { id: 'botones', label: 'Botones' },
      { id: 'presillas-y-botones', label: 'Presillas y botones' },
    ],
  },
  {
    id: 'pespunte',
    label: 'Pespunte',
    title: 'Máquinas de pespunte',
    summary:
      'Máquinas de pespunte JACK de una aguja, con o sin cortahílos, para género fino, medio y grueso.',
    cover: 'jk-a4c-c',
    types: [
      { id: 'sin-cortahilos', label: 'Sin cortahílos' },
      { id: 'con-cortahilos', label: 'Con cortahílos' },
      { id: 'aguja-acompanante', label: 'Aguja acompañante' },
      { id: 'coser-y-cortar', label: 'Coser y cortar' },
    ],
  },
  {
    id: 'pespunte-2-agujas',
    label: 'Pespunte 2 agujas',
    title: 'Máquinas de pespunte de 2 agujas',
    summary:
      'Máquinas de pespunte JACK de dos agujas, fijas o desembragables, con o sin cortahílos.',
    cover: 'jk-58450j-a-103',
    types: [
      { id: 'sin-cortahilos', label: 'Sin cortahílos' },
      { id: 'con-cortahilos', label: 'Con cortahílos' },
    ],
  },
  {
    id: 'remalladora-overlock',
    label: 'Remalladora / Overlock',
    title: 'Remalladoras (overlock)',
    summary:
      'Remalladoras JACK de 2 a 6 hilos: modelos base, con IA, con arrastre superior y cilíndricas.',
    cover: 'jk-c5c-4-m03',
    types: [
      { id: 'c5c', label: 'C5C (Alta eficiencia IA)' },
      { id: 'e5', label: 'E5 (Nuevo modelo)' },
      { id: 'c5t-a', label: 'C5T-A (Arrastre superior)' },
      { id: 'e4s', label: 'E4S (Modelo base)' },
      { id: 'c7', label: 'C7 (Inteligencia Artificial)' },
      { id: 'jk-797', label: 'JK-797 (Cilíndrica)' },
      { id: 'jk-798', label: 'JK-798 (Arrastre superior)' },
      { id: 'c4', label: 'C4 (Electrónica)' },
    ],
  },
]

// For the content schema's enums, which need at least one value. Type ids repeat across
// categories (both kinds of pespunte have "con-cortahilos"), so they are listed once.
export const FAMILY_IDS = MACHINE_FAMILIES.map(({ id }) => id) as [string, ...string[]]
export const MACHINE_TYPE_IDS = [
  ...new Set(MACHINE_FAMILIES.flatMap(({ types }) => types.map(({ id }) => id))),
] as [string, ...string[]]

export function familyById(id: string): MachineFamily {
  const family = MACHINE_FAMILIES.find((candidate) => candidate.id === id)
  if (!family) throw new Error(`Unknown machine category "${id}"`)
  return family
}

export function typeLabel(family: MachineFamily, typeId: string): string {
  return family.types.find(({ id }) => id === typeId)?.label ?? typeId
}

export function modelCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'modelo' : 'modelos'}`
}

export const AVAILABILITY_IDS = ['disponible', 'bajo-pedido'] as const
export type Availability = (typeof AVAILABILITY_IDS)[number]

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  disponible: 'Disponible',
  'bajo-pedido': 'Bajo pedido',
}

export const CATALOG_WHATSAPP_MESSAGE =
  'Hola, quisiera información sobre las máquinas JACK en venta.'

export const CATALOG_COPY = {
  hero: {
    eyebrow: 'Maquinaria JACK',
    title: 'Venta de máquinas de coser industriales',
    intro:
      'Máquinas de coser industriales JACK: pespunte de una y dos agujas, remalladoras y máquinas de ojales, botones y presillas. Elige el tipo de máquina y consúltanos precio y disponibilidad por WhatsApp.',
    ctaLabel: 'Consultar por WhatsApp',
  },
  familiesHeading: 'Tipos de máquina',
  familyIntroSuffix: 'Consúltanos precio y disponibilidad por WhatsApp.',
  familyDescriptionSuffix: 'Consulta precio y disponibilidad por WhatsApp.',
  jumpNavLabel: 'Tipos de máquina',
  priceOnRequest: 'Precio a consultar',
  priceLabel: 'Precio',
  priceValue: 'A consultar',
  availabilityLabel: 'Disponibilidad',
  machineCta: 'Consultar esta máquina por WhatsApp',
  specsHeading: 'Especificaciones',
  service: {
    heading: 'Qué incluye',
    text: 'Te asesoramos para elegir la máquina adecuada y te ayudamos con la instalación y la puesta en marcha. Consúltanos las condiciones de envío a tu zona.',
  },
  warranty: {
    heading: 'Garantía',
    text: 'Garantía oficial del fabricante. Te ayudamos a tramitarla.',
  },
  conditions: {
    label: 'Condiciones de venta: desistimiento y garantía',
    href: '/condiciones-de-venta',
  },
  galleryLabel: 'Fotos de la máquina',
  noPhoto: 'Foto no disponible',
  photoLabel: 'Ver foto',
  breadcrumbLabel: 'Ruta de navegación',
  breadcrumbRoot: 'Máquinas',
  backToCatalogue: 'Todas las máquinas',
  backToFamily: (label: string) => `Volver a ${label}`,
  moreFromFamily: (label: string) => `Ver más máquinas de ${label}`,
}
