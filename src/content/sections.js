// Identificadores de sección y etiquetas del menú. Los componentes usan
// estos ids en <section id>, y el menú se genera desde NAV_ITEMS, así que
// un ancla del menú nunca puede apuntar a una sección inexistente.
export const SECTIONS = {
  about: { id: 'quienes-somos' },
  toldos: { id: 'toldos', navLabel: 'Toldos' },
  services: { id: 'que-hacemos', navLabel: 'Qué hacemos' },
  machineTypes: { id: 'tipos-de-maquina', navLabel: 'Máquinas y marcas' },
  brands: { id: 'marcas' },
  valueProps: { id: 'por-que-elegirnos', navLabel: 'Por qué elegirnos' },
  howItWorks: { id: 'como-es-el-servicio', navLabel: 'Cómo es el servicio' },
  contact: { id: 'contacto', navLabel: 'Contáctanos' },
}

export const NAV_ITEMS = [
  SECTIONS.toldos,
  SECTIONS.services,
  SECTIONS.machineTypes,
  SECTIONS.valueProps,
  SECTIONS.howItWorks,
  SECTIONS.contact,
].map(({ id, navLabel }) => ({ label: navLabel, href: `#${id}` }))
