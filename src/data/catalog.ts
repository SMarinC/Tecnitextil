// Catalogue labels and copy. The machines themselves live in src/content/maquinas/.
// Prices are never published: the price is given on enquiry by WhatsApp.

export const MACHINE_TYPE_IDS = ['ojales', 'botones', 'presillas-y-botones'] as const
export type MachineType = (typeof MACHINE_TYPE_IDS)[number]

// Listing order of the groups on /maquinas.
export const MACHINE_TYPES: { id: MachineType; label: string }[] = [
  { id: 'ojales', label: 'Ojales' },
  { id: 'botones', label: 'Botones' },
  { id: 'presillas-y-botones', label: 'Presillas y botones' },
]

export function machineTypeLabel(id: MachineType): string {
  return MACHINE_TYPES.find((type) => type.id === id)?.label ?? id
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
      'Máquinas de ojales, botones y presillas JACK, con tablero y bancada. Consúltanos precio y disponibilidad por WhatsApp.',
    ctaLabel: 'Consultar por WhatsApp',
  },
  jumpNavLabel: 'Tipos de máquina',
  priceOnRequest: 'Precio a consultar',
  priceLabel: 'Precio',
  priceValue: 'A consultar',
  availabilityLabel: 'Disponibilidad',
  includesTable: 'Incluye tablero y bancada',
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
  galleryLabel: 'Fotos de la máquina',
  photoLabel: 'Ver foto',
  breadcrumbLabel: 'Ruta de navegación',
  breadcrumbRoot: 'Máquinas',
}
